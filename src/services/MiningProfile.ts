/* eslint-disable prettier/prettier */
import logger from '../config/logger';
import { AutoScroll } from '../entities/AutoScroll';
import { extractorProfileLinkedIn, sanitizeHtml } from '../extratorProfileLinkedin';
import { IPage } from '../interfaces/IPage';

/**
 * # Pegar dados do perfil do linkedin
 * 		[] Pegar dados do pessoais
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
			const html = await this.page.evaluate(
				() => document.body.innerHTML
			);
			const htmlClean = sanitizeHtml(html);
			const profile = extractorProfileLinkedIn(htmlClean);
			return profile;
		} catch (error) {
			console.log(error);
		}
	}
}
