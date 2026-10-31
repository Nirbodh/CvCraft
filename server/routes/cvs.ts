import { Router, type Response } from 'express';
import { dbRepository } from '../db/connection.ts';
import { authenticateJwt, type AuthenticatedRequest } from '../middleware/auth.ts';

const router = Router();

// Protect all CV endpoints
router.use(authenticateJwt);

// LIST CVS FOR AUTHENTICATED USER
router.get('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const cvs = await dbRepository.getCvsByUser(userId);
    res.json({
      success: true,
      count: cvs.length,
      cvs,
    });
  } catch (err: any) {
    console.error('[Get CVs Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve your CVs.',
    });
  }
});

// GET SINGLE CV (with ownership validation)
router.get('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const cv = await dbRepository.getCvByIdAndUser(id, userId);
    if (!cv) {
      res.status(404).json({
        success: false,
        message: 'CV not found or you do not have permission to access it.',
      });
      return;
    }

    res.json({
      success: true,
      cv,
    });
  } catch (err: any) {
    console.error('[Get Single CV Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve CV.',
    });
  }
});

// CREATE NEW CV
router.post('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const {
      title,
      countryId,
      templateId,
      themeColor,
      fontFamily,
      spacing,
      fontSize,
      margins,
      customHeadings,
      sectionOrder,
      sectionVisibility,
      data,
    } = req.body;

    const sanitizedTitle = (title && typeof title === 'string' && title.trim()) || 'Untitled CV';

    const created = await dbRepository.createCv(userId, {
      title: sanitizedTitle,
      countryId: countryId || 'usa',
      templateId: templateId || 'modern',
      themeColor: themeColor || '#2563eb',
      fontFamily: fontFamily || 'sans',
      spacing: spacing || 'normal',
      fontSize: fontSize || 'normal',
      margins: margins || 'normal',
      customHeadings: customHeadings || {},
      sectionOrder: Array.isArray(sectionOrder) ? sectionOrder : undefined,
      sectionVisibility: sectionVisibility && typeof sectionVisibility === 'object' ? sectionVisibility : undefined,
      data: data || {},
    } as any);

    res.status(201).json({
      success: true,
      message: 'CV saved successfully!',
      cv: created,
    });
  } catch (err: any) {
    console.error('[Create CV Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to save CV.',
    });
  }
});

// UPDATE CV (with ownership validation)
router.put('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const {
      title,
      countryId,
      templateId,
      themeColor,
      fontFamily,
      spacing,
      fontSize,
      margins,
      customHeadings,
      sectionOrder,
      sectionVisibility,
      data,
    } = req.body;

    const existing = await dbRepository.getCvByIdAndUser(id, userId);
    if (!existing) {
      res.status(404).json({
        success: false,
        message: 'CV not found or you do not have permission to update it.',
      });
      return;
    }

    const updatePayload: any = {};
    if (title !== undefined) updatePayload.title = title.trim();
    if (countryId !== undefined) updatePayload.countryId = countryId;
    if (templateId !== undefined) updatePayload.templateId = templateId;
    if (themeColor !== undefined) updatePayload.themeColor = themeColor;
    if (fontFamily !== undefined) updatePayload.fontFamily = fontFamily;
    if (spacing !== undefined) updatePayload.spacing = spacing;
    if (fontSize !== undefined) updatePayload.fontSize = fontSize;
    if (margins !== undefined) updatePayload.margins = margins;
    if (customHeadings !== undefined) updatePayload.customHeadings = customHeadings;
    if (sectionOrder !== undefined) updatePayload.sectionOrder = sectionOrder;
    if (sectionVisibility !== undefined) updatePayload.sectionVisibility = sectionVisibility;
    if (data !== undefined) updatePayload.data = data;

    const updated = await dbRepository.updateCv(id, userId, updatePayload);

    res.json({
      success: true,
      message: 'CV updated successfully!',
      cv: updated,
    });
  } catch (err: any) {
    console.error('[Update CV Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update CV.',
    });
  }
});

// DELETE CV (with ownership validation)
router.delete('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const deleted = await dbRepository.deleteCv(id, userId);
    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'CV not found or you do not have permission to delete it.',
      });
      return;
    }

    res.json({
      success: true,
      message: 'CV deleted successfully.',
    });
  } catch (err: any) {
    console.error('[Delete CV Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete CV.',
    });
  }
});

export default router;
