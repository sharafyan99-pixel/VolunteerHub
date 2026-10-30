import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import HttpError from '../utils/HttpError.js';
import { isValidEmail } from '../utils/validators.js';
import { formatUser } from '../utils/formatters.js';
import { hashPassword, passwordMatches } from '../services/passwordService.js';
import { createToken } from '../services/tokenService.js';

const MIN_PASSWORD_LENGTH = 8;

// POST /api/auth/signup
export const signup = asyncHandler(async (req, res) => {
  const { role, email, password, confirmPassword, phone, city } = req.body;

  if (role !== 'volunteer' && role !== 'organization') {
    throw new HttpError(400, 'Role must be "volunteer" or "organization"');
  }
  if (!isValidEmail(email)) {
    throw new HttpError(400, 'Please enter a valid email address');
  }
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    throw new HttpError(400, 'Password must be at least ' + MIN_PASSWORD_LENGTH + ' characters');
  }
  if (password !== confirmPassword) {
    throw new HttpError(400, 'Passwords do not match');
  }
  if (role === 'organization' && !city) {
    throw new HttpError(400, 'Please choose your city');   // volunteers can add a city later in Account settings
  }

  const emailAlreadyUsed = await User.findOne({ email: email.toLowerCase() });
  if (emailAlreadyUsed) {
    throw new HttpError(409, 'This email is already registered');
  }

  const newUser = {
    role: role,
    email: email,
    phone: phone,
    city: city,
    password: await hashPassword(password)
  };

  if (role === 'volunteer') {
    if (!req.body.firstName || !req.body.lastName) {
      throw new HttpError(400, 'First name and last name are required');
    }
    newUser.firstName = req.body.firstName;
    newUser.lastName = req.body.lastName;
  } else {
    if (!req.body.organizationName || !req.body.jobTitle) {
      throw new HttpError(400, 'Organization name and your job title are required');
    }
    newUser.organizationName = req.body.organizationName;
    newUser.jobTitle = req.body.jobTitle;
    newUser.foundedYear = req.body.foundedYear;
    newUser.description = req.body.description;
  }

  const user = await User.create(newUser);   // rating starts at 0, no applications, no hours
  res.status(201).json({ token: createToken(user), user: formatUser(user) });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: (email || '').toLowerCase() });
  const passwordIsCorrect = user && await passwordMatches(password || '', user.password);
  if (!passwordIsCorrect) {
    throw new HttpError(401, 'Wrong email or password');
  }

  res.json({ token: createToken(user), user: formatUser(user) });
});

// PUT /api/auth/password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!(await passwordMatches(currentPassword || '', req.user.password))) {
    throw new HttpError(400, 'Current password is wrong');
  }
  if (!newPassword || newPassword.length < MIN_PASSWORD_LENGTH) {
    throw new HttpError(400, 'New password must be at least ' + MIN_PASSWORD_LENGTH + ' characters');
  }
  if (newPassword !== confirmNewPassword) {
    throw new HttpError(400, 'New passwords do not match');
  }

  req.user.password = await hashPassword(newPassword);
  await req.user.save();
  res.json({ message: 'Password updated' });
});
