import asyncHandler from '../utils/asyncHandler.js';
import { pickFields } from '../utils/validators.js';
import { formatUser } from '../utils/formatters.js';
import { getVolunteerStats, getOrganizationStats } from '../services/statsService.js';

const VOLUNTEER_FIELDS = ['firstName', 'lastName', 'phone', 'city', 'dateOfBirth', 'bio', 'linkedinUrl', 'skills', 'interests', 'availability'];
const ORGANIZATION_FIELDS = ['organizationName', 'jobTitle', 'foundedYear', 'phone', 'city', 'website', 'description'];

// GET /api/users/me  - my profile and my numbers (hours, completed work, rating ...)
export const getMyProfile = asyncHandler(async (req, res) => {
  const stats = req.user.role === 'volunteer'
    ? await getVolunteerStats(req.user)
    : await getOrganizationStats(req.user);
  res.json({ user: formatUser(req.user), stats });
});

// PUT /api/users/me  - edit my profile (the email cannot be changed)
export const updateMyProfile = asyncHandler(async (req, res) => {
  const allowedFields = req.user.role === 'volunteer' ? VOLUNTEER_FIELDS : ORGANIZATION_FIELDS;
  const changes = pickFields(req.body, allowedFields);
  if (changes.dateOfBirth === '') {
    changes.dateOfBirth = null;
  }
  req.user.set(changes);
  await req.user.save();
  res.json({ user: formatUser(req.user) });
});

// PUT /api/users/me/settings   body: { "notifications": {...}, "privacy": {...} }
export const updateMySettings = asyncHandler(async (req, res) => {
  const oldSettings = req.user.settings || {};
  req.user.settings = {
    notifications: { ...oldSettings.notifications, ...req.body.notifications },
    privacy: { ...oldSettings.privacy, ...req.body.privacy }
  };
  req.user.markModified('settings');
  await req.user.save();
  res.json({ user: formatUser(req.user) });
});
