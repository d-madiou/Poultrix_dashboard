import React, { useState, useEffect } from 'react';
import { LayoutDashboard, AlertCircle, HardDrive, Sprout } from 'lucide-react';

// Components
import StatsCard from "../components/dashboard/StatsCard";
import UserManagement from "../components/dashboard/UserManagement";
import OverviewCharts from "../components/dashboard/OverviewCharts";
import RecentActivity from "../components/dashboard/RecentActivity";

// Services
import farmService from '../services/farm.service';
import alertService from '../services/alerts.service';
import deviceService from '../services/device.service';
import apiService from '../services/api.service';
import { ENDPOINTS } from '../utils/api.config';

const Overview = () => {
  const [stats, setStats] = useState({
    farms: 0,
    coops: 0,
    alerts: 0,
    devices: 0,
    farmsChange: 11.02,
    coopsChange: -0.03,
    alertsChange: 15.03,
    devicesChange: 6.08
  });
  
  const [sensorHistory, setSensorHistory] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  
  const [statsLoading, setStatsLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    fetchStatsAndAlerts();
    fetchHistory();
  }, []);

  const fetchStatsAndAlerts = async () => {
    try {
      setStatsLoading(true);
      console.log('[Overview] 🔵 Fetching stats and alerts...');
      
      const [farmsData, alertsData, devicesData] = await Promise.all([
        farmService.getAllFarms().catch(err => {
          console.error('[Overview] Farms fetch failed:', err);
          return [];
        }),
        alertService.getAlerts({ resolved: false }).catch(err => {
          console.error('[Overview] Alerts fetch failed:', err);
          return [];
        }),
        deviceService.getDevices().catch(err => {
          console.error('[Overview] Devices fetch failed:', err);
          return [];
        })
      ]);

      const farmsList = Array.isArray(farmsData) ? farmsData : (farmsData.results || []);
      const coopsCount = farmsList.reduce((acc, farm) => acc + (farm.coops_count || 0), 0);
      const alertsList = Array.isArray(alertsData) ? alertsData : (alertsData.results || []);
      const devicesList = Array.isArray(devicesData) ? devicesData : (devicesData.results || []);

      setStats(prev => ({
        ...prev,
        farms: farmsList.length,
        coops: coopsCount,
        alerts: alertsList.length,
        devices: devicesList.length
      }));

      setRecentAlerts(alertsList.slice(0, 10)); // Get latest 10 alerts
      
      console.log('[Overview] ✅ Stats loaded:', {
        farms: farmsList.length,
        coops: coopsCount,
        alerts: alertsList.length,
        devices: devicesList.length
      });
    } catch (error) {
      console.error("[Overview] ❌ Dashboard stats load failed:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const startTime = performance.now();
      console.log('[Overview] 🔵 Starting sensor history fetch...');
      
      const historyData = await apiService.get(ENDPOINTS.SENSORS.HISTORY).catch(err => {
        console.error('[Overview] History fetch failed:', err);
        return [];
      });
      
      const endTime = performance.now();
      console.log('[Overview] ⏱️ API Response Time:', (endTime - startTime).toFixed(2) + 'ms');
      
      const historyList = Array.isArray(historyData) ? historyData : (historyData.results || []);
      console.log('[Overview] 📊 History records:', historyList.length);
      
      setSensorHistory(historyList);
    } catch (error) {
      console.error("[Overview] ❌ Sensor history load failed:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const statCards = [
    { 
      title: 'Total farms', 
      value: stats.farms.toString(), 
      change: stats.farmsChange,
      icon: Sprout
    },
    { 
      title: 'Active coops', 
      value: stats.coops.toString(), 
      change: stats.coopsChange,
      icon: LayoutDashboard
    },
    { 
      title: 'Active alerts', 
      value: stats.alerts.toString(), 
      change: stats.alertsChange,
      icon: AlertCircle
    },
    { 
      title: 'Connected devices', 
      value: stats.devices.toString(), 
      change: stats.devicesChange,
      icon: HardDrive
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
            <span className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
          
          {/* Stats Grid - Orange Cards */}
          {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div 
                  key={i} 
                  className="h-32 bg-gradient-to-br from-orange-300 to-orange-400 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>
          )}

          {/* Charts & Activity Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Charts Section (2/3 width) */}
            {/* <div className="lg:col-span-2">
              {historyLoading ? (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-[400px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-600 text-sm font-medium">Loading chart data...</span>
                  </div>
                </div>
              ) : (
                <OverviewCharts data={sensorHistory} />
              )}
            </div> */}
            
            {/* Recent Activity Section (1/3 width) */}
            <div className="lg:col-span-1">
              {statsLoading ? (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-[400px] animate-pulse" />
              ) : (
                <RecentActivity activities={recentAlerts} />
              )}
            </div>
          </div>

          {/* User Management Section */}
          <div className="mt-8">
            <UserManagement />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Overview;