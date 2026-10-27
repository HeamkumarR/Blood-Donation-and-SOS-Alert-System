/**
 * Admin Dashboard & System Management Controller
 * Comprehensive oversight of users, donors, requests, triage approvals, and analytics
 */
import { Response } from 'express';
import { User } from '../models/User';
import { BloodRequest } from '../models/BloodRequest';
import { SOSAlert } from '../models/SOSAlert';
import { DonationHistory } from '../models/DonationHistory';
import { AuthRequest } from '../middleware/auth';

/**
 * @route   GET /api/admin/dashboard-stats
 * @desc    Get aggregate metrics for the administrative dashboard
 * @access  Private (Admin only)
 */
export const getDashboardStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [totalUsers, totalDonors, activeRequests, activeSOS, fulfilledCount, donationCount] =
      await Promise.all([
        User.countDocuments({ role: 'USER' }),
        User.countDocuments({ isDonor: true }),
        BloodRequest.countDocuments({ requestStatus: { $in: ['PENDING', 'APPROVED', 'MATCHED'] } }),
        SOSAlert.countDocuments({ alertStatus: 'ACTIVE' }),
        BloodRequest.countDocuments({ requestStatus: 'FULFILLED' }),
        DonationHistory.countDocuments({}),
      ]);

    // Blood Group Distribution among registered donors in Tamil Nadu
    const bloodGroupStats = await User.aggregate([
      { $match: { isDonor: true } },
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalDonors,
        activeRequests,
        activeSOS,
        fulfilledCount,
        donationCount,
        bloodGroupStats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve administrative statistics' });
  }
};

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with filtering and pagination
 * @access  Private (Admin only)
 */
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role, city, search } = req.query;
    const filter: Record<string, unknown> = {};

    if (role && role !== 'ALL') filter.role = role;
    if (city) filter.city = new RegExp(String(city), 'i');
    if (search) {
      filter.$or = [
        { fullName: new RegExp(String(search), 'i') },
        { email: new RegExp(String(search), 'i') },
        { phone: new RegExp(String(search), 'i') },
      ];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve users' });
  }
};

/**
 * @route   PATCH /api/admin/users/:id/verify
 * @desc    Toggle user identity verification
 * @access  Private (Admin only)
 */
export const toggleUserVerification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    user.verified = !user.verified;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `User ${user.fullName} is now ${user.verified ? 'VERIFIED' : 'UNVERIFIED'}`,
      verified: user.verified,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update verification' });
  }
};

/**
 * @route   PATCH /api/admin/requests/:id/status
 * @desc    Approve, reject, or mark a blood request fulfilled
 * @access  Private (Admin only)
 */
export const updateRequestStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, rejectionReason, assignedDonorId } = req.body;
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      res.status(404).json({ success: false, message: 'Blood request not found' });
      return;
    }

    if (status) request.requestStatus = status;
    if (rejectionReason) request.rejectionReason = rejectionReason;
    if (assignedDonorId) {
      if (!request.assignedDonors.includes(assignedDonorId)) {
        request.assignedDonors.push(assignedDonorId);
      }
      request.unitsFulfilled = Math.min(request.unitsRequired, request.unitsFulfilled + 1);
      if (request.unitsFulfilled >= request.unitsRequired) {
        request.requestStatus = 'FULFILLED';
      } else {
        request.requestStatus = 'MATCHED';
      }
    }

    await request.save();

    res.status(200).json({
      success: true,
      message: `Request #${request._id} updated to ${request.requestStatus}`,
      data: request,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update blood request status' });
  }
};

/**
 * @route   DELETE /api/admin/requests/:id
 * @desc    Delete a blood request
 * @access  Private (Admin only)
 */
export const deleteRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deleted = await BloodRequest.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Request not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Blood request deleted permanently' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete blood request' });
  }
};
