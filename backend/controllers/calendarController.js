import Application from '../models/Application.js';
import asyncHandler from '../utils/asyncHandler.js';
import { toInputDate } from '../utils/dateUtils.js';

// GET /api/calendar/mine   (volunteer: dates of the work I was approved for)
export const listMyCalendarEvents = asyncHandler(async (req, res) => {
  const applications = await Application.find({ volunteer: req.user._id, status: 'Approved' }).populate('opportunity');
  res.json(applications.map(application => ({
    id: application._id,
    title: application.opportunity.title,
    organizationName: application.opportunity.organizationName,
    city: application.opportunity.city,
    startDate: toInputDate(application.opportunity.startDate),
    endDate: toInputDate(application.opportunity.endDate || application.opportunity.startDate)
  })));
});
