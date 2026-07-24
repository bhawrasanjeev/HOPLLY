import { Task } from '../models/Task.js';
import { Alert } from '../models/Alert.js';
import { User } from '../models/User.js';

export const getTasks = async (req, res) => {
  try {
    const { search, category, status } = req.query;
    const filter = {};

    if (category) {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { location: searchRegex },
      ];
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks.map((t) => t.toJSON()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      budget,
      location,
      distance,
      time,
      posterName,
      posterAvatar,
      searchRadiusMiles,
      requiredTools,
      timeEstimate,
    } = req.body;

    if (!title || !description || !category || budget === undefined) {
      return res.status(400).json({ error: 'Title, description, category, and budget are required.' });
    }

    const newTask = await Task.create({
      title,
      description,
      category,
      budget: Number(budget),
      status: 'pending',
      location: location || 'Nearby Neighborhood',
      distance: distance || '0.5 mi',
      time: time || 'Flexible Today',
      postedAt: 'Just now',
      posterName: posterName || 'Community Member',
      posterAvatar: posterAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      searchRadiusMiles: searchRadiusMiles || 5,
      requiredTools: requiredTools || 'Standard tools if applicable',
      timeEstimate: timeEstimate || '1 - 2 hours',
    });

    // Automatically create a notification alert for nearby community helpers
    await Alert.create({
      type: 'new_nearby',
      title: 'Your task is live!',
      message: `"${newTask.title}" was posted to nearby helpers in your ${newTask.searchRadiusMiles || 5}-mile radius with budget Rs. ${newTask.budget}.`,
      time: 'Just now',
      read: false,
      taskId: newTask._id.toString(),
      actionLabel: 'View Details',
    });

    res.status(201).json(newTask.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const acceptTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { acceptedBy, acceptedByAvatar } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.status !== 'pending') {
      return res.status(400).json({ error: `Task cannot be accepted because it is currently ${task.status}.` });
    }

    const helperName = acceptedBy || 'Community Helper';
    task.status = 'accepted';
    task.acceptedBy = helperName;
    if (acceptedByAvatar) task.acceptedByAvatar = acceptedByAvatar;
    await task.save();

    // Create alert for task accepted
    await Alert.create({
      type: 'task_accepted',
      title: 'Task Accepted Successfully',
      message: `You accepted "${task.title}". You can contact ${task.posterName} via AI Assistant support or messages.`,
      time: 'Just now',
      read: false,
      taskId: task._id.toString(),
      actionLabel: 'View Task',
    });

    res.json(task.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.status = 'completed';
    await task.save();

    await Alert.create({
      type: 'task_completed',
      title: 'Task Marked Completed',
      message: `"${task.title}" has been marked as complete. Funds of Rs. ${task.budget}.00 were processed.`,
      time: 'Just now',
      read: false,
      actionLabel: 'Leave Review',
      taskId: task._id.toString(),
    });

    res.json(task.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
