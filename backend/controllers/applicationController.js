import Application from '../models/Application.js';
import Opportunity from '../models/Opportunity.js';
import asyncHandler from '../utils/asyncHandler.js';
import HttpError from '../utils/HttpError.js';
import { formatApplication } from '../utils/formatters.js';
import { notifyUser } from '../services/notificationService.js';
import { getReviewedApplicationIds } from '../services/ratingService.js';
import { getApprovedHoursByApplication, getOpportunityIds } from '../services/statsService.js';

// Adds the extra info (approved hours, "did I already review it") and formats every application
async function formatList(applications, currentUserId) {
  const applicationIds = applications.map(application => application._id);
  const hoursMap = await getApprovedHoursByApplication(applicationIds);
  const reviewedIds = await getReviewedApplicationIds(currentUserId, applicationIds);

  return applications.map(application => formatApplication(application, {
    approvedHours: hoursMap.get(String(application._id)) || 0,
    reviewedByMe: reviewedIds.has(String(application._id))
  }));
}

// POST /api/applications   body: { "opportunityId": "..." }   (volunteer)
export const applyToOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await Opportunity.findById(req.body.opportunityId);
  if (!opportunity || opportunity.status !== 'open') {
    throw new HttpError(404, 'This opportunity is not available');
  }

  const alreadyApplied = await Application.findOne({ volunteer: req.user._id, opportunity: opportunity._id });
  if (alreadyApplied) {
    throw new HttpError(400, 'You already applied to this opportunity');
  }

  if (opportunity.maxVolunteers > 0) {
    const approvedCount = await Application.countDocuments({ opportunity: opportunity._id, status: { $in: ['Approved', 'Completed'] } });
    if (approvedCount >= opportunity.maxVolunteers) {
      throw new HttpError(400, 'There are no free places left');
    }
  }

  const application = await Application.create({ volunteer: req.user._id, opportunity: opportunity._id });
  await notifyUser(opportunity.organization, 'New applicant', req.user.firstName + ' ' + req.user.lastName + ' applied to "' + opportunity.title + '"');
  res.status(201).json({ id: application._id, message: 'Application sent' });
});

// GET /api/applications/mine   (volunteer)
export const listMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ volunteer: req.user._id })
    .populate('opportunity').populate('volunteer').sort({ createdAt: -1 });
  res.json(await formatList(applications, req.user._id));
});

// DELETE /api/applications/:id   (volunteer withdraws a pending application)
export const withdrawApplication = asyncHandler(async (req, res) => {
  const application = await Application.findOne({ _id: req.params.id, volunteer: req.user._id });
  if (!application) {
    throw new HttpError(404, 'Application not found');
  }
  if (application.status !== 'Pending') {
    throw new HttpError(400, 'Only pending applications can be withdrawn');
  }
  await application.deleteOne();
  res.json({ message: 'Application withdrawn' });
});

// GET /api/applications/received   (organization: people who applied to my listings)
export const listReceivedApplications = asyncHandler(async (req, res) => {
  const opportunityIds = await getOpportunityIds(req.user._id);
  const applications = await Application.find({ opportunity: { $in: opportunityIds } })
    .populate('opportunity').populate('volunteer').sort({ createdAt: -1 });
  res.json(await formatList(applications, req.user._id));
});

// PUT /api/applications/:id/status   body: { "status": "Approved" }  or "Rejected"   (organization)
export const setApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (status !== 'Approved' && status !== 'Rejected') {
    throw new HttpError(400, 'Status must be "Approved" or "Rejected"');
  }

  const opportunityIds = await getOpportunityIds(req.user._id);
  const application = await Application.findOne({ _id: req.params.id, opportunity: { $in: opportunityIds } }).populate('opportunity');
  if (!application) {
    throw new HttpError(404, 'Application not found');
  }
  if (application.status !== 'Pending') {
    throw new HttpError(400, 'This application was already answered');
  }

  application.status = status;
  await application.save();
  await notifyUser(application.volunteer, 'Application ' + status.toLowerCase(), '"' + application.opportunity.title + '" - ' + req.user.organizationName + ' ' + status.toLowerCase() + ' your application');
  res.json({ message: 'Application ' + status.toLowerCase() });
});
