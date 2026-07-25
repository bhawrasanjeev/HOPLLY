import React, { useState } from 'react';
import { Mail, Lock, User, UserPlus, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Logo } from '../components/Logo';
import { UserProfile } from '../types';

interface SignupPageProps {
  onSignupSuccess: (user: UserProfile) => void;
  onNavigateToLogin: () => void;
  onOpenGoogleSignIn: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({
  onSignupSuccess,
  onNavigateToLogin,
  onOpenGoogleSignIn,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: fullName.trim(),
      email: email.trim(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        fullName
      )}`,
      googleSignedIn: false,
      tasksPosted: 0,
      tasksAccepted: 0,
      tasksCompleted: 0,
      rating: 5.0,
      reviewsCount: 0,
      memberSince: 'Just Now',
    };

    setError(null);
    onSignupSuccess(newUser);
  };

  return (
    <main className="page-container" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-container">
        {/* Brand Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            <Logo size="lg" />
          </div>
          <h1 className="h1-title" style={{ fontSize: '1.5rem' }}>
            Create Your Hoplly Account
          </h1>
          <p className="text-xs text-muted">
            Join your hyperlocal neighborhood network to request or help with tasks
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="badge badge-red" style={{ width: '100%', padding: '12px', justifyContent: 'center' }}>
            {error}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="flex-col gap-4">
          <div className="form-group">
            <label className="form-label">
              Full Name *
            </label>
            <div style={{ position: 'relative' }}>
              <User style={{ width: '16px', height: '16px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="form-input"
                style={{ paddingLeft: '36px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ width: '16px', height: '16px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="form-input"
                style={{ paddingLeft: '36px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Password *
            </label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ width: '16px', height: '16px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="form-input"
                style={{ paddingLeft: '36px', paddingRight: '36px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn btn-ghost"
                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', padding: '4px', minWidth: 'auto' }}
              >
                {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Confirm Password *
            </label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ width: '16px', height: '16px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="form-input"
                style={{ paddingLeft: '36px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-md flex-row gap-2"
            style={{ width: '100%', marginTop: '8px' }}
          >
            <UserPlus style={{ width: '16px', height: '16px' }} />
            <span>Sign Up Free</span>
          </button>
        </form>

        {/* Divider */}
        <div style={{ position: 'relative', margin: '8px 0', height: '20px' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '100%', borderTop: '1px solid var(--border-color)' }} />
          </div>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold' }}>
            <span style={{ backgroundColor: 'var(--bg-card)', padding: '0 8px', color: 'var(--text-muted)' }}>
              or sign up with
            </span>
          </div>
        </div>

        {/* Google OAuth Option */}
        <button
          onClick={onOpenGoogleSignIn}
          type="button"
          className="btn btn-outline flex-row gap-2.5"
          style={{ width: '100%', padding: '12px' }}
        >
          <svg style={{ width: '16px', height: '16px', flexShrink: 0 }} viewBox="0 0 24 24">
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
          <span>Continue with Google</span>
        </button>

        {/* Switch to Login */}
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
          Already have an account?{' '}
          <button
            onClick={onNavigateToLogin}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--primary)', fontWeight: 'bold', display: 'inline', padding: 0 }}
          >
            Log In Here
          </button>
        </p>

        {/* Security / Verification badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-light)', fontWeight: 500, marginTop: '8px' }}>
          <ShieldCheck style={{ width: '14px', height: '14px', color: 'var(--primary)' }} />
          <span>Frontend auth state ready for future API integration</span>
        </div>
      </div>
    </main>
  );
};
