import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
}

interface SidebarProps {
  navItems: NavItem[];
  userInfo?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, userInfo, onClose }) => {
  return (
    <div className="h-screen w-64 dashboard-card flex flex-col shadow-eco-lg relative">
      {/* Close button for mobile */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 lg:hidden p-2 text-gray-400 hover:text-gray-600 transition-eco"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-eco-primary">
          🌱 EcoRecolección
        </h1>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`
              flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-eco
              ${item.active 
                ? 'bg-green-50 text-eco-primary border-r-2 border-eco-primary' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      
      {/* User Info */}
      {userInfo && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-eco-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
              {userInfo.avatar ? (
                <Image 
                  src={userInfo.avatar} 
                  alt={userInfo.name} 
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full" 
                />
              ) : (
                userInfo.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{userInfo.name}</p>
              <p className="text-xs text-gray-500">{userInfo.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
