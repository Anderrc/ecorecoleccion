import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  showNotifications?: boolean;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle, 
  actions,
  showNotifications = true,
  onMenuClick 
}) => {
  return (
    <header className="dashboard-card border-b border-gray-200 px-4 sm:px-6 py-4 mx-4 mt-4 rounded-lg shadow-eco">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Mobile menu button */}
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 mr-3 text-gray-400 hover:text-gray-600 transition-eco"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden sm:block">
            {actions}
          </div>
          
          {showNotifications && (
            <button className="relative p-2 text-gray-400 hover:text-gray-500 transition-eco">
              <span className="sr-only">Ver notificaciones</span>
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.5-3.5c-.3-.3-.7-.5-1.1-.5H14c-.6 0-1 .4-1 1v3z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9z" />
              </svg>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </button>
          )}
          
          <button className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-500 transition-eco">
            <span className="sr-only">Menú usuario</span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-eco-primary rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium">
              U
            </div>
          </button>
        </div>
      </div>
      
      {/* Mobile actions */}
      <div className="sm:hidden mt-4 pt-4 border-t border-gray-200">
        {actions}
      </div>
    </header>
  );
};

export default Header;
