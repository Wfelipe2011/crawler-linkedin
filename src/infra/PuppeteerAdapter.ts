import {
	Browser,
	Page,
	PuppeteerLaunchOptions,
	launch,
} from 'puppeteer';

export class PuppeteerAdapter {
	private browser!: Browser;
	// eslint-disable-next-line prettier/prettier
	constructor(readonly options?: PuppeteerLaunchOptions) {
		this.execute();
	}

	private async execute(): Promise<void> {
		if (this.browser) return;
		this.browser = await launch({
			headless: false,
			ignoreHTTPSErrors: true,
			defaultViewport: null,
			slowMo: 250,
			args: [
				'--no-sandbox',
				'--start-maximized',
				'--disable-setuid-sandbox',
				'--enable-features=NetworkService',
			],
			...this.options,
		});
	}

	async closeBrowser(): Promise<void> {
		await this.execute();
		await this.browser.close();
	}

	async newPage(): Promise<Page> {
		await this.execute();
		return this.browser.newPage();
	}
}
