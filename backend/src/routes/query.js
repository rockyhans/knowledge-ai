import { Router } from 'express';
import { z } from 'zod';
import { answerQuestion } from '../services/rag.js';

const router = Router();
const schema = z.object({ question: z.string().trim().min(2).max(2000) });

router.post('/', async (req, res, next) => {
  try {
    const { question } = schema.parse(req.body);
    const result = await answerQuestion(question);
    res.json(result);
  } catch (error) {
    if (error?.name === 'ZodError') {
      return res.status(400).json({ error: 'Question must be between 2 and 2000 characters' });
    }
    next(error);
  }
});

export default router;
