import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbRepository } from '../db/connection.ts';
import { authenticateJwt, AuthenticatedRequest } from '../middleware/auth.ts';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'cvcraft_super_secret_jwt_key_change_in_production_2026';

// Simple in-memory rate-limiter for auth endpoints
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 mins
  const maxAttempts = 20;

  const userRecord = loginAttempts.get(ip);
  if (!userRecord) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return true;
  }

  if (now - userRecord.firstAttempt > windowMs) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return true;
  }

  if (userRecord.count >= maxAttempts) {
    return false;
  }

  userRecord.count += 1;
  return true;
}

// REGISTER
router.post('/register', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(ip)) {
      res.status(429).json({
        success: false,
        message: 'Too many authentication attempts. Please try again in 15 minutes.',
      });
      return;
    }

    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters.',
      });
      return;
    }

    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
      return;
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
      return;
    }

    const existing = await dbRepository.findUserByEmail(email);
    if (existing) {
      res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please log in.',
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Auto-grant superadmin to designated primary developer / owner email
    const normalizedEmail = email.toLowerCase().trim();
    const isSuperAdminEmail =
      normalizedEmail === 'nirbodh3@gmail.com' ||
      normalizedEmail === 'admin@cvcraft.com';
    const role = isSuperAdminEmail ? 'superadmin' : 'user';

    const user = await dbRepository.createUser({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role,
      status: 'active',
    });

    const token = jwt.sign(
      {
        id: (user as any)._id?.toString() || (user as any).id,
        email: user.email,
        name: user.name,
        role: (user as any).role || role,
        status: (user as any).status || 'active',
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: (user as any)._id?.toString() || (user as any).id,
        name: user.name,
        email: user.email,
        role: (user as any).role || role,
        status: (user as any).status || 'active',
        createdAt: (user as any).createdAt,
      },
      token,
    });
  } catch (err: any) {
    console.error('[Auth Register Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to create account. Please try again.',
    });
  }
});

// LOGIN
router.post('/login', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(ip)) {
      res.status(429).json({
        success: false,
        message: 'Too many authentication attempts. Please try again in 15 minutes.',
      });
      return;
    }

    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
      return;
    }

    const user = await dbRepository.findUserByEmail(email);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    // Check account status
    if ((user as any).status === 'suspended') {
      res.status(403).json({
        success: false,
        message: 'Your account has been suspended by an administrator. Please contact support@cvcraft.com.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    // If email is superadmin, ensure role is superadmin
    const normalizedEmail = user.email.toLowerCase().trim();
    let userRole = (user as any).role || 'user';
    if (normalizedEmail === 'nirbodh3@gmail.com' || normalizedEmail === 'admin@cvcraft.com') {
      userRole = 'superadmin';
    }

    const token = jwt.sign(
      {
        id: (user as any)._id?.toString() || (user as any).id,
        email: user.email,
        name: user.name,
        role: userRole,
        status: (user as any).status || 'active',
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Update lastLoginAt
    try {
      await dbRepository.updateUserLastLogin((user as any)._id?.toString() || (user as any).id);
    } catch {
      // non-blocking
    }

    res.json({
      success: true,
      message: 'Login successful!',
      user: {
        id: (user as any)._id?.toString() || (user as any).id,
        name: user.name,
        email: user.email,
        role: userRole,
        status: (user as any).status || 'active',
        createdAt: (user as any).createdAt,
      },
      token,
    });
  } catch (err: any) {
    console.error('[Auth Login Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Login failed due to a server error. Please try again.',
    });
  }
});

// GET CURRENT USER PROFILE
router.get('/me', authenticateJwt, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await dbRepository.findUserById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const normalizedEmail = (user.email || '').toLowerCase().trim();
    let role = (user as any).role || 'user';
    if (normalizedEmail === 'nirbodh3@gmail.com' || normalizedEmail === 'admin@cvcraft.com') {
      role = 'superadmin';
    }

    res.json({
      success: true,
      user: {
        id: (user as any)._id?.toString() || (user as any).id,
        name: user.name,
        email: user.email,
        role,
        status: (user as any).status || 'active',
        createdAt: (user as any).createdAt,
      },
    });
  } catch (err: any) {
    console.error('[Auth Me Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile.',
    });
  }
});

export default router;
