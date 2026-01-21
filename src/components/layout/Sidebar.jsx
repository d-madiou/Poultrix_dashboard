import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import poultrixLogo from '../../assets/logo.png';
import { 
  LayoutDashboard, 
  Sprout, 
  Monitor, 
  AlertTriangle, 
  BarChart3, 
  Settings,
  LogOut,
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'farm', icon: Sprout, label: 'Farm Management' },
    { id: 'devices', icon: Monitor, label: 'Devices Monitoring' },
    { id: 'alerts', icon: AlertTriangle, label: 'AI Alerts & Logs' },
    { id: 'settings', icon: Settings, label: 'System Settings' },
  ];

  return (
    <div className="w-64 bg-gray-50 h-screen flex flex-col border-r border-gray-200">
      <div className="p-6 flex items-center justify-center">
        <img src={poultrixLogo} alt="Poultrix Logo" className="h-12" />
      </div>

      <nav className="flex-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 mb-1 rounded-lg transition-colors ${
                isActive ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <UserProfileSection />
    </div>
  );
};

const UserProfileSection = () => {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="p-4 border-t border-gray-200 relative">
      <button 
        onClick={() => setShowMenu(!showMenu)}
        className="w-full flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg transition"
      >
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-white">
            {user?.first_name?.[0] || 'A'}
          </span>
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-gray-700">
            {user?.first_name || 'Admin'}
          </p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
      </button>

      {showMenu && (
        <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
          <button
            onClick={() => {
              setShowMenu(false);
              logout();
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;