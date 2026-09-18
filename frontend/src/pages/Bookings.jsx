import { useEffect, useState } from 'react';
import { CalendarDays, ExternalLink, MapPin, RefreshCw } from 'lucide-react';
import { getBookingsData } from '../api/client.js';
import Pagination from '../components/Pagination.jsx';

export default function Bookings() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    getBookingsData()
      .then((data) => {
        if (!active) return;
        setEvents(Array.isArray(data?.events) ? data.events : []);
        setPage(1);
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.message || 'Unable to load club events.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(events.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleEvents = events.slice((safePage - 1) * pageSize, safePage * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const retry = () => {
    setLoading(true);
    setError('');
    getBookingsData()
      .then((data) => {
        setEvents(Array.isArray(data?.events) ? data.events : []);
        setPage(1);
      })
      .catch((err) => setError(err?.message || 'Unable to load club events.'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="page-stack">
      <section className="page-header bookings-header">
        <p className="eyebrow">Bookings</p>
        <h2>Book your next <span className="headline-highlight yellow">session</span></h2>
        <p>Choose a club training session or event. Booking links open on the official Hollywood Athletics Club website.</p>
      </section>

      {loading && (
        <section className="bookings-loading-card" aria-live="polite">
          <RefreshCw className="spin" size={22} />
          <div>
            <strong>Loading latest events</strong>
            <span>Fetching the current events from the Hollywood Athletics Club website.</span>
          </div>
        </section>
      )}

      {!loading && error && (
        <section className="bookings-error-card" role="alert">
          <div>
            <strong>Unable to load events</strong>
            <span>{error}</span>
          </div>
          <button type="button" className="action-button secondary" onClick={retry}>Try again</button>
        </section>
      )}

      {!loading && !error && (
        <>
          <section className="booking-grid">
            {visibleEvents.map((event) => (
              <article className="booking-card-panel" key={`${event.id || event.url}-${event.title}`}>
                <div className="booking-card-icon"><CalendarDays size={20} /></div>
                <div className="booking-card-copy">
                  <h3>{event.title}</h3>
                  <span><CalendarDays size={14} /> {event.date}</span>
                  <span><MapPin size={14} /> {event.location}</span>
                </div>
                <a href={event.url} target="_blank" rel="noreferrer" className="booking-link">
                  {event.action || 'View event'} <ExternalLink size={14} />
                </a>
              </article>
            ))}
          </section>
          <Pagination currentPage={safePage} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );

}