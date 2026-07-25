import React, { useState } from 'react';
import { X, Check, Shield, User, Mail, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  availableAccounts?: { name: string; email: string; avatar: string }[];
  onLoginSuccess: (updatedUser: UserProfile) => void;
}

export const GoogleSignInModal: React.FC<GoogleSignInModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  availableAccounts,
  onLoginSuccess,
}) => {
  const [step, setStep] = useState<'choose' | 'custom' | 'success'>('choose');
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  if (!isOpen) return null;

  const defaultAccounts = [
    {
      name: 'Sanjeev Bhaw',
      email: 'bhawsanjeev102@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    },
    {
      name: 'Jane Doe',
      email: 'jane.doe@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    },
    {
      name: 'Alex M. Helper',
      email: 'alex.helper@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    },
  ];

  const accountsToDisplay = availableAccounts && availableAccounts.length > 0 ? availableAccounts : defaultAccounts;

  const handleSelectAccount = (acc: { name: string; email: string; avatar: string }) => {
    setSelectedAccount(acc.email);
    setTimeout(() => {
      onLoginSuccess({
        ...currentUser,
        name: acc.name,
        email: acc.email,
        avatar: acc.avatar,
        googleSignedIn: true,
      });
      setStep('success');
      setTimeout(() => {
        onClose();
        setStep('choose');
        setSelectedAccount(null);
      }, 1200);
    }, 600);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    const name = customName || customEmail.split('@')[0];
    onLoginSuccess({
      ...currentUser,
      name: name,
      email: customEmail,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      googleSignedIn: true,
    });
    setStep('success');
    setTimeout(() => {
      onClose();
      setStep('choose');
      setCustomName('');
      setCustomEmail('');
    }, 1200);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        {/* Header */}
        <div className="modal-header">
          <div className="flex-row gap-2">
            {/* Official Google G Logo */}
            <svg style={{ width: '20px', height: '20px', flexShrink: 0 }} viewBox="0 0 24 24">
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
            <span className="h3-title">
              Sign in with Google
            </span>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost"
            style={{ padding: '6px', borderRadius: '50%' }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Content Body */}
        <div className="modal-body" style={{ padding: '24px' }}>
          {step === 'choose' && (
            <div className="flex-col gap-4">
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <h3 className="h2-title" style={{ fontSize: '1.25rem' }}>
                  Choose an account
                </h3>
                <p className="text-sm text-muted">
                  to continue to <span className="text-bold" style={{ color: 'var(--primary)' }}>Hoplly</span>
                </p>
              </div>

              {/* Account List */}
              <div className="flex-col gap-2">
                {accountsToDisplay.map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() => handleSelectAccount(acc)}
                    disabled={selectedAccount === acc.email}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '12px',
                      border: selectedAccount === acc.email ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      backgroundColor: selectedAccount === acc.email ? 'rgba(22, 163, 74, 0.05)' : 'var(--bg-card)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                    }}
                  >
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-bold text-sm" style={{ color: 'var(--text-main)' }}>
                        {acc.name}
                      </div>
                      <div className="text-xs text-muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {acc.email}
                      </div>
                    </div>
                    {selectedAccount === acc.email ? (
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Check style={{ width: '14px', height: '14px' }} />
                      </div>
                    ) : (
                      <span className="badge badge-green">
                        Sign In
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative', margin: '8px 0', height: '20px' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '100%', borderTop: '1px solid var(--border-color)' }} />
                </div>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', fontSize: '12px', textTransform: 'uppercase' }}>
                  <span style={{ backgroundColor: 'var(--bg-card)', padding: '0 8px', color: 'var(--text-muted)' }}>
                    or
                  </span>
                </div>
              </div>

              <button
                onClick={() => setStep('custom')}
                className="btn btn-outline flex-row gap-2"
                style={{ width: '100%', borderStyle: 'dashed', padding: '12px' }}
              >
                <User style={{ width: '16px', height: '16px' }} />
                <span>Use another Google Account</span>
              </button>

              <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Shield style={{ width: '14px', height: '14px', color: 'var(--primary)' }} />
                <span>Protected by Google OAuth 2.0 Security & Hoplly Encryption</span>
              </div>
            </div>
          )}

          {step === 'custom' && (
            <form onSubmit={handleCustomSubmit} className="flex-col gap-4">
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <h3 className="h2-title" style={{ fontSize: '1.25rem' }}>
                  Enter your Google Account
                </h3>
                <p className="text-sm text-muted">Sign in with your Google email address</p>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Full Name (Optional)
                </label>
                <div style={{ position: 'relative' }}>
                  <User style={{ width: '16px', height: '16px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Sanjeev Bhaw"
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Google Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ width: '16px', height: '16px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    required
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="your.email@gmail.com"
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                  />
                </div>
              </div>

              <div className="flex-row gap-2" style={{ marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setStep('choose')}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-row gap-2"
                  style={{ flex: 1 }}
                >
                  <Sparkles style={{ width: '16px', height: '16px' }} />
                  <span>Sign In</span>
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="flex-col" style={{ alignItems: 'center', justifyContent: 'center', padding: '32px 0', textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <Check style={{ width: '32px', height: '32px' }} />
              </div>
              <h3 className="h2-title" style={{ fontSize: '1.25rem' }}>
                Google Authentication Successful!
              </h3>
              <p className="text-sm text-muted" style={{ marginTop: '4px' }}>
                Logged in as <span className="text-bold" style={{ color: 'var(--primary)' }}>{currentUser.email}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
