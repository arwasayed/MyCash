import React from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, GlobeIcon, SettingsIcon } from 'lucide-react';
import UserAvatar from '../UI/UserAvatar.jsx';

const Header = ({ currentPage, onPageChange }) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'الصفحة الرئيسية',
      path: '/'
    },
    {
      id: 'assistant',
      label: 'المساعد الذكي',
      path: '/assistant'
    },
    {
      id: 'goals',
      label: 'اهدافي',
      path: '/goals'
    },
    {
      id: 'reports',
      label: 'التقارير',
      path: '#'
    },
    {
      id: 'wallet',
      label: 'محفظتي',
      path: '#'
    },
    {
      id: 'subscriptions',
      label: 'الاشتراكات',
      path: '#'
    }
  ];

  return (
    <header className="bg-white py-4 px-6 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <UserAvatar />
          <div className="flex items-center space-x-4 space-x-reverse">
            <button className="p-2 text-gray-500 hover:text-purple-600">
              <BellIcon size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-purple-600">
              <GlobeIcon size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-purple-600">
              <SettingsIcon size={20} />
            </button>
          </div>
        </div>
        <nav className="hidden md:flex">
          <ul className="flex space-x-8 space-x-reverse">
            {navItems.map(item => (
              <li key={item.id}>
                <Link 
                  to={item.path} 
                  className={`text-base ${currentPage === item.id ? 'text-purple-600 font-medium' : 'text-gray-700'}`} 
                  onClick={() => onPageChange(item.id)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="text-2xl font-bold text-purple-600">ماي كاش</div>
      </div>
    </header>
  );
};

export default Header; 