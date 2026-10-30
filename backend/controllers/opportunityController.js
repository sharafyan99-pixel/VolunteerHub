import Opportunity from '../models/Opportunity.js';
import asyncHandler from '../utils/asyncHandler.js';
import HttpError from '../utils/HttpError.js';
import { escapeRegex } from '../utils/validators.js';
import { formatOpportunity } from '../utils/formatters.js';

// GET /api/opportunities?category=Education&keyword=teach&city=Yerevan&sort=az
export const listOpportunities = asyncHandler(async (req, res) => {
  const { category, keyword, city, sort } = req.query;
  const filter = { status: 'open' };

  if (category && category !== 'All') {
    filter.category = category;
  }
  if (keyword) {
    const pattern = new RegExp(escapeRegex(keyword), 'i');   // 'i' = ignore capital letters
    filter.$or = [{ title: pattern }, { organizationName: pattern }];
  }
  if (city) {
    filter.city = new RegExp(escapeRegex(city), 'i');
  }

  const sortOrder = sort === 'az' ? { title: 1 } : { createdAt: -1 };
  const opportunities = await Opportunity.find(filter).sort(sortOrder);
  res.json(opportunities.map(formatOpportunity));
});

// GET /api/opportunities/:id
export const getOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await Opportunity.findById(req.params.id);
  if (!opportunity) {
    throw new HttpError(404, 'Opportunity not found');
  }
  res.json(formatOpportunity(opportunity));
});

// POST /api/opportunities   (organization)
export const createOpportunity = asyncHandler(async (req, res) => {
  const { title, category, city, description, startDate, endDate, maxVolunteers } = req.body;

  if (!title || !category || !city || !startDate) {
    throw new HttpError(400, 'Title, category, city and start date are required');
  }
  if (endDate && endDate < startDate) {
    throw new HttpError(400, 'End date cannot be before the start date');
  }

  const opportunity = await Opportunity.create({
    organization: req.user._id,
    organizationName: req.user.organizationName,
    title, category, city, description, startDate,
    endDate: endDate || startDate,
    maxVolunteers: Number(maxVolunteers) || 0
  });
  res.status(201).json(formatOpportunity(opportunity));
});

// GET /api/opportunities/mine   (organization: all my listings)
export const listMyOpportunities = asyncHandler(async (req, res) => {
  const opportunities = await Opportunity.find({ organization: req.user._id }).sort({ createdAt: -1 });
  res.json(opportunities.map(formatOpportunity));
});

// PUT /api/opportunities/:id/status   body: { "status": "closed" }  or  "open"
export const setOpportunityStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (status !== 'open' && status !== 'closed') {
    throw new HttpError(400, 'Status must be "open" or "closed"');
  }

  const opportunity = await Opportunity.findOne({ _id: req.params.id, organization: req.user._id });
  if (!opportunity) {
    throw new HttpError(404, 'Opportunity not found');
  }
  opportunity.status = status;
  await opportunity.save();
  res.json(formatOpportunity(opportunity));
});
