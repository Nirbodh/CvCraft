import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import fs from 'fs';
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
import uploadRoutes from './server/routes/upload.ts';
import { connectDatabase, getDbStatus } from './server/db/connection.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isDev = process.env.NODE_ENV !== 'production';

// Production Trust Proxy (Render sets X-Forwarded-* headers)
if (!isDev) {
  app.set('trust proxy', 1);
}

// 1. Production Security Headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Allow framing from AI Studio preview or self
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  if (!isDev && (req.secure || req.headers['x-forwarded-proto'] === 'https')) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  next();
});

// 2. CORS configuration (supports custom client domain or same-origin)
const clientOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((u) => u.trim())
  : true;

app.use(
  cors({
    origin: clientOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. Health Check Endpoints (for Render and uptime monitoring)
const healthHandler = (_req: Request, res: Response) => {
  const dbStatus = getDbStatus();
  const isHealthy = dbStatus.isMongo || isDev;
  res.status(isHealthy ? 200 : 200).json({
    status: dbStatus.isMongo ? 'healthy' : 'degraded',
    service: 'CVCraft API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
  });
};

app.get('/healthz', healthHandler);
app.get('/api/health', healthHandler);

// 4. REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cvs', cvRoutes);
app.use('/api/extract', extractRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin/templates', adminRoutes);
app.use('/api/admin', adminRoutes);

// 5. Explicit 404 handler for API routes (prevent falling through to index.html)
app.all('/api/*', (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
  });
});

// 6. Safe global error handler (never leaks sensitive credentials or traces)
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
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));

      // Serve index.html for all non-API SPA routes
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
      console.log('[Prod] Serving static build from dist folder.');
    } else {
      console.warn('[Prod Warning] dist folder not found. Please run `npm run build` before starting in production.');
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CVCraft Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
