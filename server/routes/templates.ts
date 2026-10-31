import express, { type Request, type Response } from 'express';
import { dbRepository } from '../db/connection.ts';

const router = express.Router();

// GET /api/templates - List templates with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { countryId, category, enabledOnly } = req.query;
    const templates = await dbRepository.getTemplates({
      countryId: countryId ? String(countryId) : undefined,
      category: category ? String(category) : undefined,
      enabledOnly: enabledOnly === 'true',
    });
    res.json({ success: true, count: templates.length, templates });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to fetch templates' });
  }
});

// GET /api/templates/:id - Get template by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const template = await dbRepository.getTemplateById(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.json({ success: true, template });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to fetch template' });
  }
});

// POST /api/templates - Create new template
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, countryId, category, defaultLanguage, htmlContent, cssContent, description, isCustomHtml } = req.body;
    if (!name || !countryId) {
      return res.status(400).json({ success: false, message: 'Template name and countryId are required' });
    }

    const created = await dbRepository.createTemplate({
      ...req.body,
      isCustomHtml: isCustomHtml !== undefined ? isCustomHtml : Boolean(htmlContent),
    });
    res.status(201).json({ success: true, template: created });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to create template' });
  }
});

// PUT /api/templates/:id - Update template metadata, HTML/CSS code, version
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updated = await dbRepository.updateTemplate(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.json({ success: true, template: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to update template' });
  }
});

// POST /api/templates/:id/duplicate - Duplicate an existing template
router.post('/:id/duplicate', async (req: Request, res: Response) => {
  try {
    const duplicated = await dbRepository.duplicateTemplate(req.params.id);
    if (!duplicated) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.status(201).json({ success: true, template: duplicated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to duplicate template' });
  }
});

// DELETE /api/templates/:id - Delete a custom template
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await dbRepository.deleteTemplate(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Template not found or cannot be deleted' });
    }
    res.json({ success: true, message: 'Template deleted successfully' });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err?.message || 'Failed to delete template' });
  }
});

export default router;
