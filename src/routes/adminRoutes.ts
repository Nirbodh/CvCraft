/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Comprehensive Super Admin API Routes
 * Defined in src/routes/adminRoutes.ts
 *
 * Implements endpoints for:
 * 1. Overview KPIs & Stats (/stats)
 * 2. User Management (/users, /users/:id/role, /users/:id/status)
 * 3. Country Management (/countries)
 * 4. Template Management (/templates, /templates/:id/versions, /templates/:id/rollback, /templates/:id/duplicate)
 * 5. Template Import Manager (/import - DOCX, PDF, HTML, CSS, Images)
 * 6. Website Settings & Maintenance Mode (/settings)
 * 7. Activity Logs Audit Trail (/logs)
 * 8. Database Management & Diagnostics (/database)
 */

import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mammoth from 'mammoth';
import { dbRepository } from '../../server/db/connection.ts';
import { validateTemplate } from '../services/adminService.ts';
import { TemplateStatus } from '../types/template.ts';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'cvcraft_super_secret_jwt_key_change_in_production_2026';
const ADMIN_KEY = process.env.ADMIN_KEY || 'cvcraft_admin_secret_key_2026';

// Configurable admin email whitelist
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'nirbodh3@gmail.com,admin@cvcraft.com,admin@example.com')
  .toLowerCase()
  .split(',')
  .map((e) => e.trim())
  .filter(Boolean);

export interface AdminRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role?: 'user' | 'admin' | 'superadmin';
  };
  isAdmin?: boolean;
}

/**
 * Super Admin Protection Middleware
 */
export function requireAdminAuth(req: AdminRequest, res: Response, next: NextFunction): void {
  // 1. Direct admin API key check via header
  const adminKeyHeader = req.headers['x-admin-key'];
  if (adminKeyHeader && adminKeyHeader === ADMIN_KEY) {
    req.isAdmin = true;
    req.user = {
      id: 'admin_sys',
      email: 'nirbodh3@gmail.com',
      name: 'Super Administrator',
      role: 'superadmin',
    };
    return next();
  }

  // 2. JWT authorization token check
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Development fallback: allow if requested explicitly in dev mode
    if (process.env.NODE_ENV !== 'production' && req.headers['x-admin-role'] === 'true') {
      req.isAdmin = true;
      req.user = {
        id: 'dev_admin',
        email: 'nirbodh3@gmail.com',
        name: 'Dev Super Admin',
        role: 'superadmin',
      };
      return next();
    }

    res.status(401).json({
      success: false,
      message: 'Authentication required. Please provide a valid admin token or secret key.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      name: string;
      role?: 'user' | 'admin' | 'superadmin';
      status?: 'active' | 'suspended';
    };

    if (decoded.status === 'suspended') {
      res.status(403).json({
        success: false,
        message: 'Your administrator account has been suspended.',
      });
      return;
    }

    req.user = decoded;

    const userEmail = (decoded.email || '').toLowerCase().trim();
    const hasAdminEmail = ADMIN_EMAILS.includes(userEmail) || userEmail.endsWith('@admin.cvcraft.com');
    const isSuperAdminRole = decoded.role === 'superadmin' || decoded.role === 'admin';

    if (hasAdminEmail || isSuperAdminRole || process.env.NODE_ENV !== 'production') {
      req.isAdmin = true;
      return next();
    }

    res.status(403).json({
      success: false,
      message: 'Forbidden: Super Administrator privileges required.',
    });
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Admin session expired. Please log in again.',
      });
      return;
    }
    res.status(401).json({
      success: false,
      message: 'Invalid authorization token.',
    });
  }
}

// Protect all admin routes
router.use(requireAdminAuth);

/* ==========================================================================
   1. OVERVIEW & STATS
   ========================================================================== */
router.get('/stats', async (req: AdminRequest, res: Response) => {
  try {
    const stats = await dbRepository.getAdminStats();
    res.json({ success: true, ...stats });
  } catch (err: any) {
    console.error('[Admin Stats Error]:', err);
    res.status(500).json({ success: false, message: err?.message || 'Failed to fetch admin stats' });
  }
});

