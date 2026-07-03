import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, trim: true, lowercase: true, default: '' },
    related_driver: { type: String, trim: true, default: '' },
    message: { type: String, required: true, trim: true, minlength: 8 },
    status: { type: String, enum: ['new', 'reviewed', 'archived'], default: 'new' }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ status: 1, createdAt: -1 });

export const Feedback = mongoose.model('Feedback', feedbackSchema);
