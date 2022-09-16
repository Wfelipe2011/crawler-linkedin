/* eslint-disable prettier/prettier */
import logger from '../config/logger';
import { AutoScroll } from '../entities/AutoScroll';
import { IPage } from '../interfaces/IPage';
import { SELECTORS } from '../selectors';

interface Profile {
	avatar: string | null;
	name: string;
	title: string;
	local: string;
}

/**
 * # Pegar dados do perfil do linkedin
 * 		[x] Pegar dados do pessoais
 * 		[] Pegar dados de experiência
 * 		[] Pegar dados de educação
 * 		[] Pegar dados de habilidades
 * 		[] Pegar dados de idiomas
 * 		[] Pegar dados de recomendações
 * 		[] Pegar dados de projetos
 * 		[] Pegar dados de publicações
 * 		[] Pegar dados de cursos
 * 		[] Pegar dados de certificações
 */

export class MiningProfile {
	constructor(
		private page: IPage,
		private autoScroll: AutoScroll
	) {}

	async execute(): Promise<any> {
		try {
			logger.info('Scrolling page...');
			await this.autoScroll.execute();
			logger.info('Scrolling done');
			const profile = await this.getProfileData();
			return {
				profile,
			};
		} catch (error) {
			console.log(error);
		}
	}

	private async getProfileData(): Promise<Profile>{
		return await this.page.evaluate((SELECTORS) => {
			const [avatar] = document.getElementsByClassName(
				SELECTORS.CLASS_NAME.avatar
			)as HTMLCollectionOf<HTMLElement>;
			const [name] = document.getElementsByClassName(
				SELECTORS.CLASS_NAME.name
			)as HTMLCollectionOf<HTMLElement>;
			const [title] = document.getElementsByClassName(
				SELECTORS.CLASS_NAME.title
			)as HTMLCollectionOf<HTMLElement>;
			const [local] = document.getElementsByClassName(
				SELECTORS.CLASS_NAME.local
			) as HTMLCollectionOf<HTMLElement>;
			
			return {
					name: name?.innerText,
					avatar: avatar?.getAttribute('src'),
					title: title?.innerText,
					local: local?.innerText,
			};
		}, SELECTORS);
	}
}