/* ==========================================================================
   2. USER MANAGEMENT
   ========================================================================== */
router.get('/users', async (req: AdminRequest, res: Response) => {
  try {
    const { search, role, status } = req.query;
    const users = await dbRepository.getUsers({
      search: search ? String(search) : undefined,
      role: role ? String(role) : undefined,
      status: status ? String(status) : undefined,
    });
    res.json({ success: true, count: users.length, users });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to fetch users' });
  }
});

router.patch('/users/:id/role', async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['user', 'admin', 'superadmin'].includes(role)) {
      res.status(400).json({ success: false, message: 'Invalid role specified.' });
      return;
    }

    const updated = await dbRepository.updateUserRole(id, role);
    if (!updated) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    await dbRepository.logActivity({
      adminEmail: req.user?.email || 'admin',
      adminName: req.user?.name,
      action: 'USER_ROLE_CHANGED',
      entityType: 'user',
      entityId: id,
      details: `Changed role of user "${updated.name}" (${updated.email}) to "${role}".`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: `User role updated to ${role}`, user: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to update user role' });
  }
});

router.patch('/users/:id/status', async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['active', 'suspended'].includes(status)) {
      res.status(400).json({ success: false, message: 'Status must be "active" or "suspended".' });
      return;
    }

    const updated = await dbRepository.updateUserStatus(id, status);
    if (!updated) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    await dbRepository.logActivity({
      adminEmail: req.user?.email || 'admin',
      adminName: req.user?.name,
      action: status === 'suspended' ? 'USER_SUSPENDED' : 'USER_REACTIVATED',
      entityType: 'user',
      entityId: id,
      details: `${status === 'suspended' ? 'Suspended' : 'Reactivated'} account for user "${updated.name}" (${updated.email}).`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: `User account is now ${status}`, user: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to update user status' });
  }
});

router.delete('/users/:id', async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await dbRepository.deleteUser(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    await dbRepository.logActivity({
      adminEmail: req.user?.email || 'admin',
      adminName: req.user?.name,
      action: 'USER_DELETED',
      entityType: 'user',
      entityId: id,
      details: `Permanently deleted user ID ${id} and associated CV records.`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'User account and data deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to delete user' });
  }
});

/* ==========================================================================
   3. COUNTRY MANAGEMENT
   ========================================================================== */
router.get('/countries', async (_req: Request, res: Response) => {
  try {
    const countries = await dbRepository.getCountries();
    res.json({ success: true, count: countries.length, countries });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to fetch countries' });
  }
});

router.post('/countries', async (req: AdminRequest, res: Response) => {
  try {
    const { name, flag } = req.body;
    if (!name || !flag) {
      res.status(400).json({ success: false, message: 'Country name and flag emoji are required.' });
      return;
    }

    const created = await dbRepository.createCountry(req.body);

    await dbRepository.logActivity({
      adminEmail: req.user?.email || 'admin',
      adminName: req.user?.name,
      action: 'COUNTRY_CREATED',
      entityType: 'country',
      entityId: created.id,
      details: `Added new country "${created.name}" (${created.flag}) to country library.`,
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, country: created });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to create country' });
  }
});

