import React from 'react';
import { Loader2 } from 'lucide-react';

// Full Page Loader
export const FullPageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center z-50">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center">
        {/* Logo/Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 mb-6 shadow-2xl animate-pulse">
          <span className="text-4xl">💰</span>
        </div>

        {/* Spinner */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-violet-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-violet-600 border-r-fuchsia-600 rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Message */}
        <p className="text-slate-700 font-semibold text-lg mb-2">{message}</p>
        <p className="text-slate-500 text-sm">Please wait a moment</p>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

// Inline Loader (for buttons, cards, etc.)
export const InlineLoader = ({ size = 'md', message = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Loader2 className={`${sizeClasses[size]} text-violet-600 animate-spin`} />
      {message && <span className="text-slate-600 text-sm font-medium">{message}</span>}
    </div>
  );
};

// Card Loader (for loading content inside cards)
export const CardLoader = ({ message = 'Loading content...' }) => {
  return (
    <div className="w-full p-8 flex flex-col items-center justify-center">
      <div className="relative mb-4">
        <div className="w-12 h-12 border-4 border-violet-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-t-violet-600 border-r-fuchsia-600 rounded-full animate-spin"></div>
      </div>
      <p className="text-slate-600 text-sm font-medium">{message}</p>
    </div>
  );
};

// Skeleton Loader (for content placeholders)
export const SkeletonLoader = ({ type = 'text', className = '' }) => {
  const skeletonTypes = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    card: 'h-32 w-full rounded-xl',
    button: 'h-10 w-24 rounded-lg'
  };

  return (
    <div className={`bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-shimmer ${skeletonTypes[type]} ${className}`}></div>
  );
};

// Dots Loader (simple animated dots)
export const DotsLoader = ({ size = 'md', color = 'violet' }) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const colorClasses = {
    violet: 'bg-violet-600',
    fuchsia: 'bg-fuchsia-600',
    purple: 'bg-purple-600'
  };

  return (
    <div className="flex items-center justify-center gap-1.5">
      <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}></div>
      <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce animation-delay-200`}></div>
      <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce animation-delay-400`}></div>
    </div>
  );
};

// Spinner Loader (minimal spinner)
export const SpinnerLoader = ({ size = 'md', color = 'violet' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  const colorClasses = {
    violet: 'border-violet-200 border-t-violet-600',
    fuchsia: 'border-fuchsia-200 border-t-fuchsia-600',
    purple: 'border-purple-200 border-t-purple-600'
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}></div>
  );
};

// Progress Loader (with percentage)
export const ProgressLoader = ({ progress = 0, message = 'Loading...' }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-2">
        <span className="text-slate-700 font-medium text-sm">{message}</span>
        <span className="text-violet-600 font-semibold text-sm">{progress}%</span>
      </div>
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

// Main Loader Component (default export)
const Loader = ({ 
  type = 'full', 
  size = 'md', 
  message = 'Loading...', 
  progress = 0,
  color = 'violet',
  className = ''
}) => {
  const loaderTypes = {
    full: <FullPageLoader message={message} />,
    inline: <InlineLoader size={size} message={message} />,
    card: <CardLoader message={message} />,
    skeleton: <SkeletonLoader type={size} className={className} />,
    dots: <DotsLoader size={size} color={color} />,
    spinner: <SpinnerLoader size={size} color={color} />,
    progress: <ProgressLoader progress={progress} message={message} />
  };

  return loaderTypes[type] || loaderTypes.full;
};

export default Loader;

// Add keyframe animations
const style = document.createElement('style');
style.textContent = `
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  .animate-shimmer {
    background-size: 1000px 100%;
    animation: shimmer 2s infinite linear;
  }
  .animation-delay-200 {
    animation-delay: 0.2s;
  }
  .animation-delay-400 {
    animation-delay: 0.4s;
  }
`;
document.head.appendChild(style);