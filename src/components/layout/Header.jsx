import React, { useState, useEffect } from 'react';
import { 
  Search,
  Sun,
  RotateCcw,
  Bell,
  Menu
} from 'lucide-react';
import alertService from '../../services/alerts.service';

const Header = ({ onMenuClick, onNotificationClick }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const alerts = await alertService.getAlerts({ resolved: false });
        if (Array.isArray(alerts)) {
          setUnreadCount(alerts.length);
        }
      } catch (error) {
        console.error("Failed to fetch notification count", error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-lg lg:hidden">
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Dashboards</span>
          <span className="text-sm text-gray-400 mx-2">/</span>
          <span className="text-sm font-medium text-gray-900">Overview</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
          />
        </div>
        
        {/* Notification Bell - Now clickable */}
        <button 
          onClick={onNotificationClick}
          className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors cursor-pointer"
          title="View Alerts"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;