import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Filter, RefreshCcw, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import alertService from '../services/alerts.service';

const AlertsAndLogs = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  
  const [filterMode, setFilterMode] = useState('active');

  const processAlertData = (apiAlert) => {
    let statusLabel = 'Medium';
    if (apiAlert.is_resolved) statusLabel = 'Resolved';
    else if (apiAlert.severity === 'high') statusLabel = 'Critical';
    else if (apiAlert.severity === 'low') statusLabel = 'Warning';

    const valueMatch = apiAlert.message ? apiAlert.message.match(/(\d+(\.\d+)?)/) : null;
    const extractedValue = valueMatch ? valueMatch[0] : '--';
    
    let unit = '';
    const typeLower = (apiAlert.alert_type || '').toLowerCase();
    if (typeLower.includes('temp')) unit = '°C';
    else if (typeLower.includes('hum')) unit = '%';
    else if (typeLower.includes('water') || typeLower.includes('feed')) unit = '%';
    else if (typeLower.includes('co2')) unit = 'ppm';

    let impact = 'System anomaly detected.';
    let recommendations = ['Check sensor calibration', 'Inspect coop conditions'];

    if (typeLower.includes('temp')) {
        impact = 'Possible heat stress and reduced feed intake.';
        recommendations = ['Check ventilation fans', 'Ensure water availability', 'Open vents if safe'];
    } else if (typeLower.includes('water')) {
        impact = 'Dehydration risk for flock.';
        recommendations = ['Check main water tank', 'Inspect pipes for leaks', 'Verify sensor position'];
    } else if (typeLower.includes('feed')) {
        impact = 'Birds may experience hunger and stress.';
        recommendations = ['Refill feed bins', 'Check auger motor', 'Verify delivery schedule'];
    } else if (typeLower.includes('hum')) {
        impact = 'Increased risk of respiratory issues.';
        recommendations = ['Improve ventilation', 'Check for water leaks'];
    }

    return {
      ...apiAlert,
      farm_name: apiAlert.farm_name || 'My Farm', 
      status: statusLabel,
      current_value: extractedValue,
      unit: unit,
      impact: impact,
      recommendations: recommendations,
      duration: 'Just now',
    };
  };

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterMode === 'active') {
        params.resolved = false;
      }

      const data = await alertService.getAlerts(params);
      
      const rawData = Array.isArray(data) ? data : (data.results || []);
      const processed = rawData.map(processAlertData);
      setAlerts(processed);
    } catch (error) {
      console.error(error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [filterMode]);

  const handleResolve = async (id, e) => {
    if(e) e.stopPropagation();
    try {
      await alertService.resolveAlert(id);
      
      setAlerts(prev => prev.map(a => 
         a.id === id ? { ...a, is_resolved: true, status: 'Resolved' } : a
      ));
      
  
      if (selectedAlert?.id === id) {
        setSelectedAlert(null);
      }
  
      if (filterMode === 'active') {
         setTimeout(() => {
             setAlerts(prev => prev.filter(a => a.id !== id));
         }, 500);
      }

    } catch (error) {
      console.error("Failed to resolve alert", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Critical': return 'text-white bg-red-700';
      case 'Medium': return 'text-white bg-orange-700';
      case 'Warning': return 'text-yellow-600 bg-yellow-50';
      case 'Resolved': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-gray-500">Loading alerts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Alerts & Logs</h1>
            <p className="text-sm text-gray-500">Real-time anomaly detection from the sensors</p>
        </div>
        
        {/* Filter Controls */}
        <div className="flex gap-2">
           <button 
             onClick={fetchAlerts}
             className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
             title="Refresh"
           >
             <RefreshCcw className="w-5 h-5" />
           </button>
           
           <div className="relative">
             <select 
               className="appearance-none pl-9 pr-8 py-2 border border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
               value={filterMode}
               onChange={(e) => setFilterMode(e.target.value)}
             >
               <option value="active">Active Issues</option>
               <option value="all">All History</option>
             </select>
             <Filter className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
           </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coop
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {alerts.length === 0 ? (
                  <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <div className="bg-green-50 p-3 rounded-full mb-3">
                                <CheckCircle className="w-6 h-6 text-green-500" />
                            </div>
                            <p className="font-medium text-gray-900">All systems normal</p>
                            <p className="text-sm text-gray-500">No {filterMode === 'active' ? 'active' : ''} alerts found.</p>
                          </div>
                      </td>
                  </tr>
              ) : (
                  alerts.map((alert) => (
                    <tr
                      key={alert.id}
                      onClick={() => setSelectedAlert(alert)}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${alert.is_resolved ? 'opacity-60 bg-gray-50/50' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(alert.created_at).toLocaleString('en-US', {
                          month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {alert.coop_name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {alert.alert_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {alert.current_value} {alert.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                          {alert.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {!alert.is_resolved ? (
                          <button
                            onClick={(e) => handleResolve(alert.id, e)}
                            className="px-3 py-1 text-xs font-medium text-green-700 bg-white border border-green-700 hover:bg-green-50 rounded-md transition-colors shadow-sm"
                          >
                            Resolve
                          </button>
                        ) : (
                            <span className="flex items-center gap-1.5 text-green-600 text-xs font-medium px-3 py-1">
                                <CheckCircle className="w-3.5 h-3.5" /> Resolved
                            </span>
                        )}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAlert && (
        <AlertDetailModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onResolve={(id) => handleResolve(id)}
        />
      )}
    </div>
  );
};

const AlertDetailModal = ({ alert, onClose, onResolve }) => {
  const getTrendIcon = () => {
    return (
      <svg width="80" height="40" viewBox="0 0 80 40" className="mb-2 opacity-60">
        <path
          d="M 5,30 Q 15,35 25,25 T 45,20 T 65,10"
          fill="none"
          stroke={alert.severity === 'high' ? "#ef4444" : "#f59e0b"}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="65" cy="10" r="4" fill={alert.severity === 'high' ? "#ef4444" : "#f59e0b"} />
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {alert.coop_name}
              </h2>
              <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${
                      alert.severity === 'high' ? 'bg-red-700 text-white' : 'bg-orange-500 text-white'
                  }`}>
                    {alert.alert_type}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1 ml-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(alert.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-center border border-gray-100">
            <div className="flex justify-center mb-3">
              {getTrendIcon()}
            </div>
            <div className="text-5xl font-bold text-gray-900 mb-1 tracking-tight">
              {alert.current_value}<span className="text-2xl text-gray-400 font-medium ml-1">{alert.unit}</span>
            </div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
              Detected Level
            </p>
          </div>

          <div className="space-y-6">
            {alert.message && (
                <div>
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Analysis</h3>
                    <p className="text-gray-600 text-sm leading-relaxed bg-blue-50/50 p-3 rounded-lg border border-blue-50">
                        {alert.message}
                    </p>
                </div>
            )}

            {alert.impact && (
                <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Potential Impact</h3>
                <p className="text-gray-600 text-sm">{alert.impact}</p>
                </div>
            )}

            {alert.recommendations && alert.recommendations.length > 0 && (
                <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Recommended Actions</h3>
                <ul className="space-y-2">
                    {alert.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-xs font-bold mt-0.5">
                            {index + 1}
                        </span>
                        <span className="leading-snug">{rec}</span>
                    </li>
                    ))}
                </ul>
                </div>
            )}
          </div>

          {!alert.is_resolved && (
            <button
              onClick={() => {
                onResolve(alert.id);
              }}
              className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-sm active:transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Mark Issue as Resolved
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsAndLogs;