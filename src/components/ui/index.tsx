import React from 'react';
import { motion } from 'framer-motion';

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'btn font-semibold inline-flex items-center justify-center gap-2 transition-all';
  
  const variants = {
    primary: 'bg-flash-orange text-white hover:bg-flash-orange-dark shadow-lg shadow-flash-orange/20 hover:shadow-xl hover:shadow-flash-orange/30',
    secondary: 'bg-flash-gray-900 text-white hover:bg-flash-gray-800',
    outline: 'border-2 border-flash-gray-200 text-flash-gray-700 hover:border-flash-orange hover:text-flash-orange bg-white',
    ghost: 'text-flash-gray-600 hover:bg-flash-gray-100 hover:text-flash-gray-900',
    success: 'bg-flash-green text-white hover:bg-flash-green-dark shadow-lg shadow-flash-green/20',
    danger: 'bg-flash-red text-white hover:bg-red-600 shadow-lg shadow-flash-red/20',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
    xl: 'px-8 py-4 text-lg rounded-2xl',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`${baseStyles} ${variants[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon}
      {children}
    </motion.button>
  );
};

// Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, padding = 'md' }) => {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };

  return (
    <div className={`card ${paddings[padding]} ${hover ? 'cursor-pointer hover:-translate-y-1 hover:shadow-xl' : ''} ${className}`}>
      {children}
    </div>
  );
};

// Badge Component
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'sm', dot = false }) => {
  const variants = {
    default: 'bg-flash-gray-100 text-flash-gray-700',
    success: 'bg-green-50 text-green-700 border border-green-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${
          variant === 'success' ? 'bg-green-500' :
          variant === 'warning' ? 'bg-amber-500' :
          variant === 'danger' ? 'bg-red-500' :
          variant === 'info' ? 'bg-blue-500' :
          variant === 'purple' ? 'bg-purple-500' :
          'bg-flash-gray-400'
        }`} />
      )}
      {children}
    </span>
  );
};

// Avatar Component
interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  src?: string;
  online?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', src, online }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  };

  const colors = [
    'bg-flash-orange text-white',
    'bg-flash-purple text-white',
    'bg-flash-green text-white',
    'bg-flash-blue text-white',
    'bg-flash-yellow text-white',
  ];

  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;

  return (
    <div className="relative inline-flex">
      {src ? (
        <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover`} />
      ) : (
        <div className={`${sizes[size]} rounded-full flex items-center justify-center font-bold ${colors[colorIndex]}`}>
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      {online !== undefined && (
        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
          online ? 'bg-flash-green' : 'bg-flash-gray-400'
        }`} />
      )}
    </div>
  );
};

// Empty State Component
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-flash-gray-100 rounded-2xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-flash-gray-900 mb-1">{title}</h3>
      {description && <p className="text-sm text-flash-gray-500 max-w-xs mb-4">{description}</p>}
      {action}
    </div>
  );
};

// Skeleton Loader
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <div className={`shimmer rounded-lg ${className}`} />;
};

// Stat Card
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: string;
  changeType?: 'up' | 'down';
  color?: 'orange' | 'green' | 'purple' | 'blue';
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, change, changeType, color = 'orange' }) => {
  const colorMap = {
    orange: 'bg-flash-orange-50 text-flash-orange',
    green: 'bg-green-50 text-flash-green',
    purple: 'bg-purple-50 text-flash-purple',
    blue: 'bg-blue-50 text-flash-blue',
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-flash-gray-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-flash-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-xs font-medium mt-1 ${changeType === 'up' ? 'text-flash-green' : 'text-flash-red'}`}>
              {changeType === 'up' ? '↑' : '↓'} {change}
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};
