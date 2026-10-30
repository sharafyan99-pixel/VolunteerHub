import Application from '../models/Application.js';
import Certificate from '../models/Certificate.js';
import asyncHandler from '../utils/asyncHandler.js';
import HttpError from '../utils/HttpError.js';
import { formatApplication, formatCertificate, getDisplayName } from '../utils/formatters.js';
import { notifyUser } from '../services/notificationService.js';
import { getApprovedHoursByApplication, getOpportunityIds } from '../services/statsService.js';

// Example result: CERT-2026-K7P3QX
async function createCertificateNumber() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  while (true) {
    let randomPart = '';
    for (let i = 0; i < 6; i++) {
      randomPart += letters[Math.floor(Math.random() * letters.length)];
    }
    const number = 'CERT-' + new Date().getFullYear() + '-' + randomPart;
    const numberExists = await Certificate.findOne({ number });
    if (!numberExists) return number;
  }
}

// GET /api/certificates/mine   (volunteer)
export const listMyCertificates = asyncHandler(async (req, res) => {
  const certificates = await Certificate.find({ volunteer: req.user._id }).sort({ createdAt: -1 });
  res.json(certificates.map(formatCertificate));
});

// GET /api/certificates/verify/:number   (anyone - no login)
export const verifyCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findOne({ number: req.params.number.trim().toUpperCase() });
  if (!certificate) {
    throw new HttpError(404, 'Certificate not found. Check the number and try again');
  }
  res.json(formatCertificate(certificate));
});

// GET /api/certificates/issuable   (organization: volunteers who have approved hours but no certificate yet)
export const listIssuable = asyncHandler(async (req, res) => {
  const opportunityIds = await getOpportunityIds(req.user._id);
  const applications = await Application.find({ opportunity: { $in: opportunityIds }, status: 'Approved' })
    .populate('opportunity').populate('volunteer');
  const hoursMap = await getApprovedHoursByApplication(applications.map(application => application._id));

  const readyApplications = applications.filter(application => hoursMap.get(String(application._id)) > 0);
  res.json(readyApplications.map(application => formatApplication(application, { approvedHours: hoursMap.get(String(application._id)) })));
});

// POST /api/certificates   body: { "applicationId": "..." }   (organization)
export const issueCertificate = asyncHandler(async (req, res) => {
  const opportunityIds = await getOpportunityIds(req.user._id);
  const application = await Application.findOne({ _id: req.body.applicationId, opportunity: { $in: opportunityIds } })
    .populate('opportunity').populate('volunteer');
  if (!application || application.status !== 'Approved') {
    throw new HttpError(400, 'Only approved applications can get a certificate');
  }

  const hoursMap = await getApprovedHoursByApplication([application._id]);
  const approvedHours = hoursMap.get(String(application._id)) || 0;
  if (approvedHours === 0) {
    throw new HttpError(400, 'The volunteer has no approved hours yet');
  }

  const certificate = await Certificate.create({
    number: await createCertificateNumber(),
    volunteer: application.volunteer._id,
    application: application._id,
    volunteerName: getDisplayName(application.volunteer),
    organizationName: req.user.organizationName,
    title: application.opportunity.title,
    hours: approvedHours
  });

  application.status = 'Completed';   // the volunteer has now finished this volunteer work
  await application.save();
  await notifyUser(application.volunteer._id, 'Certificate issued', 'Your certificate for "' + application.opportunity.title + '" is ready');
  res.status(201).json(formatCertificate(certificate));
});
