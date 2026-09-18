import { CalendarDays, Mail, ShieldCheck, Pencil, Trophy, Phone, User, Building2, BadgeCheck, LogOut, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProfileData, saveProfile } from '../api/client.js';
import { supabase } from '../api/supabase.js';

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: '', phone: '', gender: '', emergency_contact: '' });

  async function loadProfile() {
    const data = await getProfileData();
    setProfileData(data);
    setForm({ full_name: data.athlete.name || '', phone: data.athlete.phone || '', gender: data.athlete.gender || '', emergency_contact: data.athlete.emergencyContact || '' });
  }

  useEffect(() => { loadProfile().catch((error) => setErrorMessage(error.message)); }, []);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) setErrorMessage(error.message);
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage('');
    try {
      const result = await saveProfile({ ...form, email: athlete.email });
      setProfileData({ athlete: result.athlete, points: profileData.points });
      setEditing(false);
      await loadProfile();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  if (errorMessage && !profileData) return <BackendState title="Profile unavailable" message={errorMessage} />;
  if (!profileData) return <BackendState title="Loading profile" message="Loading member details..." />;

  const { athlete } = profileData;
  const points = Number(profileData.points || athlete.totalPoints || 0);

  return (
    <div className="profile-wrapper">
      <div className="profile-card-simple">
        <div className="section-heading"><div><p className="eyebrow">Profile</p><h2>Club <span className="headline-highlight yellow">member</span> snapshot</h2></div></div>
        <div className="profile-points"><span>Total Reward Points</span><strong>{points.toLocaleString()}</strong></div>
        <div className="profile-top"><div className="profile-avatar">{athlete.avatarUrl ? <img src={athlete.avatarUrl} alt={athlete.name} /> : athlete.avatarInitials}</div><h1>{athlete.name}</h1><p className="profile-subtitle">Hollywood Athletics Club</p><span className="profile-badge">Active Club Member</span></div>
        <div className="profile-details-grid">
          <div className="profile-details-card"><h3>Personal Information</h3><Detail icon={Mail} label="Email" value={athlete.email} /><Detail icon={Phone} label="Phone" value={athlete.phone || 'Not Added'} /><Detail icon={User} label="Gender" value={athlete.gender || 'Not Added'} /><Detail icon={BadgeCheck} label="Emergency Contact" value={athlete.emergencyContact || 'Not Added'} /></div>
          <div className="profile-details-card"><h3>Membership</h3><Detail icon={ShieldCheck} label="Status" value="Verified Member" verified /><Detail icon={Building2} label="Club" value="Hollywood Athletics Club" /><Detail icon={BadgeCheck} label="Region" value={athlete.region || 'Not Added'} /><Detail icon={CalendarDays} label="Member Since" value={athlete.memberSince} /><Detail icon={Trophy} label="Club Number" value={athlete.memberNumber || 'Not Added'} /></div>
        </div>
        {errorMessage ? <div className="info-banner error-banner">{errorMessage}</div> : null}
        <div className="profile-actions"><button type="button" className="profile-edit-btn" onClick={() => setEditing(true)}><Pencil size={18} /> Edit Profile</button><button type="button" className="profile-signout-btn" onClick={handleSignOut}><LogOut size={18} /> Sign Out</button></div>
      </div>

      {editing ? <div className="profile-modal-backdrop"><form className="profile-modal" onSubmit={handleSave}><div className="profile-modal-header"><div><p className="eyebrow">Edit Profile</p><h3>Member details</h3></div><button type="button" className="icon-button" onClick={() => setEditing(false)} aria-label="Close"><X size={19} /></button></div><label>Full name<input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required /></label><label>Phone<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label><label>Gender<select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}><option value="">Select</option><option>Male</option><option>Female</option><option>Prefer not to say</option></select></label><label>Emergency contact<input value={form.emergency_contact} onChange={(e) => setForm({ ...form, emergency_contact: e.target.value })} /></label><div className="profile-modal-actions"><button type="button" className="secondary-button" onClick={() => setEditing(false)}>Cancel</button><button type="submit" className="action-button" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button></div></form></div> : null}
    </div>
  );
}

function Detail({ icon: Icon, label, value, verified = false }) { return <div className="detail-row"><div className="detail-label"><Icon size={18} /><span>{label}</span></div><strong className={verified ? 'verified' : ''}>{value}</strong></div>; }
function BackendState({ title, message }) { return <section className="panel"><h2>{title}</h2><p>{message}</p></section>; }
