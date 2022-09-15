import { IPage } from '../interfaces/IPage';

export class AutoScroll {
	// eslint-disable-next-line prettier/prettier
	constructor(readonly page: IPage) { }

	async execute(speedTimeScroll = 500): Promise<void> {
		await this.page.evaluate(async () => {
			await new Promise<void>((resolve) => {
				let totalHeight = 0;
				const distance = 100;

				const timer = setInterval(() => {
					const scrollHeight = document.body.scrollHeight;
					window.scrollBy(0, distance);
					totalHeight += distance;

					if (totalHeight >= scrollHeight) {
						clearInterval(timer);
						resolve();
					}
				}, speedTimeScroll);

				setTimeout(() => {
					clearInterval(timer);
					window.scrollTo({ top: 0, behavior: 'smooth' });
					setTimeout(() => resolve(), 3000);
				}, 1000 * 30);
			});
		});
	}
}
