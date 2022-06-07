import { Pool, QueryResult, QueryResultRow } from 'pg';

import config from './configuration';
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

const query = async (
	queryText: string,
	params?: any[]
): Promise<QueryResult<QueryResultRow>> =>
	pool.query(queryText, params);

export default query;
