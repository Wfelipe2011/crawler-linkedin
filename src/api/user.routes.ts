import { Router } from 'express';

import query from '../config/database';
import logger from '../config/logger';
import UserRepository from '../repositories/UserRepository';
import UserService from '../services/UserService';

const userRoutes = Router();
const userRepository = new UserRepository(query);
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
