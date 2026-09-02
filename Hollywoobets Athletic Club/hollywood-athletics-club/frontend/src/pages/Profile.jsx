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
  LogOut,
  Save,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getProfileData, updateProfile } from "../api/client";
import { supabase } from "../api/supabase.js";

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [draft, setDraft] = useState({ email: "", phone: "", gender: "", emergencyContact: "" });

  async function handleSignOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Sign out failed:", error);
    setErrorMessage(error.message);
  }
}

  useEffect(() => {
    let mounted = true;

    getProfileData()
      .then((data) => {
        if (mounted) {
          setProfileData(data);
          setDraft({
            email: data.athlete.email || "",
            phone: data.athlete.phone || "",
            gender: data.athlete.gender || "",
            emergencyContact: data.athlete.emergencyContact || "",
          });
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

  function handleDraftChange(event) {
    setDraft((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function cancelEditing() {
    setDraft({
      email: athlete.email || "",
      phone: athlete.phone || "",
      gender: athlete.gender || "",
      emergencyContact: athlete.emergencyContact || "",
    });
    setIsEditing(false);
    setSaveMessage("");
  }

  async function handleSaveProfile(event) {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    setSaveMessage("");
    try {
      const data = await updateProfile(draft);
      setProfileData(data);
      setIsEditing(false);
      setSaveMessage("Profile updated successfully.");
    } catch (error) {
      setSaveMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }

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

          <strong>{profileData.points.toLocaleString()}</strong>

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

              {isEditing ? <input aria-label="Email" name="email" onChange={handleDraftChange} type="email" value={draft.email} /> : <strong>{athlete.email}</strong>}

            </div>

            <div className="detail-row">

              <div className="detail-label">

                <Phone size={18} />

                <span>Phone</span>

              </div>

              {isEditing ? <input aria-label="Phone" name="phone" onChange={handleDraftChange} type="tel" value={draft.phone} /> : <strong>{athlete.phone || "Not Added"}</strong>}

            </div>

            <div className="detail-row">

              <div className="detail-label">

                <User size={18} />

                <span>Gender</span>

              </div>

              {isEditing ? (
                <select aria-label="Gender" name="gender" onChange={handleDraftChange} value={draft.gender}>
                  <option value="">Prefer not to say</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Other">Other</option>
                </select>
              ) : <strong>{athlete.gender || "Not Added"}</strong>}

            </div>

            <div className="detail-row">

              <div className="detail-label">

                <BadgeCheck size={18} />

                <span>Emergency Contact</span>

              </div>

              {isEditing ? <input aria-label="Emergency contact" name="emergencyContact" onChange={handleDraftChange} type="text" value={draft.emergencyContact} /> : <strong>{athlete.emergencyContact || "Not Added"}</strong>}

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

                <BadgeCheck size={18} />

                <span>Region</span>

              </div>

              <strong>Kwa-Zulu Natal</strong>

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

              <strong>{athlete.clubNumber || "Pending"}</strong>

            </div>

          </div>

        </div>

        {/* Button */}

      {saveMessage ? <p className={`profile-save-message ${isEditing ? "is-error" : ""}`}>{saveMessage}</p> : null}
      <form className="profile-actions" onSubmit={handleSaveProfile}>
  {isEditing ? <>
    <button type="submit" className="profile-edit-btn" disabled={isSaving}>
      <Save size={18} />
      {isSaving ? "Saving..." : "Save Profile"}
    </button>
    <button type="button" className="profile-cancel-btn" disabled={isSaving} onClick={cancelEditing}>
      <X size={18} /> Cancel
    </button>
  </> : <button type="button" className="profile-edit-btn" onClick={() => setIsEditing(true)}>
    <Pencil size={18} /> Edit Profile
  </button>}

  <button
    type="button"
    className="profile-signout-btn"
    onClick={handleSignOut}
  >
    <LogOut size={18} />
    Sign Out
  </button>
</form>

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
