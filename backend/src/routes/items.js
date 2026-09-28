import { Router } from 'express';
import { listItems, deleteItem } from '../db/repository.js';

const router = Router();

router.get('/', (_req, res) => res.json({ items: listItems() }));

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid item id' });
  }

  const deleted = deleteItem(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Item not found' });
  }

  res.json({ success: true, message: 'Item deleted successfully' });
});

export default router;
