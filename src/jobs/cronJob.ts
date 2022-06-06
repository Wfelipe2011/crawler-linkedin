import { CronJob } from 'cron';

const job = new CronJob(
	'0 */1 * * * *',
	() => {
		console.log(`running a task every minute: ${new Date()}`);
	},
	null,
	true,
	'Brazil/East'
);

export default job;
