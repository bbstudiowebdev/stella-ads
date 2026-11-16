import type { APIRoute } from 'astro';
import { site } from '../data/site';

// Generated from site.ts — never edit by hand.
export const GET: APIRoute = () => {
  const c = site.contact;
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.meta.description}`,
    '',
    `${site.name} rents billboard advertising space in ${site.hero.cities.map((x) => x.name).join(' and ')}, Gauteng, South Africa. ${site.why.body}`,
    '',
    '## Billboard sites',
    ...site.boards.map((b) =>
      `- ${b.name} (${b.city}): ${b.price ? b.price + ' excl. VAT' : site.billboards.priceFallback}; traffic data ${b.traffic || 'on request'}; ${b.availability}.`),
    '',
    '## How booking works',
    ...site.how.steps.map((s) => `${Number(s.n)}. ${s.title}: ${s.body}`),
    '',
    '## Why advertisers choose us',
    ...site.why.reasons.map((r) => `- ${r.title}: ${r.body}`),
    '',
    '## Contact',
    `- Phone / WhatsApp: ${c.phoneDisplay}`,
    `- Email: ${c.email}`,
    `- Area: ${c.area}`,
    `- Quote form: ${site.url}/#quote`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
