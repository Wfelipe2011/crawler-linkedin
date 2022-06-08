import { Router } from 'express';

import logger from '../config/logger';
import PostgresDatabase from '../infra/PostgresDatabase';
import UserRepository from '../repositories/UserRepository';
import UserService from '../services/UserService';

const userRoutes = Router();
const postgresDatabase = new PostgresDatabase();
const userRepository = new UserRepository(postgresDatabase);
const userService = new UserService(userRepository);

userRoutes.get('/', async (req, res) => {
	try {
		const users = await userService.getAll();
		res.send(users);
	} catch (error) {
		logger.error(error);
	}
});

export { userRoutes };
