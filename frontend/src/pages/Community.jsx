import { ArrowUp, CalendarDays, MapPin, MessageCircle, Send, Trophy } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getCommunityMessages, postCommunityMessage } from '../api/client.js';
import Pagination from '../components/Pagination.jsx';

const seedMessages = [
  { id: 'seed-1', author: 'Thabo Cele', username: '@thabo', message: 'Good morning team. Ready for the next club session.', createdAt: new Date(Date.now() - 1000 * 60 * 48).toISOString(), votes: 9 },
  { id: 'seed-2', author: 'Lerato Dlamini', username: '@lerato_d', message: 'What is everyone training this week?', createdAt: new Date(Date.now() - 1000 * 60 * 32).toISOString(), votes: 11 },
  { id: 'seed-3', author: 'Sipho Khumalo', username: '@sipho_k', message: 'Has anyone got a good recovery route after the session?', createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(), votes: 7 },
];

const PAGE_SIZE = 5;

export default function Community({ onNavigate }) {
  const [messages, setMessages] = useState(seedMessages);
  const [sort, setSort] = useState('new');
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getCommunityMessages().then((data) => {
      if (Array.isArray(data.messages) && data.messages.length) setMessages(data.messages);
    }).catch(() => {});
  }, []);

  const visibleMessages = useMemo(() => {
    const values = [...messages];
    if (sort === 'top') values.sort((a, b) => Number(b.votes || 0) - Number(a.votes || 0));
    else values.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return values;
  }, [messages, sort]);

  const totalPages = Math.max(1, Math.ceil(visibleMessages.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageMessages = visibleMessages.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function changeSort(nextSort) {
    setSort(nextSort);
    setPage(1);
  }

  async function submitMessage(event) {
    event.preventDefault();
    const message = draft.trim();
    if (!message || sending) return;
    setSending(true);
    try {
      const data = await postCommunityMessage(message);
      setMessages((current) => [data.message, ...current.filter((item) => item.id !== data.message.id)]);
      setDraft('');
      setPage(1);
    } catch {
      const fallback = { id: `local-${Date.now()}`, author: 'You', username: '@you', message, createdAt: new Date().toISOString(), votes: 1 };
      setMessages((current) => [fallback, ...current]);
      setDraft('');
      setPage(1);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="page-stack">
      <section className="community-hero community-hero-refined">
        <div>
          <p className="eyebrow">Community</p>
          <h2>One <span className="headline-highlight yellow">community</span> in motion</h2>
          <p>Share updates, ask questions and connect with other club members.</p>
        </div>
      </section>

      <section className="community-meta-grid">
        <div className="community-meta-card"><CalendarDays size={22} /><strong>Race Day</strong><span>Club events and race updates</span></div>
        <button type="button" className="community-meta-card booking-card" onClick={() => onNavigate?.('Bookings')}>
          <MapPin size={22} /><strong>Bookings</strong><span>Book your next session here</span>
        </button>
        <div className="community-meta-card"><Trophy size={22} /><strong>Club Pride</strong><span>Athletes, supporters and families</span></div>
      </section>

      <section className="community-chat panel">
        <div className="community-chat-header">
          <div><p className="eyebrow">Community Chat</p><h2>Club Conversation</h2><span>Share updates and connect with club members</span></div>
          <MessageCircle size={24} />
        </div>
        <form className="community-chat-composer" onSubmit={submitMessage}>
          <textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Share an update, question or win..." rows={2} maxLength={500} />
          <button className="action-button" type="submit" disabled={!draft.trim() || sending}>{sending ? 'Posting...' : 'Post'} <Send size={15} /></button>
        </form>
        <div className="community-chat-controls"><span>{visibleMessages.length} posts</span><div className="chat-sort"><button type="button" className={sort === 'new' ? 'is-selected' : ''} onClick={() => changeSort('new')}>New</button><button type="button" className={sort === 'top' ? 'is-selected' : ''} onClick={() => changeSort('top')}>Top</button></div></div>
        <div className="community-chat-list">
          {pageMessages.map((item) => (
            <article className="chat-post" key={item.id}>
              <div className="chat-votes"><ArrowUp size={18} /><strong>{item.votes || 0}</strong></div>
              <div className="chat-post-body"><div className="chat-post-meta"><strong>{item.author}</strong><span>{item.username}</span><small>{formatAge(item.createdAt)}</small></div><p>{item.message}</p><div className="chat-post-actions"><span>Reply</span><span>Share</span></div></div>
            </article>
          ))}
        </div>
        <Pagination currentPage={safePage} totalPages={totalPages} onChange={setPage} />
      </section>
    </div>
  );
}

function formatAge(value) {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
