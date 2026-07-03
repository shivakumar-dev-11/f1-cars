import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, trim: true, lowercase: true },
    affiliation: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['new', 'contacted', 'archived'], default: 'new' }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ status: 1, createdAt: -1 });

export const Booking = mongoose.model('Booking', bookingSchema);
