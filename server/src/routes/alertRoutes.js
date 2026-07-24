import express from 'express';
import { getAlerts, markRead } from '../controllers/alertController.js';

const router = express.Router();

router.get('/', getAlerts);
router.put('/mark-read', markRead);

export default router;
