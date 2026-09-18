import axios from 'axios';

const EVENTS_URL = 'https://www.hollywoodathleticsclub.co.za/events/';
const WP_BASE_URL = 'https://www.hollywoodathleticsclub.co.za/wp-json/wp/v2';
const USER_AGENT = 'STRIDES-Club-Bookings/1.0';
const REQUEST_OPTIONS = {
  timeout: 20000,
  headers: {
    'User-Agent': USER_AGENT,
    Accept: 'text/html,application/xhtml+xml,application/json',
  },
};

export async function getLiveBookings() {
  const fetchedAt = new Date().toISOString();
  let events = [];
  let source = EVENTS_URL;

  try {
    events = await getEventsFromWordPress();
    if (events.length) source = `${WP_BASE_URL}/types/*`;
  } catch (_) {
    // Fall through to the live events page parser.
  }

  if (!events.length) {
    const response = await axios.get(EVENTS_URL, REQUEST_OPTIONS);
    events = parseEventsPage(response.data);
  }

  if (!events.length) {
    const error = new Error('The official club events could not be loaded.');
    error.statusCode = 502;
    throw error;
  }

  return { fetchedAt, source, events };
}

async function getEventsFromWordPress() {
  const typesResponse = await axios.get(`${WP_BASE_URL}/types`, {
    timeout: 12000,
    headers: REQUEST_OPTIONS.headers,
  });

  const types = typesResponse.data && typeof typesResponse.data === 'object'
    ? Object.entries(typesResponse.data)
    : [];

  const eventTypes = types
    .filter(([key, value]) => {
      const haystack = `${key} ${value?.name || ''} ${value?.rest_base || ''}`.toLowerCase();
      return haystack.includes('event');
    })
    .map(([key, value]) => value?.rest_base || key)
    .filter(Boolean);

  for (const type of [...new Set(eventTypes)]) {
    try {
      const response = await axios.get(`${WP_BASE_URL}/${type}`, {
        params: { per_page: 100, order: 'asc', orderby: 'date' },
        timeout: 15000,
        headers: { ...REQUEST_OPTIONS.headers, Accept: 'application/json' },
      });
      if (!Array.isArray(response.data)) continue;

      const parsed = response.data
        .map((item) => fromWordPressItem(item))
        .filter(Boolean);

      if (parsed.length) return dedupeAndSort(parsed);
    } catch (_) {
      // Continue to the next discovered event type.
    }
  }

  return [];
}

function fromWordPressItem(item) {
  const title = stripHtml(item?.title?.rendered || item?.title || '');
  const html = item?.content?.rendered || item?.excerpt?.rendered || '';
  const text = stripHtml(html);
  const date = extractDate(text);
  const location = extractLocation(text);
  const url = item?.link || EVENTS_URL;

  if (!title || !url || !date || !location) return null;
  return { id: String(item.id), title, date, location, action: 'View event', url };
}

function parseEventsPage(html) {
  const events = [];

  // The club site exposes each event as a heading followed by its details and a
  // "more info" link. We keep the parser deliberately tolerant because the
  // site's presentation markup can change independently of STRIDES.
  const headingRegex = /<(h2|h3|h4)[^>]*>([\s\S]*?)<\/\1>/gi;
  const headings = [];
  let headingMatch;

  while ((headingMatch = headingRegex.exec(html))) {
    headings.push({
      start: headingMatch.index,
      end: headingRegex.lastIndex,
      title: stripHtml(headingMatch[2]),
    });
  }

  for (let index = 0; index < headings.length; index += 1) {
    const heading = headings[index];
    if (!heading.title) continue;

    const nextHeadingStart = headings[index + 1]?.start ?? Math.min(html.length, heading.end + 8000);
    const block = html.slice(heading.end, nextHeadingStart);
    const linkMatches = [...block.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
    const eventLink = linkMatches.find((match) => /\/event[s]?\//i.test(match[1]));
    if (!eventLink) continue;

    const text = stripHtml(block);
    const date = extractDate(text);
    const location = extractLocation(text);
    if (!date || !location) continue;

    events.push({
      id: eventLink[1],
      title: heading.title,
      date,
      location,
      action: 'View event',
      url: resolveUrl(eventLink[1]),
    });
  }

  return dedupeAndSort(events);
}

function extractDate(text) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  const patterns = [
    /\b(?:Every\s+)?(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b[^|•;]*/i,
    /\b\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/i,
    /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s*-\s*(?:January|February|March|April|May|June|July|August|September|October|November|December)\b/i,
    /\b\d{1,2}\s*(?:-|–|to)\s*\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/i,
  ];

  for (const pattern of patterns) {
    const match = clean.match(pattern);
    if (match) return match[0].trim().replace(/\s+/g, ' ');
  }
  return '';
}

function extractLocation(text) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  const afterDate = clean
    .replace(/\b(?:Every\s+)?(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b[^|•;]*/i, '')
    .replace(/\b\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/i, '')
    .replace(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s*-\s*(?:January|February|March|April|May|June|July|August|September|October|November|December)\b/i, '')
    .replace(/\b(?:Free|Sold Out|R\s*[\d\-–, ]+)\b/i, '')
    .replace(/\b(?:5km|10km|21\.1km|42\.2km|42km|4km|8km)(?:\s*,\s*(?:5km|10km|21\.1km|42\.2km|42km|4km|8km))*\b/gi, '')
    .trim();

  // Prefer common site phrasing after the first separator.
  const separatorParts = afterDate.split(/(?:•|\||;)/).map((part) => part.trim()).filter(Boolean);
  if (separatorParts.length) return separatorParts[0];

  const marker = afterDate.match(/(?:Rand Show Road|James & Ethel Gray Park|Menzi Sports Ground|Mapetla Park|Saheti School|Thavhani Mall|Sports & Leisure Centre)[^|•;]*/i);
  if (marker) return marker[0].trim();

  return '';
}

function dedupeAndSort(items) {
  const seen = new Set();
  return items
    .filter((item) => {
      const key = `${normalise(item.title)}|${normalise(item.date)}|${normalise(item.location)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

function resolveUrl(value) {
  try { return new URL(value, EVENTS_URL).toString(); } catch { return EVENTS_URL; }
}

function normalise(value) {
  return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function stripHtml(value) {
  return String(value || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&rsquo;|&lsquo;/gi, "'")
    .replace(/&ndash;/gi, '-')
    .replace(/&mdash;/gi, '-')
    .replace(/&#8211;/gi, '-')
    .replace(/&#8212;/gi, '-')
    .replace(/\s+/g, ' ')
    .trim();
}
