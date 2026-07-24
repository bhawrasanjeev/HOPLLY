import { Category } from '../models/Category.js';
import { Task } from '../models/Task.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    // Recalculate live counts from Task collection
    const categoryCounts = await Task.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    categoryCounts.forEach((item) => {
      if (item._id) {
        countMap[item._id.toLowerCase()] = item.count;
      }
    });

    const result = categories.map((cat) => {
      const obj = cat.toJSON();
      const liveCount = countMap[cat.name.toLowerCase()];
      if (liveCount !== undefined) {
        obj.count = liveCount;
      }
      return obj;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
