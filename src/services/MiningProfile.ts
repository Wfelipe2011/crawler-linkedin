/* eslint-disable prettier/prettier */
import logger from '../config/logger';
import { AutoScroll } from '../entities/AutoScroll';
import { SleepTime } from '../entities/SleepTime';
import { LinkedinHtml } from '../helpers/LinkedinHtml';
import { IPage } from '../interfaces/IPage';
import { SELECTORS } from '../selectors';

interface IProfile {
	avatar: string | null;
	name: string;
	title: string;
	local: string;
}

interface IExperience {
	title: string;
	description: string;
	competence: string;
	company: string;
	companyImageUrl: string;
	date: string;
	location: string;
}

interface IEducation {
	institution: string;
	institutionImageUrl?: string;
	courseName: string;
	date: string;
}

interface ICertificate {
	courseName: string;
	institution: string;
	date: string;
	link: string;
}

/**
 * # Pegar dados do perfil do linkedin
 * 		[x] Pegar dados do pessoais
 * 		[x] Pegar dados Sobre
 * 		[x] Pegar dados de experiência
 * 		[x] Pegar dados de educação
 * 		[x] Pegar dados de certificações
 * 		[] Pegar dados de habilidades
 * 		[] Pegar dados de idiomas
 * 		[] Pegar dados de recomendações
 * 		[] Pegar dados de projetos
 * 		[] Pegar dados de publicações
 * 		[] Pegar dados de cursos
 */

export class MiningProfile {
	constructor(private page: IPage, private autoScroll: AutoScroll) {}

	async execute(): Promise<any> {
		try {
			const profile = await this.getProfileData();
			const about = await this.getAboutData();
			const experience = await this.getExperienceData();
			const education = await this.getEducationData();
			const certificate = await this.getCertificateData();
			return {
				profile,
				about,
				experience,
				education,
				certificate,
			};
		} catch (error) {
			console.log(error);
		}
	}

