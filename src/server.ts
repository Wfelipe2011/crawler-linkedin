import app, { PORT } from './app';
import logger from './config/logger';
import job from './jobs/cronJob';

/**
 * How to use logger
 *
 * logger.info('info message');
 * logger.error('error message');
 * logger.debug('debug message');
 * logger.warn('warn message');
 */

app.listen(PORT, () => {
	job.start();
	logger.info(`Server is running on port ${PORT}`);
});
