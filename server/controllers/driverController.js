import { Driver } from '../models/Driver.js';

export async function listDrivers(_req, res, next) {
  try {
    const drivers = await Driver.find({})
      .sort({ display_order: 1, name: 1 })
      .lean();

    res.json({ drivers });
  } catch (error) {
    next(error);
  }
}

export async function getDriver(req, res, next) {
  try {
    const driver = await Driver.findOne({ slug: req.params.slug }).lean();

    if (!driver) {
      res.status(404).json({ error: 'Driver not found' });
      return;
    }

    res.json({ driver });
  } catch (error) {
    next(error);
  }
}
