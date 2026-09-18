import { ExternalLink } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getMarketplaceData } from '../api/client.js';
import Pagination from '../components/Pagination.jsx';

const PAGE_SIZE = 10;
const shopUrl = 'https://www.hollywoodathleticsclub.co.za/shop-2/';

export default function Marketplace() {
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [page, setPage] = useState(1);
  const [pendingImages, setPendingImages] = useState(0);

  useEffect(() => {
    let mounted = true;
    getMarketplaceData()
      .then((value) => mounted && setData(value))
      .catch((error) => mounted && setErrorMessage(error.message));
    return () => { mounted = false; };
  }, []);

  const products = data?.products || [];
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleProducts = useMemo(
    () => products.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [products, safePage]
  );

  useEffect(() => {
    const count = visibleProducts.filter((product) => Boolean(product?.image)).length;
    setPendingImages(count);
  }, [visibleProducts]);

  const imageLoading = Boolean(data) && pendingImages > 0;

  if (errorMessage) {
    return (
      <div className="page-stack">
        <div className="marketplace-disclaimer">Please note for merchandise purchases, you will be redirected to the Hollywood Athletics Club website.</div>
        <section className="panel">
          <h2>Marketplace unavailable</h2>
          <p>{errorMessage}</p>
          <a className="booking-link" href={shopUrl} target="_blank" rel="noreferrer">Open club shop <ExternalLink size={14} /></a>
        </section>
      </div>
    );
  }

  const showMarketplaceLoading = !data && !errorMessage;

  return (
    <div className="page-stack marketplace-page">
      {showMarketplaceLoading ? (
        <div className="marketplace-loading-state" role="status" aria-live="polite">
          <span className="marketplace-loading-spinner" aria-hidden="true" />
          <span>Loading the latest Hollywood Athletics Club marketplace...</span>
        </div>
      ) : null}
      <div className="marketplace-disclaimer">Please note for merchandise purchases, you will be redirected to the Hollywood Athletics Club website.</div>
      {imageLoading ? (
        <div className="marketplace-loading-inline" role="status" aria-live="polite">
          <span className="marketplace-loading-spinner" aria-hidden="true" />
          <span>Loading the latest product images...</span>
        </div>
      ) : null}

      <section className="marketplace-hero marketplace-hero-refined marketplace-hero-no-card">
        <div>
          <p className="eyebrow">Marketplace</p>
          <h2>Kit for your <span className="headline-highlight yellow">next</span> run</h2>
          <p>Browse the latest gear shown on the official Hollywood Athletics Club website.</p>
        </div>
      </section>

      <section className="product-grid marketplace-products">
        {visibleProducts.map((product) => {
          const imageUrl = product.image
            ? `${product.image}${product.image.includes('?') ? '&' : '?'}strides=${encodeURIComponent(data.fetchedAt || '')}`
            : '';
          return (
            <ProductCard
              key={product.id || product.url || product.name}
              product={product}
              imageUrl={imageUrl}
              shopUrl={shopUrl}
              onImageSettled={() => setPendingImages((count) => Math.max(0, count - 1))}
            />
          );
        })}
      </section>

      <Pagination currentPage={safePage} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}

function formatProductPrice(product) {
  const raw = product?.price ?? product?.cash_price ?? product?.prices?.price ?? '';
  if (raw === '' || raw == null) return 'Price on site';
  if (typeof raw === 'number') {
    const minor = Number(product?.prices?.currency_minor_unit ?? 2);
    return `R${(raw / (10 ** minor)).toFixed(2).replace(/\.00$/, '')}`;
  }
  const text = String(raw).trim();
  if (!text) return 'Price on site';
  return /^R\s*/i.test(text) ? text.replace(/^R\s*/i, 'R') : `R${text}`;
}

function ProductCard({ product, imageUrl, shopUrl, onImageSettled }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [imageSettled, setImageSettled] = useState(false);

  const settleImage = () => {
    if (imageSettled) return;
    setImageSettled(true);
    onImageSettled?.();
  };

  return (
    <article className="product-card">
      <div className="product-image-wrap" aria-busy={Boolean(imageUrl) && !imageFailed}>
        {imageUrl && !imageFailed ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="eager"
            onLoad={settleImage}
            onError={() => { setImageFailed(true); settleImage(); }}
          />
        ) : (
          <div className="product-image-fallback" aria-hidden="true" />
        )}
      </div>
      <div className="product-card-body">
        <span>{product.category || 'Club Gear'}</span>
        <h3>{product.name}</h3>
        <div className="product-card-footer">
          <strong>{formatProductPrice(product)}</strong>
          <a href={product.url || shopUrl} target="_blank" rel="noreferrer">View <ExternalLink size={13} /></a>
        </div>
      </div>
    </article>
  );
}
