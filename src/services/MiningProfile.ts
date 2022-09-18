/* eslint-disable prettier/prettier */
import logger from '../config/logger';
import { AutoScroll } from '../entities/AutoScroll';
import { SleepTime } from '../entities/SleepTime';
import { LinkedinHtml } from '../helpers/LinkedinHtml';
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
 * 		[x] Pegar dados Sobre
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
			await this.executeScroll();
			const profile = await this.getProfileData();
			const about = await this.getAboutData();
			const experience = await this.getExperienceData();
			return {
				profile,
				about,
				experience
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

	private async getAboutData(): Promise<any> {
		const sectionAboutHtml = await this.page.evaluate(() => {
			const about = document.getElementById('about');
			const sectionAboutId = about?.parentElement?.id as string;
			const sectionAbout = document.getElementById(sectionAboutId);
			return sectionAbout?.innerHTML;
		}) as string;

		return LinkedinHtml.sanitize(sectionAboutHtml).replace('…ver mais ', '').replace(' Sobre', '');
	}

	private async executeScroll(): Promise<void> {
		await SleepTime.execute(3000);
		logger.info('Scrolling page...');
		await this.autoScroll.execute();
		logger.info('Scrolling done');
		await SleepTime.execute(3000);
	}

	private async getExperienceData(): Promise<any> {
		const urlProfileExperience =  this.page.url() + 'details/experience/';
		await this.page.goto(urlProfileExperience, {
			waitUntil: 'domcontentloaded',
		});
		
		await this.executeScroll();

		const sectionExperienceHtml = await this.page.evaluate((DOM_REFERENCE) => {
			const ul = document.querySelectorAll('[class="pvs-list "]');
			const teveOutrosCargos = ul.length > 1;
			const lis = teveOutrosCargos ? ul[1].children : ul[0]?.children;
			const experience = [];
			let companyPrincipal = '';
			let companyLinkPrincipal = '';
			if(teveOutrosCargos){
				for(const li of ul[0].children){
					const id = '#' + li.id;	
					const companySelector = id + DOM_REFERENCE.experience.subTitle;
					companyPrincipal = (document.querySelector(companySelector)as HTMLElement)?.innerText;
					const companyLinkSelector = id + DOM_REFERENCE.experience.companyLink;
					companyLinkPrincipal = (document.querySelector(companyLinkSelector)as HTMLElement)?.getAttribute('src') || '';
					}
			}
				
			for (const li of lis) {
				const id = '#' + li.id;
				const titleSelector = id + DOM_REFERENCE.experience.title;
				const title = (document.querySelector(titleSelector)as HTMLElement)?.innerText;
				const subTitleSelector = id + DOM_REFERENCE.experience.subTitle;
				const subTitle = (document.querySelector(subTitleSelector)as HTMLElement)?.innerText ;
				const descriptionSelector = id + DOM_REFERENCE.experience.description;
				const description = (document.querySelector(descriptionSelector)as HTMLElement)?.innerText; 
				const competenceSelector = id + DOM_REFERENCE.experience.competence;
				const competence = (document.querySelector(competenceSelector)as HTMLElement)?.innerText;
				const companySelector = id + DOM_REFERENCE.experience.company;
				const company = (document.querySelector(companySelector)as HTMLElement)?.innerText;
				const companyLinkSelector = id + DOM_REFERENCE.experience.companyLink;
				const companyLink = (document.querySelector(companyLinkSelector)as HTMLElement)?.getAttribute('src');
				const dateSelector = id + DOM_REFERENCE.experience.date;
				const date = (document.querySelector(dateSelector)as HTMLElement)?.innerText;
				const dateSelector2 = id + DOM_REFERENCE.experience.date2;
				const date2 = (document.querySelector(dateSelector2)as HTMLElement)?.innerText;
				const locationSelector = id + DOM_REFERENCE.experience.location;
				const location = (document.querySelector(locationSelector)as HTMLElement)?.innerText;
				const locationSelector2 = id + DOM_REFERENCE.experience.location2;
				const location2 = (document.querySelector(locationSelector2)as HTMLElement)?.innerText;	

				const experienceItem = {
					title: title ? title : subTitle,
					description,
					competence,
					company: company ? company : companyPrincipal,
					companyLink: companyLink ? companyLink : companyLinkPrincipal,
					date: date ? date : date2,
					location: location ? location : location2
				};
				experience.push(experienceItem);
			}
			return experience;
		}, SELECTORS.DOM_REFERENCE) as unknown as string;

		return sectionExperienceHtml;
	}
}
