interface IRepository<T> {
	getAll(): Promise<T[]>;
	getById(id: number): Promise<T | undefined>;
	create(user: T): Promise<boolean>;
	update(user: T): Promise<boolean>;
	delete(id: number): Promise<boolean>;
}

export default IRepository;
