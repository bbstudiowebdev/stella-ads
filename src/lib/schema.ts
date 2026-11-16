import { site } from '../data/site';

/** JSON-LD built from site.ts. Only marks up what is visible on the page. */
export function buildSchema() {
  const url = site.url;
  const c = site.contact;
  const id = `${url}/#business`;

  const address: Record<string, string> = {
    '@type': 'PostalAddress',
    addressRegion: c.region,
    addressCountry: c.country,
  };
  if (c.locality) address.addressLocality = c.locality;
  if (c.streetAddress) address.streetAddress = c.streetAddress;
  if (c.postalCode) address.postalCode = c.postalCode;

  const business: Record<string, unknown> = {
    '@type': 'ProfessionalService',
    '@id': id,
    additionalType: 'https://en.wikipedia.org/wiki/Billboard',
    name: site.name,
    legalName: site.legalName,
    url,
    logo: `${url}/apple-touch-icon.png`,
    image: `${url}/og.jpg`,
    description: site.meta.description,
    telephone: c.phoneDisplay.replace(/\s/g, ''),
    email: c.email,
    address,
    areaServed: site.hero.cities.map((city) => ({ '@type': 'City', name: city.name })),
    priceRange: 'R7000–R9000 per month excl. VAT',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Billboard sites',
      itemListElement: site.boards.map((b) => ({
        '@type': 'Offer',
        name: `${b.name} billboard, ${b.city}`,
        priceCurrency: 'ZAR',
        ...(b.price ? { priceSpecification: { '@type': 'UnitPriceSpecification', price: b.price.replace(/[^\d]/g, ''), priceCurrency: 'ZAR', unitText: 'month', valueAddedTaxIncluded: false } } : {}),
        availability: b.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        itemOffered: {
          '@type': 'Service',
          name: `Billboard advertising — ${b.name}`,
          areaServed: { '@type': 'City', name: b.city },
        },
      })),
    },
  };
  if (c.hours) business.openingHours = c.hours;
  if (site.sameAs.length) business.sameAs = site.sameAs;

  const graph: unknown[] = [
    { '@type': 'WebSite', '@id': `${url}/#website`, url, name: site.name, inLanguage: site.locale, publisher: { '@id': id } },
    business,
  ];

  if (site.faq.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: site.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
