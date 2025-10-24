import { Router } from 'express';
import { plugins } from '../plugin-loader';
const router = Router();

router.get('/', async (req, res) => {
  const q = String(req.query.q || '');
  if (!q) return res.status(400).json({ error: 'q required' });

  const results: any[] = [];
  for (const id in plugins) {
    const plugin = plugins[id];
    if (plugin.search) {
      const r = await plugin.search(q);
      r.forEach((item: any) => results.push(item));
    }
  }

  res.json(results);
});

export default router;
