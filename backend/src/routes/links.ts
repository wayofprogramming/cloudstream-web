
import { Router } from 'express';
const router = Router();
router.get('/', (req, res) => { res.json({ message: 'Links route' }); });
export default router;
