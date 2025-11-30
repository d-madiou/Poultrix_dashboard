import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import farmService from '../../services/farm.service';
import userService from '../../services/user.service';

const AddFarmModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    total_capacity: '',
    farmer_id: '' // Required for Admins only
  });

  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Get logged-in user role from LocalStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.role === 'admin';

  // 2. Fetch farmer list only if user is Admin
  useEffect(() => {
    if (isAdmin) {
      fetchFarmers();
    }
  }, [isAdmin]);

  const fetchFarmers = async () => {
    try {
      const data = await userService.getFarmers();
      setFarmers(data);
    } catch (err) {
      console.error("Failed to fetch farmers:", err);
      setError("Unable to load farmers list. Please try again.");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Basic validation
      if (!formData.name || !formData.location || !formData.total_capacity) {
        throw new Error("Please fill all required fields.");
      }

      // Admin specific validation: Must select a farmer
      if (isAdmin && !formData.farmer_id) {
        throw new Error("Please select a farmer to own this farm.");
      }

      // Prepare payload
      const payload = { ...formData };
      
      // If NOT admin, remove farmer_id so backend uses request.user
      if (!isAdmin) {
        delete payload.farmer_id;
      }

      await farmService.createFarm(payload);

      onSuccess(); // Refresh the list
      onClose();   // Close modal
    } catch (err) {
      const msg =
        err.response?.data?.farmer_id?.[0] ||
        err.response?.data?.detail ||
        err.message ||
        "Failed to create farm";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            {isAdmin ? "Provision New Farm" : "Register Your Farm"}
          </h2>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Error Box */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex gap-2 text-sm items-start">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Admin Only: Farmer Selection Dropdown */}
          {isAdmin && (
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
              <label className="block text-sm font-medium text-blue-900 mb-1">
                Assign Owner (Farmer) <span className="text-red-500">*</span>
              </label>
              <select
                name="farmer_id"
                value={formData.farmer_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none"
              >
                <option value="">-- Select Farmer --</option>
                {farmers.map(farmer => (
                  <option key={farmer.id} value={farmer.id}>
                    {farmer.first_name} {farmer.last_name} ({farmer.email})
                  </option>
                ))}
              </select>
              <p className="text-xs text-blue-700 mt-1">
                The selected farmer will be the legal owner of this farm.
              </p>
            </div>
          )}

          {/* Farm Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Farm Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sunrise Poultry Farm"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Kaduna, Nigeria"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            />
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Capacity (Birds) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="total_capacity"
              value={formData.total_capacity}
              onChange={handleChange}
              min="1"
              placeholder="e.g. 3000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex gap-3">
            <button
              onClick={onClose}
              type="button"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isAdmin ? "Provision Farm" : "Create Farm"}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddFarmModal;