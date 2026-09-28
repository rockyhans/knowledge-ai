import { Router } from 'express';
import { z } from 'zod';
import { ingest } from '../services/ingestion.js';

const router = Router();

const schema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('note'),
    content: z.string().trim().min(1).max(100000),
    title: z.string().trim().max(200).optional()
  }),
  z.object({
    type: z.literal('url'),
    url: z.string().url(),
    title: z.string().trim().max(200).optional()
  })
]);

router.post('/', async (req, res, next) => {
  try {
    const payload = schema.parse(req.body);
    const item = await ingest(payload);
    res.status(201).json({ item });
  } catch (error) {
    if (error?.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid request', details: error.issues });
    }
    next(error);
  }
});

export default router;