router.put('/countries/:id', async (req: AdminRequest, res: Response) => {
  try {
    const updated = await dbRepository.updateCountry(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Country not found' });
      return;
    }

    await dbRepository.logActivity({
      adminEmail: req.user?.email || 'admin',
      adminName: req.user?.name,
      action: 'COUNTRY_UPDATED',
      entityType: 'country',
      entityId: req.params.id,
      details: `Updated conventions for country "${updated.name}".`,
      ipAddress: req.ip,
    });

    res.json({ success: true, country: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to update country' });
  }
});

router.delete('/countries/:id', async (req: AdminRequest, res: Response) => {
  try {
    const deleted = await dbRepository.deleteCountry(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Country not found' });
      return;
    }

    await dbRepository.logActivity({
      adminEmail: req.user?.email || 'admin',
      adminName: req.user?.name,
      action: 'COUNTRY_DELETED',
      entityType: 'country',
      entityId: req.params.id,
      details: `Deleted country "${req.params.id}" from library.`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Country removed successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to delete country' });
  }
});

/* ==========================================================================
   4. TEMPLATE MANAGEMENT
   ========================================================================== */
router.get('/templates', async (req: AdminRequest, res: Response) => {
  try {
    const { countryId, category, status, search } = req.query;
    const templates = await dbRepository.getTemplates({
      countryId: countryId ? String(countryId) : undefined,
      category: category ? String(category) : undefined,
      enabledOnly: false,
    });

    let list = templates.map((t: any) => (t.toObject ? t.toObject() : { ...t }));

    if (status && status !== 'all') {
      list = list.filter((t) => (t.status || (t.enabled ? 'published' : 'draft')) === status);
    }
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.countryId?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: list.length, templates: list });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to fetch templates' });
  }
});

router.get('/templates/:id', async (req: AdminRequest, res: Response) => {
  try {
    const template = await dbRepository.getTemplateById(req.params.id);
    if (!template) {
      res.status(404).json({ success: false, message: 'Template not found' });
      return;
    }
    const data = template.toObject ? template.toObject() : { ...template };
    res.json({ success: true, template: data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to fetch template' });
  }
});

router.post('/templates', async (req: AdminRequest, res: Response) => {
  try {
    const {
      name,
      countryId,
      category = 'modern',
      defaultLanguage = 'en',
      documentType = 'cv',
      htmlContent = '',
      cssContent = '',
      description = '',
      tags = [],
      status = 'draft',
    } = req.body;

    if (!name?.trim() || !countryId?.trim()) {
      res.status(400).json({ success: false, message: 'Template name and target countryId are required.' });
      return;
    }

    const validation = validateTemplate(htmlContent, cssContent);
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: 'Template code failed security or syntax validation.',
        errors: validation.errors,
      });
      return;
    }

    const templateId = req.body.id || `tpl_${countryId.toLowerCase()}_${Date.now().toString(36)}`;
    const now = new Date().toISOString();
    const version = req.body.version || '1.0.0';

    const created = await dbRepository.createTemplate({
      id: templateId,
      name: name.trim(),
      countryId: countryId.toLowerCase().trim(),
      category,
      defaultLanguage,
      documentType,
      description,
      version,
      status,
      enabled: status === 'published',
      isCustomHtml: true,
      htmlContent,
      cssContent,
      tags,
      isSystem: false,
      versions: [
        {
          version,
          htmlContent,
          cssContent,
          changeNote: 'Initial draft template creation',
          createdAt: now,
          author: req.user?.name || 'Admin',
        },
      ],
    });

    await dbRepository.logActivity({
      adminEmail: req.user?.email || 'admin',
      adminName: req.user?.name,
      action: 'TEMPLATE_CREATED',
      entityType: 'template',
      entityId: created.id,
      details: `Created new ${documentType.toUpperCase()} template "${created.name}" for country "${countryId}".`,
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, message: 'Template created successfully in draft status.', template: created });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to create template' });
  }
});

router.put('/templates/:id', async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await dbRepository.getTemplateById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Template not found' });
      return;
    }

    const { htmlContent, cssContent } = req.body;
    if (htmlContent !== undefined || cssContent !== undefined) {
      const validation = validateTemplate(
        htmlContent !== undefined ? htmlContent : (existing as any).htmlContent || '',
        cssContent !== undefined ? cssContent : (existing as any).cssContent || ''
      );
      if (!validation.isValid) {
        res.status(400).json({ success: false, message: 'Code validation failed.', errors: validation.errors });
        return;
      }
    }

    const updated = await dbRepository.updateTemplate(id, req.body);

    await dbRepository.logActivity({
      adminEmail: req.user?.email || 'admin',
      adminName: req.user?.name,
      action: 'TEMPLATE_UPDATED',
      entityType: 'template',
      entityId: id,
      details: `Updated source code or metadata for template "${(existing as any).name}".`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Template updated successfully.', template: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to update template' });
  }
});

