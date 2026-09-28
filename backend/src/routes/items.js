import { Router } from 'express';
import { listItems } from '../db/repository.js';

const router = Router();
router.get('/', (_req, res) => res.json({ items: listItems() }));
export default router;
