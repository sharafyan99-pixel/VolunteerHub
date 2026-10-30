import Application from '../models/Application.js';
import HourLog from '../models/HourLog.js';
import asyncHandler from '../utils/asyncHandler.js';
import HttpError from '../utils/HttpError.js';
import { formatHourLog } from '../utils/formatters.js';
import { notifyUser } from '../services/notificationService.js';
import { getOpportunityIds } from '../services/statsService.js';

// POST /api/hours   body: { "applicationId": "...", "hours": 3, "workDate": "2026-09-15" }   (volunteer)
export const logHours = asyncHandler(async (req, res) => {
  const { applicationId, hours, workDate } = req.body;

  const application = await Application.findOne({ _id: applicationId, volunteer: req.user._id }).populate('opportunity');
  if (!application) {
    throw new HttpError(404, 'Application not found');
  }
  if (application.status !== 'Approved') {
    throw new HttpError(400, 'You can log hours only for approved applications');
  }

  const hoursNumber = Number(hours);
  if (!(hoursNumber > 0 && hoursNumber <= 24)) {
    throw new HttpError(400, 'Hours must be between 1 and 24');
  }

  await HourLog.create({
    volunteer: req.user._id,
    application: application._id,
    opportunity: application.opportunity._id,
    hours: hoursNumber,
    workDate: workDate || new Date()
  });
  await notifyUser(application.opportunity.organization, 'Hours to approve', req.user.firstName + ' ' + req.user.lastName + ' logged ' + hoursNumber + ' hours for "' + application.opportunity.title + '"');
  res.status(201).json({ message: 'Hours sent for approval' });
});

// GET /api/hours/mine   (volunteer)
export const listMyHours = asyncHandler(async (req, res) => {
  const hourLogs = await HourLog.find({ volunteer: req.user._id })
    .populate('opportunity').populate('volunteer').sort({ workDate: -1 });
  res.json(hourLogs.map(formatHourLog));
});

// GET /api/hours/pending   (organization: hours waiting for my decision)
export const listPendingHours = asyncHandler(async (req, res) => {
  const opportunityIds = await getOpportunityIds(req.user._id);
  const hourLogs = await HourLog.find({ opportunity: { $in: opportunityIds }, status: 'Pending' })
    .populate('opportunity').populate('volunteer').sort({ workDate: -1 });
  res.json(hourLogs.map(formatHourLog));
});

// PUT /api/hours/:id/status   body: { "status": "Approved" }  or "Rejected"   (organization)
export const setHourStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (status !== 'Approved' && status !== 'Rejected') {
    throw new HttpError(400, 'Status must be "Approved" or "Rejected"');
  }

  const opportunityIds = await getOpportunityIds(req.user._id);
  const hourLog = await HourLog.findOne({ _id: req.params.id, opportunity: { $in: opportunityIds } }).populate('opportunity');
  if (!hourLog || hourLog.status !== 'Pending') {
    throw new HttpError(404, 'Pending hours not found');
  }

  hourLog.status = status;
  await hourLog.save();
  await notifyUser(hourLog.volunteer, 'Hours ' + status.toLowerCase(), hourLog.hours + ' hours for "' + hourLog.opportunity.title + '" were ' + status.toLowerCase());
  res.json({ message: 'Hours ' + status.toLowerCase() });
});