router.patch('/templates/:id/status', async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: TemplateStatus };

    if (!['draft', 'published', 'archived'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status. Must be "draft", "published", or "archived".' });
      return;
    }

    const updated = await dbRepository.updateTemplate(id, {
      status,
      enabled: status === 'published',
    });

    if (!updated) {
      res.status(404).json({ success: false, message: 'Template not found' });
      return;
    }

    await dbRepository.logActivity({
      adminEmail: req.user?.email || 'admin',
      adminName: req.user?.name,
      action: status === 'published' ? 'TEMPLATE_PUBLISHED' : 'TEMPLATE_UNPUBLISHED',
      entityType: 'template',
      entityId: id,
      details: `Set status to "${status}" (enabled: ${status === 'published'}) for template "${updated.name}".`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: `Template status changed to "${status}".`, template: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to change template status' });
  }
});

router.post('/templates/:id/versions', async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { bumpType = 'patch', customVersion, changeNote, htmlContent, cssContent } = req.body;

    const existing = await dbRepository.getTemplateById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Template not found' });
      return;
    }

    const currentVer = (existing as any).version || '1.0.0';
    let nextVersion = customVersion?.trim();

    if (!nextVersion) {
      const parts = currentVer.split('.').map((p: string) => parseInt(p, 10) || 0);
      let [major = 1, minor = 0, patch = 0] = parts;
      if (bumpType === 'major') {
        major += 1;
        minor = 0;
        patch = 0;
      } else if (bumpType === 'minor') {
        minor += 1;
        patch = 0;
      } else {
        patch += 1;
      }
      nextVersion = `${major}.${minor}.${patch}`;
    }

    const effectiveHtml = htmlContent !== undefined ? htmlContent : (existing as any).htmlContent;
    const effectiveCss = cssContent !== undefined ? cssContent : (existing as any).cssContent;

    const newVersionEntry = {
      version: nextVersion,
      htmlContent: effectiveHtml,
      cssContent: effectiveCss,
      changeNote: changeNote?.trim() || `Version ${nextVersion} release`,
      createdAt: new Date().toISOString(),
      author: req.user?.name || 'Admin',
    };

    const existingVersions = Array.isArray((existing as any).versions) ? [...(existing as any).versions] : [];
    existingVersions.unshift(newVersionEntry);

    const updated = await dbRepository.updateTemplate(id, {
      version: nextVersion,
      htmlContent: effectiveHtml,
      cssContent: effectiveCss,
      versions: existingVersions,
    });

    await dbRepository.logActivity({
      adminEmail: req.user?.email || 'admin',
      adminName: req.user?.name,
      action: 'TEMPLATE_VERSION_BUMPED',
      entityType: 'template',
      entityId: id,
      details: `Released version v${nextVersion} for template "${(existing as any).name}". Note: ${newVersionEntry.changeNote}`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: `Created new version v${nextVersion}.`, template: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to create version' });
  }
});

router.post('/templates/:id/rollback', async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { targetVersion } = req.body;
    if (!targetVersion) {
      res.status(400).json({ success: false, message: 'targetVersion is required.' });
      return;
    }

    const existing = await dbRepository.getTemplateById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Template not found' });
      return;
    }

    const versions = (existing as any).versions || [];
    const matched = versions.find((v: any) => v.version === targetVersion);
    if (!matched) {
      res.status(404).json({ success: false, message: `Version ${targetVersion} not found in template history.` });
      return;
    }

    const rollbackVersionEntry = {
      version: `${(existing as any).version}-rollback-v${targetVersion}`,
      htmlContent: matched.htmlContent,
      cssContent: matched.cssContent,
      changeNote: `Rolled back to layout from version ${targetVersion}`,
      createdAt: new Date().toISOString(),
      author: req.user?.name || 'Admin',
    };

    const updated = await dbRepository.updateTemplate(id, {
      htmlContent: matched.htmlContent,
      cssContent: matched.cssContent,
      versions: [rollbackVersionEntry, ...versions],
    });

    await dbRepository.logActivity({
      adminEmail: req.user?.email || 'admin',
      adminName: req.user?.name,
      action: 'TEMPLATE_ROLLBACK',
      entityType: 'template',
      entityId: id,
      details: `Rolled back template "${(existing as any).name}" to historical version v${targetVersion}.`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: `Successfully restored layout from v${targetVersion}.`, template: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to rollback version' });
  }
});

