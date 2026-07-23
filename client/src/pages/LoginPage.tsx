import React, { useState } from 'react';
import { Mail, Lock, LogIn, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Logo } from '../components/Logo';
import { UserProfile } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onNavigateToSignup: () => void;
  onOpenGoogleSignIn: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToSignup,
  onOpenGoogleSignIn,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    // Derive user display name from email if not specified
    const namePart = email.split('@')[0];
    const formattedName = namePart
      .split(/[\._-]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const loggedInUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: formattedName || 'Community Member',
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        email
      )}`,
      googleSignedIn: false,
      tasksPosted: 2,
      tasksAccepted: 1,
      tasksCompleted: 3,
      rating: 5.0,
      reviewsCount: 4,
      memberSince: 'Just Now',
    };

    setError(null);
    onLoginSuccess(loggedInUser);
  };

  return (
    <main className="page-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-container">
        {/* Brand Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            <Logo size="lg" />
          </div>
          <h1 className="h1-title" style={{ fontSize: '1.5rem' }}>
            Welcome Back to Hoply
          </h1>
          <p className="text-xs text-muted">
            Log in to connect with trusted local helpers and tasks nearby
          </p>
        </div>

        {/* Form Error Banner */}
        {error && (
          <div className="badge badge-red" style={{ width: '100%', padding: '12px', justifyContent: 'center' }}>
            {error}
          </div>
        )}

        {/* Main Login Form */}
        <form onSubmit={handleSubmit} className="flex-col gap-4">
          <div className="form-group">
            <label className="form-label">
              Email Address
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
            <div className="flex-between" style={{ marginBottom: '4px' }}>
              <label className="form-label" style={{ margin: 0 }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Password reset email feature ready for backend integration.')}
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--primary)', fontWeight: 'bold', padding: 0 }}
              >
                Forgot password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock style={{ width: '16px', height: '16px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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

          <button
            type="submit"
            className="btn btn-primary btn-md flex-row gap-2"
            style={{ width: '100%', marginTop: '8px' }}
          >
            <LogIn style={{ width: '16px', height: '16px' }} />
            <span>Log In</span>
          </button>
        </form>

        {/* Divider */}
        <div style={{ position: 'relative', margin: '8px 0', height: '20px' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '100%', borderTop: '1px solid var(--border-color)' }} />
          </div>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold' }}>
            <span style={{ backgroundColor: 'var(--bg-card)', padding: '0 8px', color: 'var(--text-muted)' }}>
              or continue with
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
          <span>Sign in with Google</span>
        </button>

        {/* Switch to Signup */}
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
          Don't have a Hoply account yet?{' '}
          <button
            onClick={onNavigateToSignup}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--primary)', fontWeight: 'bold', display: 'inline', padding: 0 }}
          >
            Create an Account
          </button>
        </p>

        {/* Backend notice */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-light)', fontWeight: 500, marginTop: '8px' }}>
          <ShieldCheck style={{ width: '14px', height: '14px', color: 'var(--primary)' }} />
          <span>Frontend auth state ready for future API integration</span>
        </div>
      </div>
    </main>
  );
};
