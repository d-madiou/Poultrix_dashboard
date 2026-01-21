import React, { useState, useEffect } from 'react';
import { X, Filter, RefreshCcw, CheckCircle, Clock, Trash2, CheckSquare } from 'lucide-react';
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

  const handleRemoveAll = async () => {
    if (!window.confirm("Are you sure you want to permanently delete all displayed alerts? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    try {
      const deletePromises = alerts.map(alert => alertService.deleteAlert(alert.id));
      await Promise.all(deletePromises);
      
      setAlerts([]);
      if (selectedAlert) setSelectedAlert(null);
      
    } catch (error) {
      console.error("Failed to delete all alerts", error);
      alert("Failed to delete some alerts. Please try again.");
      fetchAlerts();
    } finally {
      setLoading(false);
    }
  };

  const handleResolveAll = async () => {
    const unresolvedAlerts = alerts.filter(a => !a.is_resolved);

    if (unresolvedAlerts.length === 0) return;

    if (!window.confirm(`Are you sure you want to mark ${unresolvedAlerts.length} alerts as resolved?`)) {
      return;
    }

    setLoading(true);
    try {
      const resolvePromises = unresolvedAlerts.map(alert => alertService.resolveAlert(alert.id));
      await Promise.all(resolvePromises);
      
      setAlerts(prev => prev.map(a => ({ ...a, is_resolved: true, status: 'Resolved' })));
      
      if (filterMode === 'active') {
         setTimeout(() => {
             setAlerts([]);
         }, 500);
      }
      
    } catch (error) {
      console.error("Failed to resolve all alerts", error);
      alert("Failed to resolve some alerts. Please try again.");
      fetchAlerts();
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Critical': return 'text-white bg-red-500';
      case 'Medium': return 'text-orange-700 bg-orange-100 border border-orange-200';
      case 'Warning': return 'text-yellow-700 bg-yellow-100 border border-yellow-200';
      case 'Resolved': return 'text-white bg-green-500';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-600 font-medium">Loading alerts...</p>
      </div>
    );
  }

  const activeAlertCount = alerts.filter(a => !a.is_resolved).length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Alerts & Logs</h1>
            <p className="text-sm text-gray-500">Real-time anomaly detection from sensors</p>
        </div>
        
        <div className="flex gap-2">
           {activeAlertCount > 0 && (
             <button 
               onClick={handleResolveAll}
               className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
               title="Mark All As Resolved"
             >
               <CheckSquare className="w-4 h-4" />
               <span className="text-sm font-medium hidden sm:inline">Resolve All</span>
             </button>
           )}

           {alerts.length > 0 && (
             <button 
               onClick={handleRemoveAll}
               className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
               title="Delete All Alerts"
             >
               <Trash2 className="w-4 h-4" />
               <span className="text-sm font-medium hidden sm:inline">Clear All</span>
             </button>
           )}

           <button 
             onClick={fetchAlerts}
             className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
             title="Refresh"
           >
             <RefreshCcw className="w-5 h-5" />
           </button>
           
           <div className="relative">
             <select 
               className="appearance-none pl-9 pr-8 py-2 border border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700 hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
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
              <tr className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-50/50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date & time
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Coop
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {alerts.length === 0 ? (
                  <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <div className="bg-green-50 p-4 rounded-full mb-3">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <p className="font-semibold text-gray-900 text-lg">All systems normal</p>
                            <p className="text-sm text-gray-500 mt-1">No {filterMode === 'active' ? 'active' : ''} alerts found.</p>
                          </div>
                      </td>
                  </tr>
              ) : (
                  alerts.map((alert) => (
                    <tr
                      key={alert.id}
                      onClick={() => setSelectedAlert(alert)}
                      className={`hover:bg-orange-50/50 cursor-pointer transition-colors ${alert.is_resolved ? 'opacity-60 bg-gray-50/50' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(alert.created_at).toLocaleString('en-US', {
                          month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {alert.coop_name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {alert.alert_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">{alert.current_value}</span> {alert.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(alert.status)}`}>
                          {alert.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {!alert.is_resolved ? (
                          <button
                            onClick={(e) => handleResolve(alert.id, e)}
                            className="px-4 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm"
                          >
                            Resolve
                          </button>
                        ) : (
                            <span className="flex items-center gap-1.5 text-green-600 text-xs font-semibold px-3 py-1">
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
          stroke={alert.severity === 'high' ? "#ef4444" : "#f97316"}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="65" cy="10" r="4" fill={alert.severity === 'high' ? "#ef4444" : "#f97316"} />
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
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${
                      alert.severity === 'high' ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'
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

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 mb-6 text-center border border-orange-200">
            <div className="flex justify-center mb-3">
              {getTrendIcon()}
            </div>
            <div className="text-5xl font-bold text-gray-900 mb-1 tracking-tight">
              {alert.current_value}<span className="text-2xl text-orange-500 font-medium ml-1">{alert.unit}</span>
            </div>
            <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">
              Detected Level
            </p>
          </div>

          <div className="space-y-6">
            {alert.message && (
                <div>
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
                      Analysis
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed bg-blue-50 p-4 rounded-lg border border-blue-100">
                        {alert.message}
                    </p>
                </div>
            )}

            {alert.impact && (
                <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
                  Potential Impact
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">{alert.impact}</p>
                </div>
            )}

            {alert.recommendations && alert.recommendations.length > 0 && (
                <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
                  Recommended Actions
                </h3>
                <ul className="space-y-2">
                    {alert.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-bold mt-0.5">
                            {index + 1}
                        </span>
                        <span className="leading-relaxed">{rec}</span>
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
              className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl active:transform active:scale-[0.98] flex items-center justify-center gap-2"
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