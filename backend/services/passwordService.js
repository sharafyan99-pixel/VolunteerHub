import bcrypt from 'bcryptjs';

export function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, 10);
}

export function passwordMatches(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}
