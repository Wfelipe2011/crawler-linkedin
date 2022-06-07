import query from '../config/database';
import IRepository from '../interfaces/IRepository';
import IUser from '../interfaces/IUser';

class UserRepository implements IRepository<IUser> {
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
	async getById(id: number): Promise<IUser> {
		const { rows } = await query(
			'SELECT * FROM Tegra.users WHERE id = $1',
			[id]
		);
		const user = rows[0] as IUser;
		return user;
	}
	async create(user: IUser): Promise<boolean> {
		const { rows } = await query(
			'INSERT INTO Tegra.users (name, email, password, roles) VALUES ($1, $2, $3, $4) RETURNING *',
			[user.name, user.email, user.password, user.roles]
		);

		const createdUser = rows[0] as IUser;

		return createdUser ? true : false;
	}
	async update(user: IUser): Promise<boolean> {
		const { rows } = await query(
			'UPDATE Tegra.users SET name = $1, email = $2, password = $3, roles = $4 WHERE id = $5 RETURNING *',
			[user.name, user.email, user.password, user.roles, user.id]
		);

		const updatedUser = rows[0] as IUser;

		return updatedUser ? true : false;
	}
	async delete(id: number): Promise<boolean> {
		const { rows } = await query(
			'DELETE FROM Tegra.users WHERE id = $1 RETURNING *',
			[id]
		);

		const deletedUser = rows[0] as IUser;

		return deletedUser ? true : false;
	}
}

export default UserRepository;
