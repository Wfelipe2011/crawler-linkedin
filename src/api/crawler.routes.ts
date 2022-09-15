import { Router } from 'express';

import { AutoScroll } from '../entities/AutoScroll';
import { SleepTime } from '../entities/SleepTime';
import { PuppeteerAdapter } from '../infra/PuppeteerAdapter';
import { LoginLinkedin } from '../services/LoginLinkedin';
import { MiningProfile } from '../services/MiningProfile';

const crawlerRoutes = Router();
const puppeteerAdapter = new PuppeteerAdapter();
async function testCrawler(url: string): Promise<void> {
	const page = await puppeteerAdapter.newPage();
	const loginLinkedin = new LoginLinkedin(page);
	await loginLinkedin.execute({
		login: 'ws2838841@gmail.com',
		password: 'Mudar123456',
	});
	// esperar até que a página carregue
	await SleepTime.execute(5000);
	// ir até perfil
	await page.goto(`https://www.linkedin.com/in/${url}`, {
		waitUntil: 'domcontentloaded',
	});
	// minerar dados
	const autoScroll = new AutoScroll(page, 100);
	const mining = new MiningProfile(page, autoScroll);
	return await mining.execute();
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
