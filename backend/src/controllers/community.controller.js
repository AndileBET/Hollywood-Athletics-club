import { requireSupabase, resolveUserId } from '../services/supabase.service.js';

export async function getMessages(req, res, next) {
  try {
    const supabase = requireSupabase();
    const { data, error } = await supabase.from('community_messages').select('id,user_id,message,created_at,profiles(full_name,email)').order('created_at', { ascending: false }).limit(100);
    if (error) throw error;
    res.json({ messages: data.map(toUiMessage) });
  } catch (error) { next(error); }
}

export async function createMessage(req, res, next) {
  try {
    const userId = await resolveUserId(req);
    const message = String(req.body?.message || '').trim();
    if (!message) return res.status(400).json({ error: 'Message is required.' });
    if (message.length > 500) return res.status(400).json({ error: 'Message must be 500 characters or less.' });
    const supabase = requireSupabase();
    const { data, error } = await supabase.from('community_messages').insert({ user_id: userId, message }).select('id,user_id,message,created_at,profiles(full_name,email)').single();
    if (error) throw error;
    res.status(201).json({ message: toUiMessage(data) });
  } catch (error) { next(error); }
}

function toUiMessage(row) { return { id: row.id, author: row.profiles?.full_name || 'Club member', username: `@${String(row.profiles?.email || '').split('@')[0] || 'member'}`, message: row.message, createdAt: row.created_at, votes: 1 }; }
