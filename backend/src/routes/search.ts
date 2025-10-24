import { Router, Request, Response } from 'express';
import { plugins } from '../plugin-loader';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const q = String(req.query.q || '');
  if (!q) return res.status(400).json({ error: 'q required' });

  const results: any[] = []; // ✅ Explicitly typed array

  for (const id in plugins) {
    const p = plugins[id];
    if (p.search) {
      const r: any[] = await p.search(q); // ✅ Ensure it's typed as array
      r.forEach((item: any) => results.push(item));
    }
  }

  res.json(results);
});

export default router;
