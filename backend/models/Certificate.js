import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  volunteerName: String,
  organizationName: String,
  title: String,
  hours: Number
}, { timestamps: true });

export default mongoose.model('Certificate', certificateSchema);