	private async getProfileData(): Promise<IProfile> {
		try {
			await this.executeScroll();
			return await this.page.evaluate((SELECTORS) => {
				const [avatar] = document.getElementsByClassName(
					SELECTORS.CLASS_NAME.avatar
				) as HTMLCollectionOf<HTMLElement>;
				const [name] = document.getElementsByClassName(
					SELECTORS.CLASS_NAME.name
				) as HTMLCollectionOf<HTMLElement>;
				const [title] = document.getElementsByClassName(
					SELECTORS.CLASS_NAME.title
				) as HTMLCollectionOf<HTMLElement>;
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
		} catch (error) {
			console.log(error);
			return {} as IProfile;
		}
	}

	private async getAboutData(): Promise<string> {
		try {
			const sectionAboutHtml = (await this.page.evaluate(() => {
				const about = document.getElementById('about');
				const sectionAboutId = about?.parentElement?.id as string;
				const sectionAbout = document.getElementById(sectionAboutId);
				return sectionAbout?.innerHTML;
			})) as string;

			return LinkedinHtml.sanitize(sectionAboutHtml).replace('…ver mais ', '').replace(' Sobre', '');
		} catch (error) {
			console.log(error);
			return '';
		}
	}

	private async executeScroll(): Promise<void> {
		await SleepTime.execute(3000);
		logger.info('Scrolling page...');
		await this.autoScroll.execute();
		logger.info('Scrolling done');
		await SleepTime.execute(3000);
	}

	private async returnPageProfile(): Promise<void> {
		await this.page.evaluate(() => {
			window.scrollTo({ top: 0, behavior: 'smooth' });
			(document.querySelector('[aria-label="Voltar à página principal do perfil"]') as any).click();
		});
		await SleepTime.execute(3000);
	}

	private async getExperienceData(): Promise<IExperience[]> {
		try {
			const urlProfileExperience = this.page.url() + 'details/experience/';
			await this.page.goto(urlProfileExperience, {
				waitUntil: 'domcontentloaded',
			});

			await this.executeScroll();

			const sectionExperienceHtml = (await this.page.evaluate((DOM_REFERENCE) => {
				const ul = document.querySelectorAll('[class="pvs-list "]');
				const haveOtherPositions = ul.length > 1;
				const experienceList = haveOtherPositions ? ul[1].children : ul[0]?.children;
				const experience = [];
				let mainCompanyName = '';
				let mainCompanyImageUrl = '';
				if (haveOtherPositions) {
					for (const li of ul[0].children) {
						const id = '#' + li.id;
						const companySelector = id + DOM_REFERENCE.experience.subTitle;
						mainCompanyName = (document.querySelector(companySelector) as HTMLElement)?.innerText;
						const companyLinkSelector = id + DOM_REFERENCE.experience.companyImageUrl;
						mainCompanyImageUrl =
							(document.querySelector(companyLinkSelector) as HTMLElement)?.getAttribute('src') || '';
					}
				}

				for (const li of experienceList) {
					const id = '#' + li.id;
					const titleSelector = id + DOM_REFERENCE.experience.title;
					const title = (document.querySelector(titleSelector) as HTMLElement)?.innerText;
					const subTitleSelector = id + DOM_REFERENCE.experience.subTitle;
					const subTitle = (document.querySelector(subTitleSelector) as HTMLElement)?.innerText;
					const descriptionSelector = id + DOM_REFERENCE.experience.description;
					const description = (document.querySelector(descriptionSelector) as HTMLElement)?.innerText;
					const competenceSelector = id + DOM_REFERENCE.experience.competence;
					const competence = (document.querySelector(competenceSelector) as HTMLElement)?.innerText;
					const companyNameSelector = id + DOM_REFERENCE.experience.companyName;
					const companyName = (document.querySelector(companyNameSelector) as HTMLElement)?.innerText;
					const companyImageUrlSelector = id + DOM_REFERENCE.experience.companyImageUrl;
					const companyImageUrl = (
						document.querySelector(companyImageUrlSelector) as HTMLElement
					)?.getAttribute('src');
					const dateSelector = id + DOM_REFERENCE.experience.date;
					const date = (document.querySelector(dateSelector) as HTMLElement)?.innerText;
					const dateSelector2 = id + DOM_REFERENCE.experience.date2;
					const date2 = (document.querySelector(dateSelector2) as HTMLElement)?.innerText;
					const locationSelector = id + DOM_REFERENCE.experience.location;
					const location = (document.querySelector(locationSelector) as HTMLElement)?.innerText;
					const locationSelector2 = id + DOM_REFERENCE.experience.location2;
					const location2 = (document.querySelector(locationSelector2) as HTMLElement)?.innerText;

					const experienceItem = {
						title: title ? title : subTitle,
						description,
						competence,
						company: companyName ? companyName : mainCompanyName,
						companyImageUrl: companyImageUrl ? companyImageUrl : mainCompanyImageUrl,
						date: date ? date : date2,
						location: location ? location : location2,
					};
					experience.push(experienceItem);
				}
				return experience;
			}, SELECTORS.DOM_REFERENCE)) as IExperience[];
			await this.returnPageProfile();
			return sectionExperienceHtml;
		} catch (error) {
			console.log(error);
			return [];
		}
	}

	private async getEducationData(): Promise<IEducation[]> {
		const urlProfileEducation = this.page.url() + 'details/education/';
		await this.page.goto(urlProfileEducation, {
			waitUntil: 'domcontentloaded',
		});

		await this.executeScroll();

		const sectionEducationHtml = await this.page.evaluate((DOM_REFERENCE) => {
			const ul = document.querySelectorAll('[class="pvs-list "]');
			const haveOtherPositions = ul.length > 1;
			const educationList = haveOtherPositions ? ul[0].children : ul[0]?.children;
			const education = [];

			for (const li of educationList) {
				const id = '#' + li.id;
				const institutionSelector = id + DOM_REFERENCE.education.institution;
				const institution = (document.querySelector(institutionSelector) as HTMLElement)?.innerText;
				const courseNameSelector = id + DOM_REFERENCE.education.courseName;
				const courseName = (document.querySelector(courseNameSelector) as HTMLElement)?.innerText;
				const institutionImageUrlSelector = id + DOM_REFERENCE.education.institutionImageUrl;
				const institutionImageUrl =
					(document.querySelector(institutionImageUrlSelector) as HTMLElement)?.getAttribute('src') || '';
				const dateSelector = id + DOM_REFERENCE.education.date;
				const date = (document.querySelector(dateSelector) as HTMLElement)?.innerText;

				const educationItem: IEducation = {
					institution,
					institutionImageUrl,
					courseName,
					date,
				};
				education.push(educationItem);
			}
			return education;
		}, SELECTORS.DOM_REFERENCE);

		await this.returnPageProfile();
		return sectionEducationHtml;
	}

	private async getCertificateData(): Promise<ICertificate[]> {
		const urlProfileCertificate = this.page.url() + 'details/certifications/';
		await this.page.goto(urlProfileCertificate, {
			waitUntil: 'domcontentloaded',
		});

		await this.executeScroll();

		const sectionCertificateHtml = await this.page.evaluate((DOM_REFERENCE) => {
			const ul = document.querySelectorAll('[class="pvs-list "]');
			const haveOtherPositions = ul.length > 1;
			const certificateList = haveOtherPositions ? ul[0].children : ul[0]?.children;
			const certificate = [];

			for (const li of certificateList) {
				const id = '#' + li.id;
				const courseNameSelector = id + DOM_REFERENCE.certificate.courseName;
				const courseName = (document.querySelector(courseNameSelector) as HTMLElement)?.innerText;
				const institutionSelector = id + DOM_REFERENCE.certificate.institution;
				const institution = (document.querySelector(institutionSelector) as HTMLElement)?.innerText;
				const dateSelector = id + DOM_REFERENCE.certificate.date;
				const date = (document.querySelector(dateSelector) as HTMLElement)?.innerText;
				const linkSelector = id + DOM_REFERENCE.certificate.link;
				const link = (document.querySelector(linkSelector) as HTMLElement)?.getAttribute('href') || '';
				const certificateItem: ICertificate = {
					institution,
					courseName,
					date,
					link,
				};
				certificate.push(certificateItem);
			}
			return certificate;
		}, SELECTORS.DOM_REFERENCE);

		await this.returnPageProfile();
		return sectionCertificateHtml;
	}
}
