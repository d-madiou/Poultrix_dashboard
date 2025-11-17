import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Sprout, 
  Monitor, 
  AlertTriangle, 
  BarChart3, 
  Settings,
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'farm', icon: Sprout, label: 'Farm Management' },
    { id: 'devices', icon: Monitor, label: 'Devices Monitoring' },
    { id: 'alerts', icon: AlertTriangle, label: 'AI Alerts & Logs' },
    { id: 'reports', icon: BarChart3, label: 'Reports & Analytics' },
    { id: 'settings', icon: Settings, label: 'System Settings' },
  ];

  return (
    <div className="w-64 bg-gray-50 h-screen flex flex-col border-r border-gray-200">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">
            P<span className="text-orange-500">O</span>ULTRIX
          </span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 mb-1 rounded-lg transition-colors ${
                isActive
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">th</span>
          </div>
          <span className="text-sm font-medium text-gray-700">Thierno</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;