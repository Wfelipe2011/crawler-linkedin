import { Router } from 'express';

import { PuppeteerAdapter } from '../infra/PuppeteerAdapter';
import { LoginLinkedin } from '../services/LoginLinkedin';
import { MiningProfile } from '../services/MiningProfile';

const crawlerRoutes = Router();
const puppeteerAdapter = new PuppeteerAdapter({
	headless: true,
	slowMo: 80,
});

crawlerRoutes.post('/', async (req, res) => {
	try {
		const { url, login, password } = req.body;

		const data = await getMiningProfileData(url, { login, password });
		res.send({ data });
	} catch (error) {
		console.error(error);
		res.send({ data: error });
	}
});

async function getMiningProfileData(url: string, user: { login: string; password: string }): Promise<void> {
	const page = await puppeteerAdapter.newPage();
	const loginLinkedin = new LoginLinkedin(page);
	await loginLinkedin.execute(user);
	const baseUrl = `https://www.linkedin.com/in/${url}/`;
	const mining = new MiningProfile(puppeteerAdapter, baseUrl);
	const data = await mining.execute();
	await page.close();
	return data;
}

export { crawlerRoutes };

