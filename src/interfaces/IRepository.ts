import IUser from './IUser';

interface IRepository {
	getAll(): Promise<IUser[]>;
	getById(id: number): Promise<IUser | undefined>;
	create(user: IUser): Promise<void>;
	update(user: IUser): Promise<void>;
	delete(id: number): Promise<void>;
}

export default IRepository;
