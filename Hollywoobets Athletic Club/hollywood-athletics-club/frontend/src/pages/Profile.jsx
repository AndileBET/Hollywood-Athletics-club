import { CalendarDays, IdCard, Image, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProfileData } from '../api/client.js';

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    getProfileData()
      .then((data) => {
        if (isMounted) {
          setProfileData(data);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setErrorMessage(error.message);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (errorMessage) {
    return <BackendState title="Profile unavailable" message={errorMessage} />;
  }

  if (!profileData) {
    return <BackendState title="Loading profile" message="Fetching profile from Supabase." />;
  }

  const { athlete } = profileData;

  return (
    <div className="page-stack">
      <section className="profile-header">
        <div className="avatar">
          {athlete.avatarUrl ? (
            <img alt={athlete.name} src={athlete.avatarUrl} />
          ) : (
            athlete.avatarInitials
          )}
        </div>
        <div>
          <p className="eyebrow">Profile</p>
          <h2>{athlete.name}</h2>
          <div className="profile-meta">
            <span><Mail aria-hidden="true" size={15} />{athlete.email}</span>
            <span><CalendarDays aria-hidden="true" size={15} />Member since {athlete.memberSince}</span>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Database Row</p>
            <h2>profiles</h2>
          </div>
        </div>
        <div className="achievement-stats">
          {/* <div>
            <strong><IdCard aria-hidden="true" size={18} /> ID</strong>
            <span>{athlete.id}</span>
          </div> */}
          <div>
            <strong><Mail aria-hidden="true" size={18} /> Email</strong>
            <span>{athlete.email}</span>
          </div>
          <div>
            <strong><CalendarDays aria-hidden="true" size={18} /> Member Since</strong>
            <span>{athlete.memberSince}</span>
          </div>
          <div>
            <strong><Image aria-hidden="true" size={18} /> Avatar URL</strong>
            <span>{athlete.avatarUrl || 'No avatar set'}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function BackendState({ title, message }) {
  return (
    <section className="panel">
      <p className="eyebrow">Backend</p>
      <h2>{title}</h2>
      <p>{message}</p>
    </section>
  );
}
