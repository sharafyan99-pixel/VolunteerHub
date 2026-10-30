import Application from '../models/Application.js';
import Review from '../models/Review.js';
import asyncHandler from '../utils/asyncHandler.js';
import HttpError from '../utils/HttpError.js';
import { formatReview, getDisplayName } from '../utils/formatters.js';
import { notifyUser } from '../services/notificationService.js';
import { updateUserRating } from '../services/ratingService.js';

// POST /api/reviews   body: { "applicationId": "...", "rating": 5, "comment": "..." }
// A volunteer rates the organization, an organization rates the volunteer.
// It is possible only after the volunteer work is Completed.
export const createReview = asyncHandler(async (req, res) => {
  const { applicationId, comment } = req.body;
  const rating = Number(req.body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new HttpError(400, 'Rating must be a whole number from 1 to 5');
  }

  const application = await Application.findById(applicationId).populate('opportunity');
  if (!application || application.status !== 'Completed') {
    throw new HttpError(400, 'You can leave a review only after the volunteer work is completed');
  }

  let personToRate;
  if (req.user.role === 'volunteer' && String(application.volunteer) === String(req.user._id)) {
    personToRate = application.opportunity.organization;
  } else if (req.user.role === 'organization' && String(application.opportunity.organization) === String(req.user._id)) {
    personToRate = application.volunteer;
  } else {
    throw new HttpError(403, 'This is not your application');
  }

  const alreadyReviewed = await Review.findOne({ fromUser: req.user._id, application: application._id });
  if (alreadyReviewed) {
    throw new HttpError(400, 'You already left a review for this');
  }

  await Review.create({
    fromUser: req.user._id,
    toUser: personToRate,
    application: application._id,
    fromName: getDisplayName(req.user),
    opportunityTitle: application.opportunity.title,
    rating,
    comment
  });

  await updateUserRating(personToRate);   // the new average rating is saved here
  await notifyUser(personToRate, 'New review', getDisplayName(req.user) + ' gave you ' + rating + ' stars');
  res.status(201).json({ message: 'Review saved' });
});

// GET /api/reviews/received   (reviews that other people wrote about me)
export const listReceivedReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ toUser: req.user._id }).sort({ createdAt: -1 });
  res.json(reviews.map(formatReview));
});
