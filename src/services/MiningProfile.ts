/* eslint-disable prettier/prettier */
import logger from '../config/logger';
import { AutoScroll } from '../entities/AutoScroll';
import { SleepTime } from '../entities/SleepTime';
import { LinkedinHtml } from '../helpers/LinkedinHtml';
import { PuppeteerAdapter } from '../infra/PuppeteerAdapter';
import { IPage } from '../interfaces/IPage';
import { SELECTORS } from '../selectors';

interface IProfile {
	avatar: string | null;
	name: string;
	title: string;
	local: string;
	about: string;
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

interface ILanguage {
	language: string;
	level: string;
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
	constructor(private browser: PuppeteerAdapter, private baseUrl:string) {
	
	}

	async execute(): Promise<any> {
		try {
			const profilePromise =  this.getProfileData();
			const experiencePromise =  this.getExperienceData();
			const educationPromise =  this.getEducationData();
			const certificatePromise =  this.getCertificateData();
			const skillsPromise =  this.getSkillsData();
			const languagesPromise =  this.getLanguagesData();
			const [profile, experience, education, certificate, skills, languages] = 
			await Promise.all([profilePromise, experiencePromise, educationPromise, certificatePromise, skillsPromise, languagesPromise]);
			return {
				profile,
				experience,
				education,
				certificate,
				skills,
				languages
			};
		} catch (error) {
			console.log(error);
		}
	}

	private async getProfileData(): Promise<IProfile> {
		try {
			const page = await this.browser.newPage();
			await page.goto(this.baseUrl, {
				waitUntil: 'domcontentloaded',
			});
			await this.executeScroll(page);
			const profile = await page.evaluate((SELECTORS) => {
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
			const sectionAboutHtml = (await page.evaluate(() => {
				const about = document.getElementById('about');
				const sectionAboutId = about?.parentElement?.id as string;
				const sectionAbout = document.getElementById(sectionAboutId);
				return sectionAbout?.innerHTML;
			})) as string;
			const about = LinkedinHtml.sanitize(sectionAboutHtml).replace('…ver mais ', '').replace(' Sobre', '');
			await page.close();
			return {
				...profile,
				about,
			};
		} catch (error) {
			console.log(error);
			return {} as IProfile;
		}
	}

	private async executeScroll(page: IPage): Promise<void> {
		const autoScroll = new AutoScroll(page, 100);
		await SleepTime.execute(1500);
		logger.info('Scrolling page...');
		await autoScroll.execute();
		logger.info('Scrolling done');
	}

	private async getExperienceData(): Promise<IExperience[]> {
		try {
			const page = await this.browser.newPage();
			const urlProfileExperience = this.baseUrl + 'details/experience/';
			await page.goto(urlProfileExperience, {
				waitUntil: 'domcontentloaded',
			});
			
			await this.executeScroll(page);

			const sectionExperienceHtml = (await page.evaluate((DOM_REFERENCE) => {
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

					if(title || description || competence || companyName || companyImageUrl || date || location) {
						experience.push(experienceItem);
					}
				}
				return experience;
			}, SELECTORS.DOM_REFERENCE)) as IExperience[];
			await page.close();
			return sectionExperienceHtml;
		} catch (error) {
			console.log(error);
			return [];
		}
	}

	private async getEducationData(): Promise<IEducation[]> {
		const page = await this.browser.newPage();
		const urlProfileEducation = this.baseUrl + 'details/education/';
		await page.goto(urlProfileEducation, {
			waitUntil: 'domcontentloaded',
		});

		await this.executeScroll(page);

		const sectionEducationHtml = await page.evaluate((DOM_REFERENCE) => {
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

				if(institution || courseName) education.push(educationItem);
				

				
			}
			return education;
		}, SELECTORS.DOM_REFERENCE);

		await page.close();
		return sectionEducationHtml;
	}

	private async getCertificateData(): Promise<ICertificate[]> {
		const page = await this.browser.newPage();
		const urlProfileCertificate = this.baseUrl + 'details/certifications/';
		await page.goto(urlProfileCertificate, {
			waitUntil: 'domcontentloaded',
		});

		await this.executeScroll(page);

		const sectionCertificateHtml = await page.evaluate((DOM_REFERENCE) => {
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
				if(courseName||institution||date||link) certificate.push(certificateItem);
			}
			return certificate;
		}, SELECTORS.DOM_REFERENCE);

		await page.close();
		return sectionCertificateHtml;
	}

	private async getSkillsData(): Promise<string[]> {
		const page = await this.browser.newPage();
		const urlProfileSkills = this.baseUrl + 'details/skills/';
		await page.goto(urlProfileSkills, {
			waitUntil: 'domcontentloaded',
		});

		await this.executeScroll(page);

		const sectionSkillsHtml = await page.evaluate((DOM_REFERENCE) => {
			const ul = document.querySelectorAll('[class="pvs-list "]');
			const haveOtherPositions = ul.length > 1;
			const skillsList = haveOtherPositions ? ul[0].children : ul[0]?.children;
			const skills = [];

			for (const li of skillsList) {
				const id = '#' + li.id;
				const skillNameSelector = id + DOM_REFERENCE.skill.name;
				const skillName = (document.querySelector(skillNameSelector) as HTMLElement)?.innerText;
				if(skillName) skills.push(skillName);
			}
			return skills;
		}, SELECTORS.DOM_REFERENCE);

		await page.close();
		return sectionSkillsHtml;
	}

	private async getLanguagesData(): Promise<ILanguage[]> {
		const page = await this.browser.newPage();
		const urlProfileLanguages = this.baseUrl + 'details/languages/';
		await page.goto(urlProfileLanguages, {
			waitUntil: 'domcontentloaded',
		});

		await this.executeScroll(page);

		const sectionLanguagesHtml = await page.evaluate((DOM_REFERENCE) => {
			const ul = document.querySelectorAll('[class="pvs-list "]');
			const haveOtherPositions = ul.length > 1;
			const languagesList = haveOtherPositions ? ul[0].children : ul[0]?.children;
			const languages = [];

			for (const li of languagesList) {
				const id = '#' + li.id;
				const languageNameSelector = id + DOM_REFERENCE.language.name;
				const name = (document.querySelector(languageNameSelector) as HTMLElement)?.innerText;
				const levelSelector = id + DOM_REFERENCE.language.level;
				const level = (document.querySelector(levelSelector) as HTMLElement)?.innerText;
				const languageItem: ILanguage = {
					language: name,
					level,
				};
				if(name || level) languages.push(languageItem);
			}
			return languages;
		}, SELECTORS.DOM_REFERENCE);

		await page.close();
		return sectionLanguagesHtml;
	}

}
