import {
  CalendarDays,
  Mail,
  ShieldCheck,
  Pencil,
  Trophy,
  Phone,
  User,
  Building2,
  BadgeCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getProfileData } from "../api/client";

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    getProfileData()
      .then((data) => {
        if (mounted) {
          setProfileData(data);
        }
      })
      .catch((err) => {
        if (mounted) {
          setErrorMessage(err.message);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (errorMessage) {
    return (
      <BackendState
        title="Profile unavailable"
        message={errorMessage}
      />
    );
  }

  if (!profileData) {
    return (
      <BackendState
        title="Loading Profile"
        message="Loading..."
      />
    );
  }

  const { athlete } = profileData;

  return (
    <div className="profile-wrapper">

      <div className="profile-card-simple">

        <div className="section-heading">
          <div>
            <p className="eyebrow">Runner Profile</p>
            <h2>
              Club <span className="headline-highlight yellow">member</span> snapshot
            </h2>
          </div>
        </div>

        {/* Reward Points */}

        <div className="profile-points">

          <span>Total Reward Points</span>

          {/* Replace with backend value later */}
          <strong>{profileData.points?.toLocaleString() ?? "169"}</strong>

        </div>

        {/* Avatar */}

        <div className="profile-top">

          <div className="profile-avatar">

            {athlete.avatarUrl ? (
              <img
                src={athlete.avatarUrl}
                alt={athlete.name}
              />
            ) : (
              athlete.avatarInitials
            )}

          </div>

          <h1>{athlete.name}</h1>

          <p className="profile-subtitle">
            Hollywood Athletics Club
          </p>

          <span className="profile-badge">
            Active Club Member
          </span>

        </div>

        {/* Information */}

        <div className="profile-details-grid">

          {/* Personal */}

          <div className="profile-details-card">

            <h3>Personal Information</h3>

            <div className="detail-row">

              <div className="detail-label">

                <Mail size={18} />

                <span>Email</span>

              </div>

              <strong>{athlete.email}</strong>

            </div>

            <div className="detail-row">

              <div className="detail-label">

                <Phone size={18} />

                <span>Phone</span>

              </div>

              <strong>+27 82 000 0000</strong>

            </div>

            <div className="detail-row">

              <div className="detail-label">

                <User size={18} />

                <span>Gender</span>

              </div>

              <strong>Male</strong>

            </div>

            <div className="detail-row">

              <div className="detail-label">

                <BadgeCheck size={18} />

                <span>Emergency Contact</span>

              </div>

              <strong>Not Added</strong>

            </div>

          </div>

          {/* Membership */}

          <div className="profile-details-card">

            <h3>Membership</h3>

            <div className="detail-row">

              <div className="detail-label">

                <ShieldCheck size={18} />

                <span>Status</span>

              </div>

              <strong className="verified">
                Verified Member
              </strong>

            </div>

            <div className="detail-row">

              <div className="detail-label">

                <Building2 size={18} />

                <span>Club</span>

              </div>

              <strong>
                Hollywood Athletics Club
              </strong>

            </div>

            <div className="detail-row">

              <div className="detail-label">

                <CalendarDays size={18} />

                <span>Member Since</span>

              </div>

              <strong>
                {athlete.memberSince}
              </strong>

            </div>

            <div className="detail-row">

              <div className="detail-label">

                <Trophy size={18} />

                <span>Club Number</span>

              </div>

              <strong>HB-000245</strong>

            </div>

          </div>

        </div>

        {/* Button */}

        <button className="profile-edit-btn">

          <Pencil size={18} />

          Edit Profile

        </button>

      </div>

    </div>
  );
}

function BackendState({ title, message }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <p>{message}</p>
    </section>
  );
}
