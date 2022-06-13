import IUser from '../src/interfaces/IUser';
import UserRepository from '../src/repositories/UserRepository';
import MockPg from './mock/pg';

describe('Test user repository', () => {
	it('Return all users', async () => {
		const mockPg = new MockPg();
		const userRepository = new UserRepository(mockPg);
		const users: IUser[] = await userRepository.getAll();
		expect(users).toBeInstanceOf(Array);
	});
});
