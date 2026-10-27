/**
 * Blood Request Controller
 * Handles user blood requisition creation, own requests retrieval, and cancellation
 */
import { Response } from 'express';
import { BloodRequest } from '../models/BloodRequest';
import { AuthRequest } from '../middleware/auth';

/**
 * @route   POST /api/requests
 * @desc    Create a new blood requirement request
 * @access  Private (User or Admin)
 */
export const createBloodRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      patientName,
      bloodGroup,
      unitsRequired,
      hospitalName,
      hospitalAddress,
      city,
      district,
      hospitalLatitude,
      hospitalLongitude,
      contactPerson,
      contactPhone,
      emergencyLevel,
      requiredBy,
      medicalNotes,
    } = req.body;

    const newRequest = await BloodRequest.create({
      requester: req.user?._id,
      patientName,
      bloodGroup,
      unitsRequired: Number(unitsRequired) || 1,
      unitsFulfilled: 0,
      hospitalName,
      hospitalAddress,
      city: city || 'Chennai',
      district: district || 'Chennai',
      hospitalLocation: {
        type: 'Point',
        coordinates: [Number(hospitalLongitude) || 80.2707, Number(hospitalLatitude) || 13.0827],
      },
      contactPerson: contactPerson || req.user?.fullName,
      contactPhone: contactPhone || req.user?.phone,
      emergencyLevel: emergencyLevel || 'URGENT',
      requestStatus: 'PENDING',
      requiredBy: requiredBy ? new Date(requiredBy) : new Date(Date.now() + 24 * 60 * 60 * 1000),
      medicalNotes,
      assignedDonors: [],
    });

    res.status(201).json({
      success: true,
      message: 'Blood request submitted successfully for clinical review',
      data: newRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create blood request',
      error: error instanceof Error ? error.message : 'Server error',
    });
  }
};

/**
 * @route   GET /api/requests/my-requests
 * @desc    Get all blood requests created by the authenticated user
 * @access  Private
 */
export const getMyRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const requests = await BloodRequest.find({ requester: req.user?._id })
      .populate('assignedDonors', 'fullName bloodGroup city isAvailable phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve your requests' });
  }
};

/**
 * @route   GET /api/requests/:id
 * @desc    Get request by ID
 * @access  Private
 */
export const getRequestById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const request = await BloodRequest.findById(req.params.id).populate(
      'assignedDonors',
      'fullName bloodGroup city isAvailable'
    );

    if (!request) {
      res.status(404).json({ success: false, message: 'Blood request not found' });
      return;
    }

    // Ensure non-admins can only view their own request
    if (req.user?.role !== 'ADMIN' && String(request.requester) !== String(req.user?._id)) {
      res.status(403).json({ success: false, message: 'Unauthorized to view this request' });
      return;
    }

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve request' });
  }
};

/**
 * @route   PATCH /api/requests/:id/cancel
 * @desc    Cancel a blood request
 * @access  Private
 */
export const cancelRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      res.status(404).json({ success: false, message: 'Blood request not found' });
      return;
    }

    if (req.user?.role !== 'ADMIN' && String(request.requester) !== String(req.user?._id)) {
      res.status(403).json({ success: false, message: 'Unauthorized to cancel this request' });
      return;
    }

    request.requestStatus = 'CANCELLED';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Blood request has been cancelled',
      data: request,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel request' });
  }
};
