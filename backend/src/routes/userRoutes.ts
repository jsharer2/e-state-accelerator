import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { ScanResult } from '../models/ScanResult.js';

const router = Router();

// GET /api/user/me — validate token and return user profile
router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      onboardingCompleted: user.onboardingCompleted,
      onboardingData: user.onboardingData ?? null,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST /api/user/onboarding — save completed onboarding data
router.post('/onboarding', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await User.findByIdAndUpdate(req.userId, {
      onboardingData: req.body,
      onboardingCompleted: true,
    });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to save onboarding data' });
  }
});

// POST /api/user/scans — save a completed scan result
router.post('/scans', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { totalMessages, totalEvidenceRows, totalDomains, accounts } = req.body as {
      totalMessages?: number;
      totalEvidenceRows?: number;
      totalDomains?: number;
      accounts?: Record<string, unknown>[];
    };

    if (totalMessages === undefined || !accounts) {
      return res.status(400).json({ error: 'Missing scan data' });
    }

    const scan = await ScanResult.create({
      userId: req.userId,
      totalMessages,
      totalEvidenceRows: totalEvidenceRows ?? 0,
      totalDomains: totalDomains ?? accounts.length,
      accounts,
    });

    return res.status(201).json({ scanId: scan._id.toString() });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to save scan' });
  }
});

// GET /api/user/scans — list all saved scans for the user
router.get('/scans', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const scans = await ScanResult.find({ userId: req.userId })
      .select('-accounts')
      .sort({ createdAt: -1 });
    return res.json(scans);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch scan history' });
  }
});

// GET /api/user/scans/:id — get a specific scan's full data
router.get('/scans/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const scan = await ScanResult.findOne({ _id: req.params.id, userId: req.userId });
    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }
    return res.json(scan);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch scan' });
  }
});

export default router;
