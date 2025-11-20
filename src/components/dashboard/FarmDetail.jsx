import { useEffect, useState } from "react";
import apiService from "../../services/api.service";
import { ENDPOINTS } from "../../utils/api.config";
import CoopCard from "./CoopCard";
import CoopDetail from "./CoopDetail";
import SensorChart from "./SensorChart";

const FarmDetail = ({ farm, onBack }) => {
  const [coops, setCoops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoop, setSelectedCoop] = useState(null);

  useEffect(() => {
    fetchCoops();
  }, [farm]);

  const fetchCoops = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(ENDPOINTS.FARM.COOPS);
      const farmCoops = response.filter(c => c.farm_id === farm.id);
      setCoops(farmCoops);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (selectedCoop) {
    return <CoopDetail coop={selectedCoop} onBack={() => setSelectedCoop(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{farm.name}</h1>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coops.map((coop) => (
            <CoopCard key={coop.id} coop={coop} onClick={() => setSelectedCoop(coop)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmDetail;