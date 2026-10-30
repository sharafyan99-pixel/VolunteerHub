import Review from '../models/Review.js';
import User from '../models/User.js';

// Rating = average of all stars the user received. No reviews = 0.
export async function updateUserRating(userId) {
  const reviews = await Review.find({ toUser: userId });
  let total = 0;
  for (const review of reviews) {
    total += review.rating;
  }
  const average = reviews.length === 0 ? 0 : Math.round((total / reviews.length) * 10) / 10;
  await User.findByIdAndUpdate(userId, { rating: average, ratingCount: reviews.length });
}

// Returns a Set with the ids of applications that this user already reviewed
export async function getReviewedApplicationIds(userId, applicationIds) {
  const reviews = await Review.find({ fromUser: userId, application: { $in: applicationIds } });
  return new Set(reviews.map(review => String(review.application)));
}
