import express from 'express';

import { userRoutes } from './user.routes';

const apiRoutes = express.Router();

apiRoutes.use('/user', userRoutes);

export { apiRoutes };
