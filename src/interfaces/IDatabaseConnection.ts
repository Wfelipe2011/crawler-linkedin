interface IDatabaseConnection {
	connect(): Promise<any>;
	query(queryText: string, params?: any[]): Promise<any>;
}

export default IDatabaseConnection;
