import dotenv from 'dotenv';

dotenv.config({
	path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const config = {
	database: {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		name: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		url: process.env.DB_URL,
	},
	server: {
		port: process.env.SERVER_PORT,
	},
	jwt: {
		secret: process.env.JWT_SECRET,
		expiresIn: process.env.JWT_EXPIRES_IN,
	},
};

export default config;
