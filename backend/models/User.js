import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ['volunteer', 'organization'], required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },          // saved as a hash, never plain text
  phone: String,
  city: String,

  // volunteer fields
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  bio: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  skills: { type: [String], default: [] },
  interests: { type: [String], default: [] },
  availability: { type: [String], default: [] },

  // organization fields
  organizationName: String,
  jobTitle: String,
  foundedYear: Number,
  website: { type: String, default: '' },
  description: { type: String, default: '' },

  // A new user starts with rating 0. It changes only when other people review them.
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },

  settings: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