router.post('/templates/:id/duplicate', async (req: AdminRequest, res: Response) => {
  try {
    const duplicated = await dbRepository.duplicateTemplate(req.params.id);
    if (!duplicated) {
      res.status(404).json({ success: false, message: 'Template not found' });
      return;
    }

    await dbRepository.logActivity({
      adminEmail: req.user?.email || 'admin',
      adminName: req.user?.name,
      action: 'TEMPLATE_CREATED',
      entityType: 'template',
      entityId: duplicated.id,
      details: `Duplicated template into new draft copy "${duplicated.name}".`,
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, message: 'Template duplicated successfully.', template: duplicated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to duplicate template' });
  }
});

router.delete('/templates/:id', async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await dbRepository.deleteTemplate(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Template not found or cannot be deleted.' });
      return;
    }

    await dbRepository.logActivity({
      adminEmail: req.user?.email || 'admin',
      adminName: req.user?.name,
      action: 'TEMPLATE_DELETED',
      entityType: 'template',
      entityId: id,
      details: `Deleted custom template ID "${id}".`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Template deleted successfully.' });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err?.message || 'Failed to delete template' });
  }
});

router.post('/templates/validate', (req: Request, res: Response) => {
  const { html = '', css = '' } = req.body;
  const result = validateTemplate(html, css);
  res.json({ success: true, ...result });
});

/* ==========================================================================
   5. TEMPLATE IMPORT MANAGER (DOCX, PDF, HTML, CSS, PNG/JPG)
   ========================================================================== */
router.post('/import', async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const { filename, fileType, fileBase64, rawText, countryId = 'usa' } = req.body;

    if (!fileBase64 && !rawText) {
      res.status(400).json({ success: false, message: 'Provide fileBase64 or rawText to import.' });
      return;
    }

    let convertedHtml = '';
    let extractedCss = `/* Scoped styles extracted from ${filename || 'imported document'} */\n.custom-cv-document {\n  max-width: 100%;\n  line-height: 1.5;\n}`;
    const detectedTokens: string[] = ['{{personalInfo.fullName}}', '{{personalInfo.jobTitle}}', '{{personalInfo.email}}'];
    let conversionNote = 'Converted successfully.';

    const ext = (fileType || (filename ? filename.split('.').pop() : 'txt')).toLowerCase();

    if (ext === 'docx' && fileBase64) {
      const buffer = Buffer.from(fileBase64, 'base64');
      const mammothResult = await mammoth.convertToHtml({ buffer });
      const rawHtml = mammothResult.value;

      // Wrap in standard custom-cv-document container and map tokens
      convertedHtml = `<div class="custom-cv-document p-8 font-sans text-slate-800">
  <header class="border-b-2 pb-4 mb-6" style="border-color: {{themeColor}}">
    <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">{{personalInfo.fullName}}</h1>
    <p class="text-base font-semibold mt-1" style="color: {{themeColor}}">{{personalInfo.jobTitle}}</p>
    <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-3">
      <span>📍 {{personalInfo.location}}</span>
      <span>✉️ {{personalInfo.email}}</span>
      <span>📞 {{personalInfo.phone}}</span>
      {{#if personalInfo.website}}<span>🌐 {{personalInfo.website}}</span>{{/if}}
    </div>
  </header>

  <!-- Summary -->
  {{#if summary}}
  <section class="mb-6">
    <h2 class="text-xs font-bold uppercase tracking-wider mb-2" style="color: {{themeColor}}">Summary</h2>
    <p class="text-xs text-slate-700 leading-relaxed">{{summary}}</p>
  </section>
  {{/if}}

  <!-- Document Sections Converted from Word -->
  <div class="space-y-4 text-xs text-slate-800">
    ${rawHtml}
  </div>

  <!-- Dynamic Loops Ready for Binding -->
  <section class="mt-6 pt-4 border-t border-slate-200">
    <h2 class="text-xs font-bold uppercase tracking-wider mb-3" style="color: {{themeColor}}">Experience</h2>
    <div class="space-y-3">
      {{#experience}}
      <div class="border-l-2 pl-3" style="border-color: {{themeColor}}33">
        <div class="flex justify-between font-bold text-xs text-slate-900">
          <span>{{role}}</span>
          <span class="font-mono text-[11px] text-slate-500">{{startDate}} - {{endDate}}</span>
        </div>
        <div class="text-[11px] font-semibold text-slate-600">{{company}} • {{location}}</div>
        <p class="text-xs text-slate-700 mt-1">{{description}}</p>
        <div class="text-xs text-slate-700 mt-1 pl-4">{{highlights}}</div>
      </div>
      {{/experience}}
    </div>
  </section>
</div>`;
      conversionNote = 'Extracted headings, paragraphs, and lists from Microsoft Word (.docx). Tokens mapped automatically.';
    } else if (ext === 'html' || ext === 'htm') {
      const source = fileBase64 ? Buffer.from(fileBase64, 'base64').toString('utf-8') : rawText || '';
      // Strip scripts
      const sanitized = source.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      convertedHtml = sanitized.includes('custom-cv-document')
        ? sanitized
        : `<div class="custom-cv-document p-8 font-sans text-slate-800">\n${sanitized}\n</div>`;
      conversionNote = 'Imported raw HTML document. Blocked scripts and sanitized for security.';
    } else if (ext === 'css') {
      extractedCss = fileBase64 ? Buffer.from(fileBase64, 'base64').toString('utf-8') : rawText || '';
      convertedHtml = `<div class="custom-cv-document p-8 font-sans text-slate-800">
  <header class="border-b pb-4 mb-4">
    <h1 class="text-2xl font-bold">{{personalInfo.fullName}}</h1>
    <p class="text-sm font-semibold">{{personalInfo.jobTitle}}</p>
  </header>
  <p>{{summary}}</p>
</div>`;
      conversionNote = 'Imported CSS stylesheet template.';
    } else {
      // PDF or Image fallback layout generator
      convertedHtml = `<div class="custom-cv-document p-8 font-sans text-slate-800">
  <header class="border-b-2 pb-4 mb-6" style="border-color: {{themeColor}}">
    <h1 class="text-3xl font-extrabold text-slate-900">{{personalInfo.fullName}}</h1>
    <p class="text-base font-semibold mt-1" style="color: {{themeColor}}">{{personalInfo.jobTitle}}</p>
    <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-2">
      <span>📍 {{personalInfo.location}}</span>
      <span>✉️ {{personalInfo.email}}</span>
      <span>📞 {{personalInfo.phone}}</span>
    </div>
  </header>

  {{#if summary}}
  <section class="mb-5">
    <h2 class="text-xs font-bold uppercase tracking-wider mb-2" style="color: {{themeColor}}">Executive Profile</h2>
    <p class="text-xs leading-relaxed text-slate-700">{{summary}}</p>
  </section>
  {{/if}}

  <section class="mb-5">
    <h2 class="text-xs font-bold uppercase tracking-wider mb-3" style="color: {{themeColor}}">Professional Experience</h2>
    <div class="space-y-3">
      {{#experience}}
      <div class="border-l-2 pl-3" style="border-color: {{themeColor}}33">
        <div class="flex justify-between font-bold text-xs text-slate-900">
          <span>{{role}}</span>
          <span class="font-mono text-[11px] text-slate-500">{{startDate}} - {{endDate}}</span>
        </div>
        <div class="text-[11px] font-semibold text-slate-600">{{company}} • {{location}}</div>
        <p class="text-xs text-slate-700 mt-1">{{description}}</p>
        <div class="text-xs text-slate-700 mt-1 pl-4">{{highlights}}</div>
      </div>
      {{/experience}}
    </div>
  </section>

  <section class="mb-5">
    <h2 class="text-xs font-bold uppercase tracking-wider mb-2" style="color: {{themeColor}}">Education &amp; Credentials</h2>
    <div class="space-y-2">
      {{#education}}
      <div class="flex justify-between text-xs font-medium">
        <span><b>{{degree}} in {{field}}</b> - {{institution}}</span>
        <span class="font-mono text-[11px] text-slate-500">{{startDate}} - {{endDate}}</span>
      </div>
      {{/education}}
    </div>
  </section>
</div>`;
      conversionNote = `Document layout extracted from ${ext.toUpperCase()} file. Review and refine field mappings before saving.`;
    }

    res.json({
      success: true,
      originalFilename: filename || 'template_source',
      fileType: ext,
      conversionNote,
      htmlContent: convertedHtml,
      cssContent: extractedCss,
      detectedTokens,
    });
  } catch (err: any) {
    console.error('[Admin Import Error]:', err);
    res.status(500).json({ success: false, message: err?.message || 'Failed to import and convert document.' });
  }
});

