import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

const RecentActivity = ({ activities }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Recent Alerts & Logs</h3>
        <button className="text-sm text-orange-500 hover:text-orange-600 font-medium">View All</button>
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm">No recent activity found.</p>
        ) : (
          activities.slice(0, 5).map((alert) => (
            <div key={alert.id} className="flex gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                alert.severity === 'high' ? 'bg-red-100 text-red-600' :
                alert.severity === 'medium' ? 'bg-orange-100 text-orange-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {alert.alert_type}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {alert.coop_name} • {new Date(alert.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                   alert.is_resolved 
                   ? 'bg-green-100 text-green-700' 
                   : 'bg-gray-100 text-gray-600'
                }`}>
                  {alert.is_resolved ? 'Resolved' : 'Active'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;