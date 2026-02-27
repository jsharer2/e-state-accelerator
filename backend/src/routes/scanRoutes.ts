import { Router, Request, Response } from 'express';
import multer from 'multer';
import { tmpdir } from 'os';
import { unlink } from 'fs/promises';
import path from 'path';
import { MboxParser } from '../services/mboxParser';
import { SignalDetector } from '../services/signalDetection';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: tmpdir(),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/mbox', 'text/plain', 'application/octet-stream'];
    const allowedExts = ['.mbox', '.txt', '.eml'];
    
    const ext = path.extname(file.originalname).toLowerCase();
    const isMimeAllowed = allowedMimes.includes(file.mimetype);
    const isExtAllowed = allowedExts.includes(ext);

    if (isExtAllowed || isMimeAllowed) {
      cb(null, true);
    } else {
      cb(new Error('Only MBOX files are supported'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024, // 5GB
  },
});

interface ScanRequest extends Request {
  file?: Express.Multer.File;
}

// POST /api/scan/upload - Upload and analyze MBOX file
router.post('/upload', (req: Request, res: Response, next: Function) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      // Handle multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File too large', message: 'Maximum file size is 5GB' });
        }
        return res.status(400).json({ error: err.code, message: err.message });
      }
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req: ScanRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`Processing file: ${req.file.filename}`);

    // Parse MBOX file
    const parser = new MboxParser();
    const messages = await parser.parse(req.file.path);
    console.log(`Extracted ${messages.length} messages`);

    // Expand and normalize domains
    const expandedMessages = parser.expandAndNormalize(messages);
    console.log(`Expanded to ${expandedMessages.length} domain evidence rows`);

    // Detect signals
    const detector = new SignalDetector();
    const messagesWithSignals = detector.detectSignals(expandedMessages);

    // Aggregate results
    const results = detector.aggregate(messagesWithSignals);

    console.log(`Aggregated to ${results.length} unique domains`);

    // Clean up temp file
    await unlink(req.file.path);

    return res.json({
      success: true,
      data: {
        total_messages: messages.length,
        total_evidence_rows: expandedMessages.length,
        total_domains: results.length,
        accounts: results,
      },
    });
  } catch (error) {
    // Clean up temp file on error
    if (req.file) {
      try {
        await unlink(req.file.path);
      } catch {
        // Ignore cleanup errors
      }
    }

    console.error('Error processing file:', error);
    return res.status(500).json({
      error: 'Failed to process file',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/scan/health - Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'scan' });
});

export default router;
