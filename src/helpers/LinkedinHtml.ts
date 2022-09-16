export class LinkedinHtml {
	static sanitize(html: string): string {
		if (!html) return '';
		const regexSpecifTags =
			/<script.*?>.*?<\/script>|<span class="visually-hidden">.*?<\/span>|<iframe.*?>.*?<\/iframe>|{.*?<|<symbol.*>.*?<\/symbol>|<code.*?>.*?<\/code>/gs;
		const regexTag = /<[^>]*>/gs;
		const regexLineBreak = /\n/gs;
		return html
			.toString()
			.replace(regexSpecifTags, ' ')
			.replace(regexTag, ' ')
			.replace(regexLineBreak, ' ')
			.replace(/[\s]+/g, ' ');
	}
}
