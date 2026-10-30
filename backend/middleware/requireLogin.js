// Runs before routes that need a logged-in user.
// The website / Postman must send:   Authorization: Bearer <token>
import User from '../models/User.js';
import { readToken } from '../services/tokenService.js';
import asyncHandler from '../utils/asyncHandler.js';
import HttpError from '../utils/HttpError.js';

export default asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '');
  if (token === '') {
    throw new HttpError(401, 'Please log in first');
  }

  let tokenData;
  try {
    tokenData = readToken(token);
  } catch (error) {
    throw new HttpError(401, 'Invalid or expired token. Please log in again');
  }

  const user = await User.findById(tokenData.userId);
  if (!user) {
    throw new HttpError(401, 'User not found');
  }

  req.user = user;   // controllers after this can use req.user
  next();
});
