import { Pool, QueryResult, QueryResultRow } from 'pg';

import config from '../config/configuration';
import logger from '../config/logger';
import IDatabaseConnection from '../interfaces/IDatabaseConnection';

class PostgresDatabase implements IDatabaseConnection {
	private pool: Pool;

	constructor() {
		this.pool = new Pool({
			connectionString: config.database.url,
		});
	}

	async connect(): Promise<void> {
		this.pool.on('connect', () => {
			logger.info('Connected to the database');
		});

		this.pool.on('error', (err) => {
			logger.error(err);
		});
	}

	async query(
		queryText: string,
		params?: any[]
	): Promise<QueryResult<QueryResultRow>> {
		return this.pool.query(queryText, params);
	}
}

export default PostgresDatabase;
