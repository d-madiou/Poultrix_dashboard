import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, RefreshCcw } from 'lucide-react';
import alertService from '../services/alerts.service';

const AlertsAndLogs = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const params = filter === 'active' ? { resolved: false } : {};
      const data = await alertService.getAlerts(params);
      setAlerts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [filter]);

  const handleResolve = async (id) => {
    try {
      await alertService.resolveAlert(id);
      if (filter === 'active') {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
      } else {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_resolved: true } : a));
      }
    } catch (error) {
      console.error("Failed to resolve alert", error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Alerts & Logs</h1>
          <p className="text-sm text-gray-500">Monitor system anomalies and health risks</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={fetchAlerts}
             className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200"
             title="Refresh Alerts"
           >
             <RefreshCcw className="w-5 h-5" />
           </button>
           <select 
             className="p-2 border border-gray-200 rounded-lg bg-white text-sm"
             value={filter}
             onChange={(e) => setFilter(e.target.value)}
           >
             <option value="active">Active Issues</option>
             <option value="all">All History</option>
           </select>
        </div>
      </div>

      {loading ? (
         <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-500">Loading alerts...</p>
         </div>
      ) : alerts.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">All systems normal</h3>
          <p className="text-gray-500">No active alerts found for your farm.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 transition-all ${alert.is_resolved ? 'opacity-60' : ''}`}
            >
              <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center ${
                alert.is_resolved ? 'bg-gray-100 text-gray-400' : 'bg-red-50 text-red-500'
              }`}>
                {alert.is_resolved ? <CheckCircle className="w-6 h-6"/> : <AlertTriangle className="w-6 h-6" />}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${getSeverityColor(alert.severity)}`}>
                    {alert.severity ? alert.severity.toUpperCase() : 'UNKNOWN'}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(alert.created_at).toLocaleString()}
                  </span>
                  <span className="text-xs font-medium text-gray-600">• {alert.coop_name}</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900">{alert.alert_type}</h3>
                <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
              </div>

              {!alert.is_resolved && (
                <div className="flex items-center">
                  <button 
                    onClick={() => handleResolve(alert.id)}
                    className="whitespace-nowrap px-4 py-2 bg-white border border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                  >
                    Mark Resolved
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsAndLogs;