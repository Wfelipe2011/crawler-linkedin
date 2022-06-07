interface IUser {
	id: number;
	name: string;
	email: string;
	password: string;
	roles: string[];
	createdAt: Date;
	updatedAt: Date;
}

export default IUser;
