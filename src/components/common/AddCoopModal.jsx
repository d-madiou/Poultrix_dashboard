import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import farmService from '../../services/farm.service';

const AddCoopModal = ({ onClose, onSuccess, farmId }) => {
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    current_chicken_count: 0 // Default
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.name || !formData.capacity) {
        throw new Error("Please fill all required fields.");
      }

      // Payload: Send 'farm' to satisfy Serializer, and 'farm_id' for custom View logic if needed
      const payload = {
        ...formData,
        farm: farmId, 
        farm_id: farmId
      };

      await farmService.createCoop(payload);
      onSuccess(); 
      onClose();   
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || err.message || "Failed to create coop";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200 overflow-hidden">
        
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Add New Coop</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex gap-2 text-sm items-start">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coop Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Broiler House A"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                placeholder="e.g. 500"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Count
              </label>
              <input
                type="number"
                name="current_chicken_count"
                value={formData.current_chicken_count}
                onChange={handleChange}
                min="0"
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Adding...' : (
                <>
                  <Save className="w-4 h-4" />
                  Add Coop
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCoopModal;