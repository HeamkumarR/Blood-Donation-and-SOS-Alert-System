/**
 * Emergency SOS Alert Controller
 * Broadcasts emergency trauma beacons and finds matching donors within geographical radius
 */
import { Response } from 'express';
import { SOSAlert } from '../models/SOSAlert';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

/**
 * @route   POST /api/sos/trigger
 * @desc    Broadcast an emergency SOS alert and notify nearby compatible donors
 * @access  Private (User or Admin)
 */
export const triggerSOSAlert = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bloodGroup, emergencyMessage, locationName, latitude, longitude } = req.body;

    const lng = Number(longitude) || req.user?.location.coordinates[0] || 80.2707;
    const lat = Number(latitude) || req.user?.location.coordinates[1] || 13.0827;

    // Find nearby compatible donors within 15 km (15,000 meters)
    const nearbyDonors = await User.find({
      isDonor: true,
      isAvailable: true,
      bloodGroup: { $in: [bloodGroup, 'O-'] }, // Compatible donor logic (O- is universal donor)
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: 15000,
        },
      },
    }).limit(20);

    const newSOS = await SOSAlert.create({
      user: req.user?._id,
      userName: req.user?.fullName,
      userPhone: req.user?.phone,
      bloodGroup,
      emergencyMessage: emergencyMessage || 'URGENT: Patient experiencing major blood trauma in Chennai.',
      locationName: locationName || 'Chennai Metropolitan Health Corridor',
      location: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      alertStatus: 'ACTIVE',
      urgency: 'CRITICAL',
      notifiedDonorsCount: nearbyDonors.length,
    });

    res.status(201).json({
      success: true,
      message: `Emergency SOS #${newSOS._id} broadcasted. ${nearbyDonors.length} nearby donors notified!`,
      data: newSOS,
      notifiedDonors: nearbyDonors.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to broadcast SOS alert',
      error: error instanceof Error ? error.message : 'Server error',
    });
  }
};

/**
 * @route   GET /api/sos/active
 * @desc    Get all active SOS emergencies
 * @access  Private
 */
export const getActiveSOSAlerts = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const alerts = await SOSAlert.find({ alertStatus: { $in: ['ACTIVE', 'DISPATCHED'] } }).sort({
      createdAt: -1,
    });

    // Mask phone numbers for user privacy
    const sanitized = alerts.map(a => ({
      id: a._id,
      bloodGroup: a.bloodGroup,
      locationName: a.locationName,
      coordinates: {
        latitude: a.location.coordinates[1],
        longitude: a.location.coordinates[0],
      },
      alertStatus: a.alertStatus,
      urgency: a.urgency,
      notifiedDonorsCount: a.notifiedDonorsCount,
      timestamp: a.createdAt,
      emergencyMessage: a.emergencyMessage,
    }));

    res.status(200).json({
      success: true,
      count: sanitized.length,
      data: sanitized,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve SOS alerts' });
  }
};

/**
 * @route   PATCH /api/sos/:id/resolve
 * @desc    Mark SOS as resolved or dispatched (Admin only)
 * @access  Private (Admin)
 */
export const updateSOSStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const alert = await SOSAlert.findById(req.params.id);

    if (!alert) {
      res.status(404).json({ success: false, message: 'SOS alert not found' });
      return;
    }

    alert.alertStatus = status || 'RESOLVED';
    if (status === 'RESOLVED') alert.resolvedAt = new Date();
    if (status === 'DISPATCHED') alert.dispatchedAt = new Date();

    await alert.save();

    res.status(200).json({
      success: true,
      message: `SOS status updated to ${alert.alertStatus}`,
      data: alert,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update SOS status' });
  }
};
