// Reads the settings from the .env file
import 'dotenv/config';

export const config = {
  port: process.env.PORT || 3001,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET
};
