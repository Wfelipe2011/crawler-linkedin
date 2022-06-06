import { Router } from 'express';

import logger from '../config/logger';
import User from '../entities/User';
import UserRepository from '../repositories/UserRepository';
import UserService from '../services/UserService';

const userRoutes = Router();
const userRepository = new UserRepository();
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
