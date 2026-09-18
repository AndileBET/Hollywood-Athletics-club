import axios from 'axios';

const EVENTS_URL = 'https://www.hollywoodathleticsclub.co.za/events/';
const EVENTS_API_URLS = [
  'https://www.hollywoodathleticsclub.co.za/wp-json/wp/v2/event',
  'https://www.hollywoodathleticsclub.co.za/wp-json/wp/v2/events',
];
const USER_AGENT = 'STRIDES-Club-Bookings/1.0';

export async function getLiveEvents() {
  let events = await getFromWordPressApi();

  if (events.length < 3) {
    const response = await axios.get(EVENTS_URL, {
      timeout: 20000,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml',
      },
    });

    const html = String(response.data || '');
    const jsonLdEvents = extractJsonLdEvents(html);
    events = jsonLdEvents.length >= 3
      ? jsonLdEvents
      : parseEventCards(html);
  }

  const deduped = dedupeEvents(events)
    .filter((event) => event.name && event.url)
    .map(normaliseEvent)
    .sort(compareEvents);

  if (!deduped.length) {
    const error = new Error('The official club events could not be loaded.');
    error.statusCode = 502;
    throw error;
  }

  return {
    fetchedAt: new Date().toISOString(),
    source: EVENTS_URL,
    events: deduped,
  };
}


async function getFromWordPressApi() {
  for (const apiUrl of EVENTS_API_URLS) {
    try {
      const response = await axios.get(apiUrl, {
        params: { per_page: 100, _embed: true },
        timeout: 15000,
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/json',
        },
      });

      if (!Array.isArray(response.data)) continue;

      const events = response.data.map((item) => {
        const title = stripHtml(item?.title?.rendered || item?.title || '');
        const link = item?.link || '';
        const embeddedImage = item?._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
        return {
          name: title,
          url: resolveUrl(link),
          image: resolveImage(embeddedImage),
          date: item?.event_date || item?.start_date || item?.acf?.event_date || item?.meta?.event_date || '',
          location: item?.location || item?.event_location || item?.acf?.location || item?.acf?.event_location || '',
          description: stripHtml(item?.excerpt?.rendered || item?.content?.rendered || ''),
          offers: item?.price || item?.acf?.price || '',
        };
      }).filter((event) => event.name && event.url && /\/event\//i.test(event.url));

      if (events.length) return events;
    } catch (_) {
      // Try the next endpoint, then fall back to scraping the public events page.
    }
  }
  return [];
}

function extractJsonLdEvents(html) {
  const events = [];
  const scripts = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) || [];
  for (const script of scripts) {
    const raw = script.replace(/^<script[^>]*>/i, '').replace(/<\/script>$/i, '').trim();
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      continue;
    }
    walkJsonLd(parsed, events);
  }
  return events;
}

function walkJsonLd(value, events) {
  if (!value) return;
  if (Array.isArray(value)) {
    value.forEach((item) => walkJsonLd(item, events));
    return;
  }
  if (typeof value !== 'object') return;

  const types = Array.isArray(value['@type']) ? value['@type'] : [value['@type']];
  if (types.includes('Event') && value.name && value.url) {
    events.push({
      name: stripHtml(value.name),
      url: resolveUrl(value.url),
      image: resolveImage(value.image),
      date: value.startDate || '',
      location: formatLocation(value.location),
      description: stripHtml(value.description || ''),
      offers: formatOffers(value.offers),
    });
  }

  Object.values(value).forEach((child) => walkJsonLd(child, events));
}

function parseEventCards(html) {
  const events = [];
  const eventUrlPattern = /https?:\/\/[^"'<>\s]+\/event\/[^"'<>\s]+\/?|\/event\/[^"'<>\s]+\/?/gi;
  const matches = [...html.matchAll(eventUrlPattern)];

  for (const match of matches) {
    const url = resolveUrl(match[0]);
    const position = match.index || 0;
    const windowStart = Math.max(0, position - 2200);
    const windowEnd = Math.min(html.length, position + 1600);
    const block = html.slice(windowStart, windowEnd);
    const plain = stripHtml(block);

    const title = firstMatch(plain, /(?:^|\n)\s*([A-Z][^\n]{6,120}?\s(?:2025|2026|2027)|[A-Z][^\n]{8,100}(?:HUB|Marathon|Time Trial|Run Series|Runs))\s*(?:\n|$)/i);
    const date = firstMatch(plain, /((?:Every\s+)?(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)(?:s)?|\b\d{1,2}\s+[A-Za-z]+\s+202\d\b|\b[A-Z][a-z]+\s*-\s*[A-Z][a-z]+\b)/i);
    const location = firstMatch(plain, /([A-Z][^\n]{4,100}(?:Park|Ground|Johannesburg|Durban|Soweto|Ekurhuleni|Thohoyandou|Shelly Beach|Melrose)[^\n]*)/i);

    if (url && title) {
      events.push({
        name: title,
        url,
        image: '',
        date,
        location,
        description: '',
        offers: '',
      });
    }
  }

  return events;
}

