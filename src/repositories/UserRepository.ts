import query from '../config/database';
import IRepository from '../interfaces/IRepository';
import IUser from '../interfaces/IUser';

class UserRepository implements IRepository {
	users: IUser[];

	constructor() {
		this.users = [
			{
				id: 1,
				name: 'John Doe',
				email: 'john@doe.com',
				password: '123456',
				roles: ['admin'],
			},
			{
				id: 2,
				name: 'Jane Doe',
				email: 'jane@doe.com',
				password: '123456',
				roles: ['user'],
			},
		];
	}

	async getAll(): Promise<IUser[]> {
		const { rows } = await query('SELECT * FROM Tegra.users');
		return rows;
	}

	async getById(id: number): Promise<IUser | undefined> {
		return this.users.find((user) => user.id === id);
	}

	async create(user: IUser): Promise<void> {
		this.users.push(user);
	}

	async update(user: IUser): Promise<void> {
		const index = this.users.findIndex((u) => u.id === user.id);
		this.users[index] = user;
	}

	async delete(id: number): Promise<void> {
		this.users = this.users.filter((user) => user.id !== id);
	}

	async getByEmail(email: string): Promise<IUser | undefined> {
		return this.users.find((user) => user.email === email);
	}

	async getByEmailAndPassword(
		email: string,
		password: string
	): Promise<IUser | undefined> {
		return this.users.find(
			(user) => user.email === email && user.password === password
		);
	}
}

export default UserRepository;
