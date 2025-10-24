
import { Router } from 'express';
import { plugins } from '../plugin-loader';
const router = Router();

router.get('/', async (req, res) => {
  const { plugin, id } = req.query;
  if (!plugin || !id) return res.status(400).json({ error: 'plugin and id required' });

  const p = plugins[String(plugin)];
  if (!p) return res.status(404).json({ error: 'Plugin not found' });

  const data = await p.load(String(id));
  res.json(data);
});

export default router;
