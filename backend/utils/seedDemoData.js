// OPTIONAL: fills the database with 2 demo organizations and 4 opportunities for testing.
// Run once with:  npm run seed      Demo password for both: Demo12345
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import User from '../models/User.js';
import Opportunity from '../models/Opportunity.js';
import { hashPassword } from '../services/passwordService.js';

await connectDatabase();
const password = await hashPassword('Demo12345');

async function createOrganization(name, email, city) {
  const existing = await User.findOne({ email });
  if (existing) return existing;
  return User.create({ role: 'organization', organizationName: name, jobTitle: 'Coordinator', email, city, password });
}

const greenArmenia = await createOrganization('Green Armenia', 'green@demo.am', 'Yerevan');
const itAcademy = await createOrganization('IT Academy Armenia', 'itacademy@demo.am', 'Gyumri');

if (await Opportunity.countDocuments() === 0) {
  await Opportunity.insertMany([
    { organization: greenArmenia._id, organizationName: greenArmenia.organizationName, title: 'Dilijan Forest Clean-Up Drive', category: 'Environment', city: 'Dilijan', description: 'Help us clean the forest trails.', startDate: '2026-11-15', endDate: '2026-11-15', maxVolunteers: 30 },
    { organization: greenArmenia._id, organizationName: greenArmenia.organizationName, title: 'Tree Planting Day', category: 'Environment', city: 'Yerevan', description: 'Plant trees in the city park.', startDate: '2026-11-22', endDate: '2026-11-22' },
    { organization: itAcademy._id, organizationName: itAcademy.organizationName, title: 'Code for Good Hackathon', category: 'Technology', city: 'Gyumri', description: 'Build tools for NGOs.', startDate: '2026-12-01', endDate: '2026-12-03', maxVolunteers: 20 },
    { organization: itAcademy._id, organizationName: itAcademy.organizationName, title: 'Teach Kids to Code', category: 'Education', city: 'Yerevan', description: 'Weekly coding lessons for children.', startDate: '2026-11-10', endDate: '2026-12-20' }
  ]);
}
console.log('Demo data added. Log in as green@demo.am / Demo12345');
await mongoose.disconnect();
