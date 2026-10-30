import { Router, Request, Response } from 'express';
import { extractTextFromDocx, parseCvText } from '../services/documentExtractor.ts';

const router = Router();

// Max document payload size 5MB
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { filename, fileType, fileBase64, rawText } = req.body;

    // Check size limit
    if (fileBase64 && fileBase64.length > (MAX_FILE_SIZE_BYTES * 4) / 3) {
      res.status(400).json({
        success: false,
        message: 'File size exceeds maximum permitted limit of 5MB.',
      });
      return;
    }

    let parsedText = '';

    // Direct text mode
    if (rawText && typeof rawText === 'string') {
      parsedText = rawText;
    } else if (fileBase64) {
      const buffer = Buffer.from(fileBase64, 'base64');

      if (fileType === 'docx' || (filename && filename.toLowerCase().endsWith('.docx'))) {
        parsedText = await extractTextFromDocx(buffer);
      } else if (fileType === 'txt' || (filename && filename.toLowerCase().endsWith('.txt'))) {
        parsedText = buffer.toString('utf-8');
      } else if (fileType === 'pdf' || (filename && filename.toLowerCase().endsWith('.pdf'))) {
        // Simple text buffer check or pass text if pre-extracted
        parsedText = buffer.toString('utf-8');
      } else {
        res.status(400).json({
          success: false,
          message: 'Unsupported file type. Please upload a PDF, DOCX, or TXT file.',
        });
        return;
      }
    } else {
      res.status(400).json({
        success: false,
        message: 'Please provide either document rawText or base64 encoded document.',
      });
      return;
    }

    const extracted = parseCvText(parsedText);

    res.json({
      success: true,
      extracted,
      source: filename || 'Direct Text Input',
    });
  } catch (err: any) {
    console.error('[Document Extraction Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to process document. Please ensure the file is not corrupted.',
    });
  }
});

export default router;
