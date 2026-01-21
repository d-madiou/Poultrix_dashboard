import { useState } from 'react'
import './App.css'
// Make sure these paths match your actual folder structure
import Sidebar from './components/layout/Sidebar'; 
import Header from './components/layout/Header'; 
import Overview from './pages/Overview';
import FarmManagement from './components/dashboard/FarmManagement';
import AlertsAndLogs from './pages/AlertsAndLogs';
import DeviceManagement from './pages/DeviceManagement';
import Settings from './pages/Settings';

const App = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for mobile sidebar

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar handles navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen} // If your Sidebar supports mobile state
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header receives the function to switch to 'alerts' tab */}
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onNotificationClick={() => setActiveTab('alerts')} 
        />

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'farm' && <FarmManagement />}
          {activeTab === 'alerts' && <AlertsAndLogs />}
          {activeTab === 'devices' && <DeviceManagement />}
          {activeTab === 'settings' && <Settings />}
          
          {/* Fallback for tabs not yet implemented */}
          {activeTab !== 'overview' && activeTab !== 'farm' && activeTab !== 'alerts' && (
            <div className="p-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 capitalize mb-2">
                  {activeTab.replace('-', ' ')}
                </h1>
                <p className="text-gray-500">This section is currently under construction.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;