import app, { PORT } from './app';
import logger from './config/logger';


/**
 * How to use logger
 *
 * logger.info('info message');
 * logger.error('error message');
 * logger.debug('debug message');
 * logger.warn('warn message');
 */

app.listen(PORT, () => {
	logger.info(`Server is running on port ${PORT}`);
});
