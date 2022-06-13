import express from 'express';

import { usersRoutes } from './user.routes';

const apiRoutes = express.Router();

apiRoutes.use('/users', usersRoutes);

export { apiRoutes };
