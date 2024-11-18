import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  ChevronRight, 
  X,
  Sun,
  Moon,
  Bell,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const SidePanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    {
      title: 'Profile',
      icon: <User size={20} />,
      items: ['Account Settings', 'Portfolio', 'Trading History', 'Preferences', 'Linked Accounts']
    },
    {
      title: 'Security',
      icon: <Shield size={20} />,
      items: ['2FA Settings', 'API Keys', 'Login History', 'Device Management', 'Password Change']
    },
    {
      title: 'Notifications',
      icon: <Bell size={20} />,
      items: ['Price Alerts', 'Trading Alerts', 'News Updates', 'Email Preferences', 'Mobile Notifications']
    },
    {
      title: 'Help',
      icon: <HelpCircle size={20} />,
      items: ['FAQ', 'Support', 'Documentation', 'Contact Us', 'Report Issue']
    }
  ];

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <SettingsIcon className="text-gray-600 dark:text-gray-300" size={24} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Side Panel */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Fixed Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold dark:text-white">Settings</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="text-gray-600 dark:text-gray-300" size={20} />
            </button>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-3 mt-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
               onClick={toggleTheme}>
            <div className="flex items-center gap-3">
              {theme === 'light' ? 
                <Moon className="text-gray-600 dark:text-gray-300" size={20} /> :
                <Sun className="text-gray-600 dark:text-gray-300" size={20} />
              }
              <span className="dark:text-white">Theme</span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{theme}</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {menuItems.map((item) => (
              <div key={item.title} className="space-y-2">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  {item.icon}
                  <span className="dark:text-white">{item.title}</span>
                  <ChevronRight className="ml-auto text-gray-400" size={16} />
                </div>
                <div className="pl-12 space-y-2">
                  {item.items.map((subItem) => (
                    <div
                      key={subItem}
                      className="text-sm text-gray-600 dark:text-gray-400 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                    >
                      {subItem}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button className="flex items-center gap-3 w-full p-3 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}; 