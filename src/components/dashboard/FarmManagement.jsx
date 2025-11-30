import React, { useEffect, useState } from 'react';
import FarmDetail from './FarmDetail';
import farmService from '../../services/farm.service';
import AddFarmModal from '../common/AddModal';

const FarmManagement = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      setLoading(true);
      const response = await farmService.getAllFarms();
      setFarms(response);
    } catch (err) {
      setError(err.message || 'Failed to load farms');
    } finally {
      setLoading(false);
    }
  };

  const handleFarmAdded = () => {
    setShowAddModal(false);
    fetchFarms();
  };

  const getConnectionStatus = (farm) => {
    return Math.random() > 0.5 ? 'online' : 'offline';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading farms...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchFarms} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (selectedFarm) {
    return <FarmDetail farm={selectedFarm} onBack={() => setSelectedFarm(null)} />;
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-orange-500">Farm Management</h2>
            <span className="text-sm text-gray-500">{farms.length} farms</span>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg transition"
          >
            Add Farm
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farm name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coops Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Connection</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {farms.map((farm) => {
                const connection = getConnectionStatus(farm);
                return (
                  <tr 
                    key={farm.id} 
                    onClick={() => setSelectedFarm(farm)}
                    className="hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{farm.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{farm.coops_count || 0}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                        connection === 'online' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {connection === 'online' ? 'Online' : 'Offline'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                        farm.is_active ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${farm.is_active ? 'bg-green-600' : 'bg-red-600'}`}></span>
                        {farm.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{farm.owner?.name || 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <AddFarmModal 
          onClose={() => setShowAddModal(false)} 
          onSuccess={handleFarmAdded}
        />
      )}
    </>
  );
};

export default FarmManagement;