import { Router } from 'express';

import { AutoScroll } from '../entities/AutoScroll';
import { SleepTime } from '../entities/SleepTime';
import { PuppeteerAdapter } from '../infra/PuppeteerAdapter';
import { LoginLinkedin } from '../services/LoginLinkedin';
import { MiningProfile } from '../services/MiningProfile';

const crawlerRoutes = Router();
const puppeteerAdapter = new PuppeteerAdapter({
	headless: true,
	slowMo: 50,
});
async function testCrawler(url: string): Promise<void> {
	const page = await puppeteerAdapter.newPage();
	const loginLinkedin = new LoginLinkedin(page);
	await loginLinkedin.execute({
		login: 'ws2838841@gmail.com',
		password: 'Mudar123456',
	});
	await SleepTime.execute(3000);
	await page.goto(`https://www.linkedin.com/in/${url}`, {
		waitUntil: 'domcontentloaded',
	});
	await SleepTime.execute(3000);
	const autoScroll = new AutoScroll(page, 50);
	const mining = new MiningProfile(page, autoScroll);
	const data = await mining.execute();
	page.close();
	return data;
}

crawlerRoutes.get('/:url', async (req, res) => {
	try {
		const { url } = req.params;
		const data = await testCrawler(url);
		res.send({ data });
	} catch (error) {
		console.error(error);
		res.send({ data: error });
	}
});

export { crawlerRoutes };
