import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Sprout, 
  Monitor, 
  AlertTriangle, 
  BarChart3, 
  Settings,
  Search,
  Sun,
  RotateCcw,
  Bell,
  Menu
} from 'lucide-react';

const UserManagement = () => {
  // Hardcoded users data
  const users = [
    { id: 1, name: 'Ahmed Salem', email: 'ahmed@poultrix.com', role: 'Admin', farms: 5, status: 'Active' },
    { id: 2, name: 'Ahmed Salem', email: 'ahmed@poultrix.com', role: 'Admin', farms: 5, status: 'Active' },
    { id: 3, name: 'Ahmed Salem', email: 'ahmed@poultrix.com', role: 'Admin', farms: 5, status: 'Active' },
    { id: 4, name: 'Ahmed Salem', email: 'ahmed@poultrix.com', role: 'Admin', farms: 5, status: 'Active' },
    { id: 5, name: 'Ahmed Salem', email: 'ahmed@poultrix.com', role: 'Admin', farms: 5, status: 'Active' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-orange-500">User Management</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Farms
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {user.farms}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;