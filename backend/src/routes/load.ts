import { Router } from 'express';
import { plugins } from '../plugin-loader';
const router = Router();

router.get('/', async (req, res) => {
  const { pluginId, url } = req.query;
  if (!pluginId || !url) return res.status(400).json({ error: 'pluginId and url required' });

  const plugin = plugins[String(pluginId)];
  if (!plugin || !plugin.load) return res.status(404).json({ error: 'Plugin not found' });

  const data = await plugin.load(String(url));
  res.json(data);
});

export default router;
