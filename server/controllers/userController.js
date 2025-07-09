import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// ✅ REGISTER
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const newUser = await User.create({ name, email, password });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    res.status(201).json({ token });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// ✅ LOGIN (add this)
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Login failed' });
  }
};

// ✅ GET LOGGED-IN USER PROFILE
export const getUserProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(404).json({ message: 'User not found' });
    res.json(req.user);
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

// ✅ UPDATE USER PROFILE
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        ...(name && { name }),
        ...(email && { email })
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
