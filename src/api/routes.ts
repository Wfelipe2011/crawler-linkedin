import express from 'express';

import { crawlerRoutes } from './crawler.routes';

const apiRoutes = express.Router();

apiRoutes.use('/crawlers', crawlerRoutes);

export { apiRoutes };
