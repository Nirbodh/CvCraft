import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import authRoutes from './server/routes/auth.ts';
import cvRoutes from './server/routes/cvs.ts';
import extractRoutes from './server/routes/extract.ts';
import templateRoutes from './server/routes/templates.ts';
import countryRoutes from './server/routes/countries.ts';
import translateRoutes from './server/routes/translate.ts';
import adminRoutes from './src/routes/adminRoutes.ts';
import chatRoutes from './server/routes/chat.ts';
import { connectDatabase, getDbStatus } from './server/db/connection.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isDev = process.env.NODE_ENV !== 'production';

// Security and utility middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check API
app.get('/api/health', (_req: Request, res: Response) => {
  const dbStatus = getDbStatus();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CVCraft API',
    version: '1.0.0',
    database: dbStatus,
  });
});

// REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cvs', cvRoutes);
app.use('/api/extract', extractRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin/templates', adminRoutes);
app.use('/api/admin', adminRoutes);

// Safe global error handler (never leaks sensitive stack traces)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[API Server Error]:', err?.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred.',
  });
});

async function startServer() {
  // Connect to MongoDB Atlas (or local fallback store)
  await connectDatabase();

  if (isDev) {
    // In development mode, mount Vite dev server as middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
    console.log('[Dev] Vite middleware integrated into Express.');
  } else {
    // In production mode, serve pre-built frontend from dist/
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[Prod] Serving static build from dist folder.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CVCraft Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
