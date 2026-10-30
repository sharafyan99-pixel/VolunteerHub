// The starting point of the backend.  Run it with:  npm run dev
import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { connectDatabase } from './config/database.js';
import apiRoutes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
app.use(cors());           // lets the website (port 5173) talk to this server (port 3001)
app.use(express.json());   // lets the server read JSON from the website / Postman
app.use('/api', apiRoutes);
app.use(errorHandler);     // must be last

async function startServer() {
  try {
    await connectDatabase();
    app.listen(config.port, () => console.log('API is running on http://localhost:' + config.port));
  } catch (error) {
    console.log('Could not start the server:', error.message);
    console.log('Is MongoDB running? Check MONGO_URI in the .env file.');
  }
}

startServer();
