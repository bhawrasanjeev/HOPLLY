import { Alert } from '../models/Alert.js';

export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts.map((a) => a.toJSON()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markRead = async (req, res) => {
  try {
    const { alertId } = req.body;
    if (alertId) {
      await Alert.findByIdAndUpdate(alertId, { read: true });
    } else {
      await Alert.updateMany({ read: false }, { read: true });
    }
    const updated = await Alert.find().sort({ createdAt: -1 });
    res.json(updated.map((a) => a.toJSON()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
