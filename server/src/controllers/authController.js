import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'hoplly_secret_key_2026';

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    let passwordHash;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || email)}`;

    const newUser = await User.create({
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      password: passwordHash,
      avatar,
      googleSignedIn: false,
      memberSince: 'Just Now',
    });

    const token = jwt.sign({ userId: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: newUser.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Google email is required.' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || email)}`,
        googleSignedIn: true,
        memberSince: 'Just Now',
      });
    } else {
      user.googleSignedIn = true;
      if (avatar) user.avatar = avatar;
      if (name) user.name = name;
      await user.save();
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Google Authentication successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const defaultUser = await User.findOne();
      return res.json(defaultUser ? defaultUser.toJSON() : null);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.toJSON());
  } catch (error) {
    res.status(401).json({ error: 'Invalid authentication token' });
  }
};
