import { CalendarDays, MapPin, Trophy } from 'lucide-react';
 
const updates = [
  {
    title: 'Hollywoodbets race day brings the community together',
    image: '/images/community/runners-1.jpg',
    text: 'Club runners, supporters, and families came together for a memorable event filled with energy, personal bests, and shared celebration.',
  },
  {
    title: 'A powerful finish from the running crew',
    image: '/images/community/runners-2.jpg',
    text: 'The Hollywoodbets Athletic Club runners delivered a strong performance, showing discipline, teamwork, and the spirit of the club.',
  },
  {
    title: 'A beautiful route and unforgettable scenery',
    image: '/images/community/event-scenery.jpg',
    text: 'The event scenery created the perfect race-day atmosphere, giving runners and spectators a premium outdoor experience.',
  },
];
 
export default function Community() {
  return (
<div className="page-stack">
<section className="community-hero">
<div>
<p className="eyebrow">Hollywoodbets Community</p>
<h2>A major event success for the club.</h2>
<p>
            Hollywoodbets hosted a standout running event that brought athletes,
            fans, and the local community together for a powerful day of sport,
            connection, and celebration.
</p>
</div>
 
        <div className="community-scorecard">
<Trophy aria-hidden="true" size={34} />
<strong>Major Success</strong>
<span>Community event highlight</span>
</div>
</section>
 
      <section className="community-meta-grid">
<div className="community-meta-card">
<CalendarDays aria-hidden="true" size={22} />
<strong>Race Day</strong>
<span>Hosted by Hollywoodbets</span>
</div>
 
        <div className="community-meta-card">
<MapPin aria-hidden="true" size={22} />
<strong>Scenic Route</strong>
<span>Outdoor running experience</span>
</div>
 
        <div className="community-meta-card">
<Trophy aria-hidden="true" size={22} />
<strong>Club Pride</strong>
<span>Runners, supporters, and families</span>
</div>
</section>
 
      <section className="community-update-grid">
        {updates.map((update) => (
<article className="community-update-card" key={update.title}>
<img src={update.image} alt={update.title} />
<div>
<p className="eyebrow">Event Update</p>
<h3>{update.title}</h3>
<p>{update.text}</p>
</div>
</article>
        ))}
</section>
</div>
  );
}
