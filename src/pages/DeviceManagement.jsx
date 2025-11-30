import React, { useEffect, useState } from 'react';
import deviceService from '../services/device.service';
import StatsCard from '../components/dashboard/StatsCard';

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, online: 0, warning: 0, offline: 0 });

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const data = await deviceService.getDevices();
      const deviceList = Array.isArray(data) ? data : (data.results || []);
      setDevices(deviceList);
      calculateStats(deviceList);
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const stats = {
      total: data.length,
      online: data.filter(d => d.status === 'online').length,
      warning: data.filter(d => d.status === 'error').length,
      offline: data.filter(d => d.status === 'offline').length,
    };
    setStats(stats);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'online': return 'text-green-500 font-bold';
      case 'error': return 'text-yellow-500 font-bold';
      case 'offline': return 'text-red-400 font-bold';
      default: return 'text-gray-500';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'online': return 'Connected';
      case 'error': return 'Unstable';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold text-gray-900">Devices Monitoring</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Devices" count={stats.total} color="bg-[#E67E22]" />
        <StatCard title="Online" count={stats.online} color="bg-[#D35400]" />
        <StatCard title="Warning" count={stats.warning} color="bg-[#E67E22]" />
        <StatCard title="Offline" count={stats.offline} color="bg-[#D35400]" />
      </div>

      {/* Devices Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-orange-500">Devices Monitoring</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Device ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last update</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Farm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {devices.map((device) => (
                <tr key={device.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                    {device.device_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {device.device_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={getStatusStyle(device.status)}>
                      {getStatusLabel(device.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {device.last_sync ? new Date(device.last_sync).toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {device.farm_name || '-'}
                  </td>
                </tr>
              ))}
              
              {devices.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No devices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, count, color }) => (
  <div className={`${color} rounded-2xl p-6 text-white shadow-lg`}>
    <p className="text-sm font-medium opacity-90 mb-1">{title}</p>
    <h3 className="text-3xl font-bold">{count}</h3>
  </div>
);

export default DeviceManagement;