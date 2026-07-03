import { Router } from 'express';
import { getDriver, listDrivers } from '../controllers/driverController.js';

export const driverRoutes = Router();

driverRoutes.get('/', listDrivers);
driverRoutes.get('/:slug', getDriver);
