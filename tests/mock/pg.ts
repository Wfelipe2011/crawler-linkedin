import PGMock2 from 'pgmock2';

import IDatabaseConnection from '../../src/interfaces/IDatabaseConnection';

const mockPg = new PGMock2();

const users = [
	{
		id: 1,
		name: 'John Doe',
		email: 'john@doe.com',
		password: '123456',
		role: 'admin',
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: 2,
		name: 'Mary doe',
		email: 'mary@doe.com',
		password: '123456',
		role: 'admin',
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: 3,
		name: 'John Two',
		email: 'john@two.com',
		password: '123456',
		role: 'admin',
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

class MockPg extends PGMock2 implements IDatabaseConnection {
	constructor() {
		super();
		this.add('SELECT * FROM Tegra.users', [], {
			rowCount: 1,
			rows: users,
		});
		this.add('SELECT * FROM Tegra.users WHERE id = $1', [1], {
			rowCount: 1,
			rows: users.slice(0, 1),
		});
	}

	async connect(): Promise<any> {
		return await mockPg.connect();
	}
}

export default MockPg;
