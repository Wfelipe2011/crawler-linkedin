import request from 'supertest';

import app from '../src/app';

describe('Test my server', () => {
	it('should return 200', async () => {
		const response = await request(app).get('/');
		expect(response.status).toBe(200);
	});

	it('should return a welcome message', async () => {
		await request(app)
			.get('/')
			.expect('Content-Type', /json/)
			.expect(200, {
				message: 'Welcome to the API',
				version: '1.0.0',
			});
	});
});
