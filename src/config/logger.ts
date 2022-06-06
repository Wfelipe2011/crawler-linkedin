import winston from 'winston';

const logger = winston.createLogger({
	// format: winston.format.combine(
	// 	winston.format.errors({ stack: true }),
	// 	winston.format.json()
	// ),
	transports: [
		new winston.transports.File({
			level: 'error',
			dirname: 'logs',
			// filename: `error-${new Date().toISOString()}.log`,
			filename: `error.log`,
			maxsize: 5242880, // 5MB
			maxFiles: 5,
			eol: '\n',
			tailable: true,
			zippedArchive: true,
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.errors({ stack: true }),
				winston.format.json()
			),
		}),
	],
});

if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple()
			),
		})
	);
}

export default logger;
