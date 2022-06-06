import { Pool, QueryArrayConfig } from 'pg';

import config from './';
import logger from './logger';

const pool = new Pool({
	connectionString: config.database.url,
});

pool.on('connect', () => {
	logger.info('Connected to the database');
});

pool.on('error', (err) => {
	logger.error(err);
});

const query = (queryText: string, params?: Array<any>) =>
	pool.query(queryText, params);

export default query;
