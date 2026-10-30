import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  organizationName: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  city: { type: String, required: true },
  description: { type: String, default: '' },
  startDate: { type: Date, required: true },
  endDate: Date,
  maxVolunteers: { type: Number, default: 0 },          // 0 means unlimited
  status: { type: String, enum: ['open', 'closed'], default: 'open' }
}, { timestamps: true });

export default mongoose.model('Opportunity', opportunitySchema);
