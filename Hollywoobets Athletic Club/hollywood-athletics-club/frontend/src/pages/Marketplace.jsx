import { ShoppingBag, Star, Truck } from 'lucide-react';
 
const products = [
  {
    name: 'Elite Running Shoes',
    category: 'Footwear',
    price: 'R1,899',
    image: '/images/marketplace/running-shoes.jpg',
  },
  {
    name: 'Hollywoodbets Club Vest',
    category: 'Apparel',
    price: 'R499',
    image: '/images/marketplace/club-vest.jpg',
  },
  {
    name: 'Compression Running Socks',
    category: 'Recovery',
    price: 'R179',
    image: '/images/marketplace/compression-socks.jpg',
  },
  {
    name: 'Performance Running Cap',
    category: 'Accessories',
    price: 'R249',
    image: '/images/marketplace/running-cap.jpg',
  },
  {
    name: 'Hydration Race Belt',
    category: 'Training',
    price: 'R399',
    image: '/images/marketplace/hydration-belt.jpg',
  },
  {
    name: 'Lightweight Training Shorts',
    category: 'Apparel',
    price: 'R549',
    image: '/images/marketplace/training-shorts.jpg',
  },
  {
    name: 'Sports Travel Bag',
    category: 'Gear',
    price: 'R799',
    image: '/images/marketplace/sports-bag.jpg',
  },
  {
    name: 'GPS Running Watch',
    category: 'Tech',
    price: 'R2,499',
    image: '/images/marketplace/running-watch.jpg',
  },
  {
    name: 'Recovery Foam Roller',
    category: 'Recovery',
    price: 'R299',
    image: '/images/marketplace/recovery-roller.jpg',
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
<h2>Club gear built for race day energy.</h2>
<p>
            Browse running essentials, club apparel, recovery gear, and premium
            training products selected for Hollywoodbets Athletic Club members.
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
<Star aria-hidden="true" size={20} />
<span>Premium club selection</span>
</div>
<div>
<Truck aria-hidden="true" size={20} />
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