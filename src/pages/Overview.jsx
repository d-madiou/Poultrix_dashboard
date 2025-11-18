import React, { useState } from 'react';
import StatsCard from "../components/dashboard/StatsCard";
import UserManagement from "../components/dashboard/UserManagement";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";


const Overview = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const stats = [
    { title: 'Total farms', value: '29', change: 11.02 },
    { title: 'Active coops', value: '715', change: -0.03 },
    { title: 'Active alerts', value: '31', change: 15.03 },
    { title: 'Connected devices', value: '234', change: 6.08 },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          <UserManagement />
        </main>
      </div>
    </div>
  );
};

export default Overview;