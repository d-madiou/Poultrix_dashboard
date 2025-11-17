import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Sprout, 
  Monitor, 
  AlertTriangle, 
  BarChart3, 
  Settings,
  Search,
  Sun,
  RotateCcw,
  Bell,
  Menu
} from 'lucide-react';

const StatsCard = ({ title, value, change, trend }) => {
  const isPositive = change >= 0;
  return (
    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
      <h3 className="text-sm font-medium opacity-90">{title}</h3>
      <div className="flex items-end justify-between mt-2">
        <span className="text-4xl font-bold">{value}</span>
        <div className="flex items-center gap-1">
          <span className={`text-sm font-medium ${isPositive ? '' : 'opacity-80'}`}>
            {isPositive ? '+' : ''}{change}%
          </span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isPositive ? "M13 7l5 5m0 0l-5 5m5-5H6" : "M13 17l5-5m0 0l-5-5m5 5H6"} />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