function normaliseEvent(event) {
  return {
    id: event.url,
    title: cleanEventText(event.name),
    date: cleanEventText(event.date) || 'See event details',
    location: cleanEventText(event.location) || 'See event details',
    url: event.url,
    image: event.image || '',
    description: cleanEventText(event.description),
    price: cleanEventText(event.offers),
    action: 'View event',
  };
}

function dedupeEvents(events) {
  const map = new Map();
  for (const event of events) {
    const key = normaliseUrl(event.url);
    if (!map.has(key)) map.set(key, event);
  }
  return [...map.values()];
}

function compareEvents(a, b) {
  const aTime = parseDateValue(a.date);
  const bTime = parseDateValue(b.date);
  if (aTime !== bTime) return aTime - bTime;
  return a.name.localeCompare(b.name);
}

function parseDateValue(value) {
  if (!value) return Number.MAX_SAFE_INTEGER;
  const recurring = String(value).match(/every\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i);
  if (recurring) return 900000000 + ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'].indexOf(recurring[1].toLowerCase());
  const timestamp = Date.parse(String(value));
  return Number.isNaN(timestamp) ? Number.MAX_SAFE_INTEGER - 1 : timestamp;
}

function formatLocation(location) {
  if (!location) return '';
  if (typeof location === 'string') return stripHtml(location);
  if (Array.isArray(location)) return location.map(formatLocation).filter(Boolean).join(', ');
  const address = location.address;
  if (typeof address === 'string') return address;
  if (address && typeof address === 'object') {
    return [address.streetAddress, address.addressLocality, address.addressRegion, address.addressCountry].filter(Boolean).join(', ');
  }
  return [location.name].filter(Boolean).join(', ');
}

function formatOffers(offers) {
  if (!offers) return '';
  if (Array.isArray(offers)) return offers.map(formatOffers).filter(Boolean).join(' | ');
  if (typeof offers === 'string') return stripHtml(offers);
  const price = offers.price ?? offers.lowPrice ?? '';
  const currency = offers.priceCurrency || 'R';
  const availability = offers.availability === 'https://schema.org/SoldOut' ? 'Sold Out' : '';
  if (price === '' && !availability) return '';
  if (availability) return price === '' ? availability : `${currency}${price} - ${availability}`;
  return `${currency}${price}`;
}

function resolveImage(value) {
  if (!value) return '';
  if (Array.isArray(value)) return resolveImage(value[0]);
  if (typeof value === 'object') return resolveImage(value.url || value.contentUrl || '');
  return resolveUrl(value);
}

function resolveUrl(value) {
  try {
    return new URL(value, EVENTS_URL).toString();
  } catch {
    return String(value || '').trim();
  }
}

function normaliseUrl(value) {
  try {
    const url = new URL(value || EVENTS_URL);
    url.hash = '';
    url.search = '';
    url.pathname = url.pathname.replace(/\/+$/, '/') || '/';
    return url.toString().toLowerCase();
  } catch {
    return String(value || '').trim().replace(/\/+$/, '/').toLowerCase();
  }
}

function firstMatch(value, regex) {
  const match = String(value || '').match(regex);
  return match?.[1]?.trim() || '';
}

function cleanEventText(value) {
  return stripHtml(value || '').replace(/\s+/g, ' ').trim();
}

function stripHtml(value) {
  return String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&rsquo;|&lsquo;/gi, "'")
    .replace(/&ndash;/gi, '-')
    .replace(/&mdash;/gi, '-')
    .replace(/\s+/g, ' ')
    .trim();
}
