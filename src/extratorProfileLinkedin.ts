const profileRegex = {
  competences: /Competências:(?<competences>.*?)Recomendações/gs,
  formation: /Formação acadêmica(?<formation>.*?)Competências/gs,
  formationTwo: /(?<formation>.*?)Licenças e certificados/gs,
  recommendation: /Recomendações(?<recommendation>.*?)Interesses/gs,
  experience: /Experiência(?<experience>.*?)Formação acadêmica/gs,
  info: /Sobre(?<info>.*?)(Em destaque|...ver mais)/gs,
  connection: /Informações de contato.*?:(?<connection>.*?)e mais/gs,
  name: /Experimente o Premium grátis  .+?\b(?<name>.*?)   \b(?<title>.*?)Compartilhar/gs,
  title: /Experimente o Premium grátis  .+?\b(?<name>.*?)   \b(?<title>.*?)Compartilhar/gs,
};

export function extractorProfileLinkedIn(htmlClean: string): {
  name: string;
  title: string;
  info: string;
  experienceDetails: string;
  formation: string;
  recommendation: string;
} {
  const profile = {
    name: profileRegex.name?.exec(htmlClean)?.groups.name,
    title: profileRegex.title?.exec(htmlClean)?.groups.title,
    info: profileRegex.info?.exec(htmlClean)?.groups.info,
    experienceDetails: profileRegex.experience?.exec(htmlClean)?.groups.experience,
    formation: profileRegex.formation?.exec(htmlClean)?.groups.formation,
    recommendation: profileRegex.recommendation?.exec(htmlClean)?.groups.recommendation,
  };
  for (let p in profile) {
    if (!profile[p]) continue;
    profile[p] = regexSpace(profile[p]);
  }
  const formation = profileRegex.formationTwo.exec(profile.formation);
  profile.formation = formation ? formation[1] : profile.formation;
  return profile;
}

function regexSpace(text: string) {
  if (!text) return null;
  const regexSpace = /\s{2,}/gs;
  return text.replace(regexSpace, ' ') || null;
}

export function sanitizeHtml(html: string) {
  const regexSpecifTags =
    /<script.*?>.*?<\/script>|<span class="visually-hidden">.*?<\/span>|<iframe.*?>.*?<\/iframe>|{.*?<|<symbol.*>.*?<\/symbol>|<code.*?>.*?<\/code>/gs;
  const regexTag = /<[^>]*>/gs;
  const regexLineBreak = /\n/gs;
  return html.toString().replace(regexSpecifTags, ' ').replace(regexTag, ' ').replace(regexLineBreak, ' ');
}
