import IRepository from '../interfaces/IRepository';
import IUser from '../interfaces/IUser';

class UserService {
	repository: IRepository<IUser>;
	constructor(repository: IRepository<IUser>) {
		this.repository = repository;
	}

	async getAll(): Promise<IUser[]> {
		return this.repository.getAll();
	}

	async getById(id: number): Promise<IUser | undefined> {
		return this.repository.getById(id);
	}

	async create(user: IUser): Promise<void> {
		this.repository.create(user);
	}

	async update(user: IUser): Promise<void> {
		this.repository.update(user);
	}

	async delete(id: number): Promise<void> {
		this.repository.delete(id);
	}
}

export default UserService;
