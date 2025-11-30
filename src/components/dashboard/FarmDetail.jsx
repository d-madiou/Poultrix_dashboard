import { useEffect, useState } from "react";
import apiService from "../../services/api.service";
import { ENDPOINTS } from "../../utils/api.config";
import CoopCard from "./CoopCard";
import CoopDetail from "./CoopDetail";
import AddCoopModal from "../common/AddCoopModal"; 

const FarmDetail = ({ farm, onBack }) => {
  const [coops, setCoops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoop, setSelectedCoop] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchCoops();
  }, [farm]);

  const fetchCoops = async () => {
    try {
      setLoading(true);
      // Fetch all coops (or filter client side if endpoint returns all)
      const response = await apiService.get(ENDPOINTS.FARM.COOPS);
      // Ensure response is an array before filtering
      const allCoops = Array.isArray(response) ? response : (response.results || []);
      const farmCoops = allCoops.filter(c => c.farm_id === farm.id);
      setCoops(farmCoops);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCoopAdded = () => {
    setShowAddModal(false);
    fetchCoops(); // Refresh list
  };

  if (selectedCoop) {
    return <CoopDetail coop={selectedCoop} onBack={() => setSelectedCoop(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{farm.name}</h1>
            <p className="text-sm text-gray-500">Location: {farm.location}</p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Coop
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span className="text-gray-500">Loading coops...</span>
        </div>
      ) : coops.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500 mb-4">No coops found for this farm.</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            Create your first coop
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coops.map((coop) => (
            <CoopCard key={coop.id} coop={coop} onClick={() => setSelectedCoop(coop)} />
          ))}
        </div>
      )}

      {showAddModal && (
        <AddCoopModal 
          onClose={() => setShowAddModal(false)} 
          onSuccess={handleCoopAdded}
          farmId={farm.id} // Pass farm ID so admin can assign correctly
        />
      )}
    </div>
  );
};

export default FarmDetail;