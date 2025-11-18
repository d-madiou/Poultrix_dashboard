import { useState } from 'react'
import './App.css'
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Overview from './pages/Overview';

const App = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'overview' && <Overview />}
          {activeTab !== 'overview' && (
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 capitalize">
                {activeTab.replace('-', ' ')}
              </h1>
              <p className="text-gray-600 mt-2">This section is under construction.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
