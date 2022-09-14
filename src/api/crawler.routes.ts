import { Router } from 'express';

import logger from '../config/logger';

const crawlerRoutes = Router();

crawlerRoutes.get('/', async (req, res) => {
	try {
		res.send("Hello World");
	} catch (error) {
		logger.error(error);
	}
});

export { crawlerRoutes };