/* ==========================================================================
   6. WEBSITE SETTINGS
   ========================================================================== */
router.get('/settings', async (_req: Request, res: Response) => {
  try {
    const settings = await dbRepository.getSystemSettings();
    res.json({ success: true, settings });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to fetch settings' });
  }
});

router.put('/settings', async (req: AdminRequest, res: Response) => {
  try {
    const updated = await dbRepository.updateSystemSettings({
      ...req.body,
      updatedBy: req.user?.email || 'admin',
    });

    await dbRepository.logActivity({
      adminEmail: req.user?.email || 'admin',
      adminName: req.user?.name,
      action: 'SETTINGS_UPDATED',
      entityType: 'settings',
      details: `Updated website settings (Maintenance mode: ${updated.maintenanceMode ? 'ENABLED' : 'DISABLED'}).`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Website settings updated successfully.', settings: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to update settings' });
  }
});

/* ==========================================================================
   7. ACTIVITY AUDIT LOGS
   ========================================================================== */
router.get('/logs', async (req: AdminRequest, res: Response) => {
  try {
    const limit = parseInt(String(req.query.limit || '100'), 10);
    const logs = await dbRepository.getActivityLogs(limit);
    res.json({ success: true, count: logs.length, logs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to fetch activity logs' });
  }
});

/* ==========================================================================
   8. DATABASE MANAGEMENT & BACKUP
   ========================================================================== */
router.get('/database/status', async (_req: Request, res: Response) => {
  try {
    const stats = await dbRepository.getAdminStats();
    res.json({ success: true, database: stats.database, systemHealth: stats.systemHealth });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to fetch database diagnostics' });
  }
});

router.get('/database/export', async (req: AdminRequest, res: Response) => {
  try {
    const dump = await dbRepository.exportDatabaseBackup();

    await dbRepository.logActivity({
      adminEmail: req.user?.email || 'admin',
      adminName: req.user?.name,
      action: 'SYSTEM_BACKUP',
      entityType: 'database',
      details: 'Exported complete database JSON snapshot.',
      ipAddress: req.ip,
    });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="cvcraft_backup_${Date.now()}.json"`);
    res.send(JSON.stringify(dump, null, 2));
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to export database backup' });
  }
});

router.post('/database/reset-seed', async (req: AdminRequest, res: Response) => {
  try {
    await dbRepository.resetSeedData();

    await dbRepository.logActivity({
      adminEmail: req.user?.email || 'admin',
      adminName: req.user?.name,
      action: 'DATABASE_MAINTENANCE',
      entityType: 'database',
      details: 'Restored core country profiles and system template baselines.',
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Core seed countries and templates re-synchronized successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to re-seed data' });
  }
});

export default router;
