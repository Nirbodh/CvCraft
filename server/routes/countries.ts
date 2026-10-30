import express, { Request, Response } from 'express';
import { dbRepository } from '../db/connection.ts';

const router = express.Router();

// GET /api/countries - List all countries
router.get('/', async (_req: Request, res: Response) => {
  try {
    const countries = await dbRepository.getCountries();
    res.json({ success: true, count: countries.length, countries });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to fetch countries' });
  }
});

// GET /api/countries/:id - Get country by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const country = await dbRepository.getCountryById(req.params.id);
    if (!country) {
      return res.status(404).json({ success: false, message: 'Country not found' });
    }
    res.json({ success: true, country });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to fetch country' });
  }
});

// POST /api/countries - Add new country
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, flag } = req.body;
    if (!name || !flag) {
      return res.status(400).json({ success: false, message: 'Country name and flag are required' });
    }
    const created = await dbRepository.createCountry(req.body);
    res.status(201).json({ success: true, country: created });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to create country' });
  }
});

// PUT /api/countries/:id - Update country
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updated = await dbRepository.updateCountry(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Country not found' });
    }
    res.json({ success: true, country: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to update country' });
  }
});

// DELETE /api/countries/:id - Delete country
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await dbRepository.deleteCountry(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Country not found' });
    }
    res.json({ success: true, message: 'Country deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to delete country' });
  }
});

export default router;
