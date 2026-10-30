import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export function createToken(user) {
  return jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '7d' });
}

export function readToken(token) {
  return jwt.verify(token, config.jwtSecret);   // throws an error if the token is fake or old
}
