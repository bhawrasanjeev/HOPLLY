import React from 'react';
import { UserProfile } from '../types';
import { CheckCircle, Shield, CreditCard, Bell, HelpCircle, LogOut } from 'lucide-react';

interface ProfilePageProps {
  currentUser: UserProfile;
  onOpenGoogleSignIn: () => void;
  onLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  onOpenGoogleSignIn,
  onLogout,
}) => {
  return (
    <main className="page-container" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '24px' }}>
      {/* Left Column: Identity & Bento Stats */}
      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Identity Card */}
        <section className="profile-card">
          <div style={{ width: '112px', height: '112px', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--border-color)', boxShadow: 'var(--shadow-md)', marginBottom: '4px' }}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <h2 className="h2-title">
            {currentUser.name}
          </h2>
          <p className="text-xs text-muted" style={{ fontFamily: 'monospace', marginTop: '2px' }}>
            {currentUser.email}
          </p>

          {/* Google Auth Status Tag */}
          <div className="badge badge-green flex-row gap-1.5" style={{ marginTop: '12px', padding: '6px 12px' }}>
            <svg style={{ width: '14px', height: '14px', flexShrink: 0 }} viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.28v3.15C3.25 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.28C.46 8.2.0 10.04.0 12c0 1.96.46 3.8 1.28 5.42l4-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.58l4 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Google Account Verified</span>
          </div>

          <div style={{ width: '100%', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <div>
              <span className="text-bold" style={{ color: 'var(--text-main)', marginRight: '4px' }}>
                ⭐ {currentUser.rating}
              </span>
              <span>({currentUser.reviewsCount} reviews)</span>
            </div>
            <div>•</div>
            <div>Since {currentUser.memberSince}</div>
          </div>
        </section>

        {/* Stats Bento Grid */}
        <section className="bento-grid">
          <div className="bento-item" style={{ padding: '16px', backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <span className="bento-label">
              Tasks Posted
            </span>
            <div className="bento-value highlight" style={{ marginTop: '8px' }}>
              {currentUser.tasksPosted}
            </div>
          </div>

          <div className="bento-item" style={{ padding: '16px', backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <span className="bento-label">
              Tasks Accepted
            </span>
            <div className="bento-value highlight" style={{ marginTop: '8px' }}>
              {currentUser.tasksAccepted}
            </div>
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))', color: 'var(--text-white)', padding: '20px', borderRadius: '16px' }}>
            <div>
              <div className="text-xs uppercase text-bold" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Completed Deliveries & Jobs
              </div>
              <div className="bento-value highlight" style={{ color: '#fff', fontSize: '2rem', marginTop: '4px' }}>
                {currentUser.tasksCompleted}
              </div>
            </div>
            <CheckCircle style={{ width: '40px', height: '40px', opacity: 0.3 }} />
          </div>
        </section>
      </div>

      {/* Right Column: Settings & Quick Actions */}
      <div style={{ flex: '2 2 400px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Account Menu Section */}
        <section className="profile-list">
          <div style={{ padding: '16px 24px', backgroundColor: 'var(--bg-muted)', borderBottom: '1px solid var(--border-color)', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
            Account & Security Settings
          </div>
          <ul>
            <li
              onClick={onOpenGoogleSignIn}
              className="profile-list-item"
            >
              <div className="flex-row gap-3">
                <Shield style={{ width: '20px', height: '20px', color: 'var(--primary)' }} />
                <span className="text-bold" style={{ color: 'var(--text-main)' }}>
                  Google Authentication Status
                </span>
              </div>
              <span className="badge badge-green">
                Connected
              </span>
            </li>

            <li className="profile-list-item">
              <div className="flex-row gap-3">
                <CreditCard style={{ width: '20px', height: '20px', color: 'var(--text-muted)' }} />
                <span className="text-bold" style={{ color: 'var(--text-main)' }}>
                  Payment Methods & Hoply Wallet
                </span>
              </div>
              <span className="text-xs text-muted" style={{ fontFamily: 'monospace' }}>Rs. 145.00 Balance</span>
            </li>

            <li className="profile-list-item">
              <div className="flex-row gap-3">
                <Bell style={{ width: '20px', height: '20px', color: 'var(--text-muted)' }} />
                <span className="text-bold" style={{ color: 'var(--text-main)' }}>
                  Notification Preferences
                </span>
              </div>
              <span className="text-xs text-muted">Push & Email</span>
            </li>

            <li className="profile-list-item">
              <div className="flex-row gap-3">
                <HelpCircle style={{ width: '20px', height: '20px', color: 'var(--text-muted)' }} />
                <span className="text-bold" style={{ color: 'var(--text-main)' }}>
                  Help Center & Community Support
                </span>
              </div>
            </li>
          </ul>
        </section>

        {/* Action Buttons */}
        <div className="flex-row gap-3">
          <button
            onClick={onOpenGoogleSignIn}
            className="btn btn-outline btn-md"
            style={{ flex: 1 }}
          >
            Switch Google Account
          </button>
          <button
            onClick={onLogout}
            className="btn btn-md flex-row gap-1.5"
            style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
          >
            <LogOut style={{ width: '16px', height: '16px' }} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </main>
  );
};
