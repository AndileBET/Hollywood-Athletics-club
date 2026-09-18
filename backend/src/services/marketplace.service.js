import axios from 'axios';

const SHOP_URL = 'https://www.hollywoodathleticsclub.co.za/shop-2/';
const STORE_API_URL = 'https://www.hollywoodathleticsclub.co.za/wp-json/wc/store/v1/products';
const USER_AGENT = 'STRIDES-Club-Marketplace/1.0';

export async function getLiveMarketplace() {
  const fetchedAt = new Date().toISOString();

  let shopProducts = [];
  try {
    const response = await axios.get(SHOP_URL, {
      timeout: 20000,
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,application/xhtml+xml' },
    });
    shopProducts = parseWooCommerceHtml(response.data).filter(isUsableProduct);
  } catch (_) {
    // Try the store API if the public shop page cannot be fetched.
  }

  try {
    const response = await axios.get(STORE_API_URL, {
      params: { per_page: 100 },
      timeout: 20000,
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
    });
    const apiProducts = Array.isArray(response.data)
      ? response.data.map(toStoreProduct).filter(isUsableProduct)
      : [];

    if (shopProducts.length) {
      const byUrl = new Map(apiProducts.map((item) => [normaliseUrl(item.url), item]));
      const byName = new Map(apiProducts.map((item) => [normaliseName(item.name), item]));
      shopProducts = shopProducts.map((item) => {
        const match = byUrl.get(normaliseUrl(item.url)) || byName.get(normaliseName(item.name));
        return match
          ? {
              ...item,
              name: match.name || item.name,
              price: match.price || item.price,
              image: match.image || item.image,
              url: match.url || item.url,
              category: match.category || item.category,
              description: match.description || item.description,
            }
          : item;
      });
    } else {
      shopProducts = apiProducts;
    }
  } catch (_) {
    // Keep shop page results, which preserve the live storefront display.
  }

  if (!shopProducts.length) {
    const error = new Error('The official club shop could not be loaded.');
    error.statusCode = 502;
    throw error;
  }

  return { fetchedAt, source: SHOP_URL, products: shopProducts };
}
function toStoreProduct(product) {
  const price = product.prices?.price;
  const minorUnit = Number(product.prices?.currency_minor_unit ?? 2);
  const divisor = 10 ** minorUnit;
  const priceText = Number.isFinite(Number(price)) ? `R${(Number(price) / divisor).toFixed(2).replace(/\.00$/, '')}` : '';
  return {
    id: String(product.id),
    name: stripHtml(product.name || ''),
    category: product.categories?.[0]?.name || 'Club Gear',
    price: priceText,
    image: product.images?.[0]?.src || '',
    url: product.permalink || SHOP_URL,
    description: stripHtml(product.short_description || product.description || ''),
  };
}

function parseWooCommerceHtml(html) {
  const items = [];
  const productBlocks = html.match(/<li[^>]*class=["'][^"']*product[^"']*["'][^>]*>[\s\S]*?<\/li>/gi) || [];
  for (const block of productBlocks) {
    const linkMatch = block.match(/<a[^>]+href=["']([^"']+)["'][^>]*>/i);
    const titleMatch = block.match(/<h2[^>]*class=["'][^"']*woocommerce-loop-product__title[^"']*["'][^>]*>([\s\S]*?)<\/h2>/i)
      || block.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    const imageMatch = block.match(/<img[^>]+(?:data-src|data-lazy-src|src)=["']([^"']+)["'][^>]*>/i);
    const priceMatch = block.match(/<span[^>]*class=["'][^"']*price[^"']*["'][^>]*>([\s\S]*?)<\/span>/i);

    const name = stripHtml(titleMatch?.[1] || '');
    const image = imageMatch?.[1] || '';
    const url = linkMatch?.[1] || SHOP_URL;
    const priceRaw = stripHtml(priceMatch?.[1] || '').replace(/\s+/g, ' ').trim();
    const price = (priceRaw.match(/R\s*[\d,.]+/i)?.[0] || '').replace(/\s+/g, '').replace(',', '.');

    if (!name || !image) continue;
    items.push({
      id: url,
      name,
      category: categoryFromName(name),
      price,
      image: resolveUrl(image),
      url: resolveUrl(url),
      description: '',
    });
  }
  return items;
}


function normaliseName(value) {
  return stripHtml(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function normaliseUrl(value) {
  try {
    const url = new URL(value || SHOP_URL);
    url.hash = '';
    url.search = '';
    url.pathname = url.pathname.replace(/\/+$/, '/') || '/';
    return url.toString().toLowerCase();
  } catch {
    return String(value || '').trim().replace(/\/+$/, '/').toLowerCase();
  }
}

function categoryFromName(name) {
  const value = name.toLowerCase();
  if (value.includes('vest') || value.includes('top') || value.includes('t-shirt') || value.includes('shirt')) return 'Vests & Shirts';
  if (value.includes('sock')) return 'Socks';
  if (value.includes('tight') || value.includes('pants')) return 'Tights';
  if (value.includes('short')) return 'Shorts';
  if (value.includes('cap') || value.includes('hat') || value.includes('beanie') || value.includes('visor')) return 'Accessories';
  return 'Club Gear';
}

function resolveUrl(value) {
  if (!value) return '';
  return new URL(value, SHOP_URL).toString();
}

function isUsableProduct(product) {
  return Boolean(product?.name && product?.image && product?.url);
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
