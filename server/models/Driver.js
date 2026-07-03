import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    titles: { type: Number, required: true, min: 0 },
    wins: { type: Number, required: true, min: 0 },
    podiums: { type: Number, required: true, min: 0 },
    poles: { type: Number, required: true, min: 0 },
    image_path: { type: String, required: true, trim: true },
    image_alt: { type: String, required: true, trim: true },
    crop_class: { type: String, default: 'crop-center', trim: true },
    source_url: { type: String, required: true, trim: true },
    display_order: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

driverSchema.index({ display_order: 1, name: 1 });

export const Driver = mongoose.model('Driver', driverSchema);
