import React from 'react';
import { Logo } from './Logo';
import { UserProfile } from '../types';
import { User, Bell, Sparkles, LogIn, UserPlus } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentUser: UserProfile | null;
  onOpenGoogleSignIn: () => void;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  onOpenGoogleSignIn,
  unreadCount = 2,
}) => {
  const isLoggedIn = !!currentUser && currentUser.name !== 'Guest User';

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'tasks', label: 'My Tasks' },
    { id: 'post', label: 'Post Task' },
    { id: 'alerts', label: 'Alerts', badge: unreadCount },
    { id: 'assistant', label: 'AI Support', icon: Sparkles },
    ...(isLoggedIn ? [{ id: 'profile', label: 'Profile' }] : []),
  ];

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Logo */}
        <div onClick={() => onTabChange('home')} style={{ cursor: 'pointer' }}>
          <Logo size="md" />
        </div>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                {Icon && <Icon style={{ width: '14px', height: '14px', flexShrink: 0 }} />}
                <span>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="nav-badge">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Header Right Utility Controls */}
        <div className="flex-row gap-2">
          {isLoggedIn ? (
            <button
              onClick={() => onTabChange('profile')}
              className="user-profile-button"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="user-avatar-sm"
              />
              <span className="user-profile-name">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <div className="flex-row gap-2">
              <button
                onClick={() => onTabChange('login')}
                className={`btn btn-sm flex-row gap-1.5 ${
                  activeTab === 'login' ? 'btn-primary' : 'btn-ghost'
                }`}
                style={{ borderRadius: '9999px' }}
              >
                <LogIn style={{ width: '14px', height: '14px' }} />
                <span>Log In</span>
              </button>
              <button
                onClick={() => onTabChange('signup')}
                className={`btn btn-sm flex-row gap-1.5 ${
                  activeTab === 'signup' ? 'btn-primary' : 'btn-secondary'
                }`}
                style={{ borderRadius: '9999px' }}
              >
                <UserPlus style={{ width: '14px', height: '14px' }} />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
