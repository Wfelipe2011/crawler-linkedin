import logger from '../config/logger';
import { IPage } from '../interfaces/IPage';

const SELECTORS = {
	url: 'https://www.linkedin.com/login/pt?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin',
	login: '[id="username"]',
	password: '[id="password"]',
	enter: '[aria-label="Entrar"]',
};
interface ILoginParams {
	login: string;
	password: string;
}

export class LoginLinkedin {
	// eslint-disable-next-line prettier/prettier
	constructor(readonly page: IPage) { }

	async execute(params: ILoginParams): Promise<void> {
		try {
			const { login, password } = params;
			await this.page.goto(SELECTORS.url, {
				waitUntil: 'domcontentloaded',
			});
			await this.page.type(SELECTORS.login, login, {
				delay: 50,
			});
			await this.page.type(SELECTORS.password, password, {
				delay: 50,
			});
			await this.page.click(SELECTORS.enter);
			logger.info(`Passou do login o job: ${login}`);
		} catch (error) {
			logger.error(`Erro no login do job: ${error}`);
		}
	}
}
