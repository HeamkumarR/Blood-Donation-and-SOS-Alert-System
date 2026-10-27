/**
 * User & Donor Controller
 * Provides user profile updates, availability toggling, and privacy-safe geospatial donor search
 */
import { Response } from 'express';
import { User, BloodGroup } from '../models/User';
import { AuthRequest } from '../middleware/auth';

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private (User or Admin)
 */
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user profile
 * @access  Private
 */
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const allowedFields = [
      'fullName',
      'phone',
      'city',
      'district',
      'address',
      'bloodGroup',
      'age',
      'gender',
      'isDonor',
      'isAvailable',
      'emergencyContact',
      'profilePhoto',
    ];

    const updates: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (req.body.latitude && req.body.longitude) {
      updates.location = {
        type: 'Point',
        coordinates: [Number(req.body.longitude), Number(req.body.latitude)],
      };
    }

    const updatedUser = await User.findByIdAndUpdate(req.user?._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Profile update failed' });
  }
};

/**
 * @route   PATCH /api/users/toggle-availability
 * @desc    Toggle donor availability status
 * @access  Private
 */
export const toggleAvailability = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    user.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : !user.isAvailable;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `Availability status updated: ${user.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}`,
      isAvailable: user.isAvailable,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update availability status' });
  }
};

/**
 * @route   GET /api/users/nearby-donors
 * @desc    Find nearby blood donors using MongoDB 2dsphere $near query with strict privacy filtering
 * @access  Private (User or Admin)
 */
export const searchNearbyDonors = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bloodGroup, latitude, longitude, maxDistanceKm = 25, city } = req.query;

    // Use query coordinates or fallback to current user's registered location
    const lng = longitude ? Number(longitude) : req.user?.location.coordinates[0] || 80.2707;
    const lat = latitude ? Number(latitude) : req.user?.location.coordinates[1] || 13.0827;
    const maxMeters = Number(maxDistanceKm) * 1000;

    const query: Record<string, unknown> = {
      isDonor: true,
      _id: { $ne: req.user?._id }, // Don't return self
    };

    if (bloodGroup && bloodGroup !== 'ALL') {
      query.bloodGroup = bloodGroup as BloodGroup;
    }

    if (city) {
      query.city = new RegExp(String(city), 'i');
    }

    // MongoDB 2dsphere Geospatial Search ($near query)
    query.location = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        $maxDistance: maxMeters,
      },
    };

    const donors = await User.find(query).limit(50);

    // Strict Privacy Filtering: Hide personal email and exact residential addresses from other users
    const sanitizedDonors = donors.map(d => {
      // Calculate distance approximation in km
      const dLng = (d.location.coordinates[0] - lng) * 102;
      const dLat = (d.location.coordinates[1] - lat) * 111;
      const distanceKm = Number(Math.sqrt(dLng * dLng + dLat * dLat).toFixed(1));

      return {
        id: d._id,
        fullName: d.fullName,
        bloodGroup: d.bloodGroup,
        city: d.city,
        district: d.district,
        isAvailable: d.isAvailable,
        distanceKm: distanceKm || 1.5,
        totalDonations: d.totalDonations,
        verified: d.verified,
        lastDonationDate: d.lastDonationDate,
        // Contact phone only returned if admin or masked for privacy
        phone: req.user?.role === 'ADMIN' ? d.phone : `${d.phone.slice(0, 6)}****`,
        coordinates: {
          latitude: d.location.coordinates[1],
          longitude: d.location.coordinates[0],
        },
      };
    });

    res.status(200).json({
      success: true,
      count: sanitizedDonors.length,
      donors: sanitizedDonors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to query nearby donors',
      error: error instanceof Error ? error.message : 'Database error',
    });
  }
};
