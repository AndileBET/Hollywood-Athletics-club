import { ShoppingBag, Star, Truck } from 'lucide-react';
 
const products = [
  {
    name: 'Hollywood Athletics club comrades marathon ZIP Pullover 2026',
    category: 'pULLOVER',
    price: 'R425',
    image: '/images/marketplace/Hollywood_Zipper.jpg',
  },
  {
    name: 'Hollywoodbets Hoodie UNISEX',
    category: 'Hoodie',
    price: 'R499',
    image: '/images/marketplace/hoodie.jpg',
  },
  {
    name: '1/4 ZIP Pullover (UNISEX)',
    category: 'Pullover',
    price: 'R350',
    image: '/images/marketplace/pullover.jpg',
  },
  {
    name: 'Tracksuit (UNISEX)',
    category: 'Tracksuit',
    price: 'R700',
    image: '/images/marketplace/tracksuit.jpg',
  },
  {
    name: 'Shorts Black(UNISEX)',
    category: 'Training',
    price: 'R200',
    image: '/images/marketplace/shorts.jpg',
  },
  {
    name: 'Soft Peak Cap',
    category: 'Apparel',
    price: 'R300',
    image: '/images/marketplace/Soft_peak_cap.jpg',
  },
  {
    name: 'Race Socks',
    category: 'Gear',
    price: 'R100',
    image: '/images/marketplace/Race_socks.jpg',
  },
  {
    name: 'Bucket Hat',
    category: 'Tech',
    price: 'R100',
    image: '/images/marketplace/bucket_hat.jpg',
  },
  {
    name: 'Beanie',
    category: 'Recovery',
    price: 'R100',
    image: '/images/marketplace/Beanie.jpg',
  },
  {
    name: 'Race Day Training Tee',
    category: 'Apparel',
    price: 'R429',
    image: '/images/marketplace/race-tee.jpg',
  },
];
 
export default function Marketplace() {
  return (
<div className="page-stack">
<section className="marketplace-hero">
<div>
<p className="eyebrow">Hollywoodbets Marketplace</p>
<h2>Kit for your <span className="headline-highlight yellow">next</span> run.</h2>
<p>
            Browse club apparel, recovery tools, and training essentials chosen
            for members who want performance, comfort, and everyday running style.
</p>
</div>
 
        <div className="marketplace-highlight">
<ShoppingBag aria-hidden="true" size={32} />
<strong>10 featured products</strong>
<span>Member-ready running gear</span>
</div>
</section>
 
      <section className="marketplace-strip">
<div>
<Star aria-hidden="true" size={40} />
<span>Premium club selection</span>
</div>
<div>
<Truck aria-hidden="true" size={40} />
<span>Delivery-ready product range</span>
</div>
</section>
 
      <section className="product-grid">
        {products.map((product) => (
<article className="product-card" key={product.name}>
<img src={product.image} alt={product.name} />
<div className="product-card-body">
<span>{product.category}</span>
<h3>{product.name}</h3>
<div className="product-card-footer">
<strong>{product.price}</strong>
<button type="button">View</button>
</div>
</div>
</article>
        ))}
</section>
</div>
  );
}
