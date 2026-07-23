import React from 'react';
import { Star } from 'lucide-react';

// Custom Reusable Button
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

// Custom Reusable Chip
export const Chip: React.FC<{
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}> = ({ label, icon, active, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`chip ${active ? 'active' : ''} ${className}`}
    >
      {icon && <span className="flex-center shrink-0">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

// Custom Badge
export const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'green' | 'gray' | 'yellow' | 'red';
  className?: string;
}> = ({ children, variant = 'green', className = '' }) => {
  const styles = {
    green: 'badge-green',
    gray: 'badge-gray',
    yellow: 'badge-yellow',
    red: 'badge-red',
  };

  return (
    <span className={`badge ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Star Rating Display
export const StarRating: React.FC<{ rating: number; reviewsCount?: number }> = ({
  rating,
  reviewsCount,
}) => {
  return (
    <div className="flex-row gap-1 text-xs text-bold">
      <div className="flex-row text-warning">
        <Star className="shrink-0" style={{ width: '14px', height: '14px', fill: 'var(--warning)' }} />
        <span style={{ marginLeft: '4px' }}>{rating.toFixed(1)}</span>
      </div>
      {reviewsCount !== undefined && (
        <span className="text-light" style={{ fontWeight: 'normal' }}>({reviewsCount} reviews)</span>
      )}
    </div>
  );
};
