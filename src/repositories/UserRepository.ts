import query from '../config/database';
import IRepository from '../interfaces/IRepository';
import IUser from '../interfaces/IUser';

class UserRepository implements IRepository {
	users: IUser[];

	constructor() {
		this.users = [];
	}

	async getAll(): Promise<IUser[]> {
		const { rows } = await query('SELECT * FROM Tegra.users');

		const users: IUser[] = rows.map((row) => {
			return {
				id: row.id,
				name: row.name,
				email: row.email,
				password: row.password,
				roles: row.roles,
				createdAt: row.created_at,
				updatedAt: row.updated_at,
			};
		});

		return users;
	}

	async getById(id: number): Promise<IUser | undefined> {
		const { rows } = await query(
			'SELECT * FROM Tegra.users WHERE id = $1',
			[id]
		);

		const user: IUser | undefined = rows.map((row) => {
			return {
				id: row.id,
				name: row.name,
				email: row.email,
				password: row.password,
				roles: row.roles,
				createdAt: row.created_at,
				updatedAt: row.updated_at,
			};
		})[0];

		return user;
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
}

export default UserRepository;
