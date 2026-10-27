/**
 * Authentication Controller
 * Handles user signup, login with bcrypt validation, JWT issuance, and password recovery
 */
import { Request, Response } from 'express';
import crypto from 'crypto';
import { User } from '../models/User';
import { generateToken, AuthRequest } from '../middleware/auth';

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user / donor
 * @access  Public
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      bloodGroup,
      age,
      gender,
      city,
      district,
      address,
      latitude,
      longitude,
      isDonor,
      isAvailable,
      emergencyContact,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'An account with this email already exists' });
      return;
    }

    // Default to Chennai Central coordinates if not provided
    const userLng = Number(longitude) || 80.2707;
    const userLat = Number(latitude) || 13.0827;

    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      bloodGroup,
      age: Number(age) || 24,
      gender: gender || 'Male',
      city: city || 'Chennai',
      district: district || 'Chennai',
      address: address || 'Anna Salai, Chennai',
      location: {
        type: 'Point',
        coordinates: [userLng, userLat],
      },
      role: 'USER',
      isDonor: isDonor !== undefined ? isDonor : true,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      emergencyContact,
      verified: true,
    });

    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        city: user.city,
        role: user.role,
        isDonor: user.isDonor,
        isAvailable: user.isAvailable,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed due to server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get JWT token
 * @access  Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide both email and password' });
      return;
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        city: user.city,
        role: user.role,
        isDonor: user.isDonor,
        isAvailable: user.isAvailable,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login error',
      error: error instanceof Error ? error.message : 'Server error',
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged in user profile
 * @access  Private
 */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving user' });
  }
};

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset token
 * @access  Public
 */
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ success: false, message: 'No account found with this email' });
      return;
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Password reset token generated (simulated SMS / Email sent)',
      resetToken, // Returned for dev testing
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error sending reset instructions' });
  }
};
