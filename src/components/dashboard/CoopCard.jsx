// CoopCard.jsx
import { useEffect, useState, useMemo } from "react";
import sensorService from "../../services/sensors.service";

const CoopCard = ({ coop, onClick }) => { // Added onClick prop back
  const [sensorData, setSensorData] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch both endpoints in parallel
        const [liveRes, healthRes] = await Promise.all([
            sensorService.getLiveReadings(),
            sensorService.getHealthChecks()
        ]);

        // 1. Find the sensor reading for THIS specific coop
        const mySensor = liveRes.find(item => item.coop_id === coop.id);
        setSensorData(mySensor || null);

        // 2. Find the health check for THIS specific coop
        const myHealth = healthRes.find(item => item.coop_id === coop.id);
        setHealthData(myHealth || null);

      } catch (err) {
        console.error("Failed to fetch sensor data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [coop.id]);

  const formatVal = (val) => {
    if (val === undefined || val === null) return "—";
    return val.toFixed(2);
  };

  // Determine status based on Real Health API
  const isAlert = healthData?.disease_detected && healthData?.disease_detected !== 'healthy';
  const statusColor = isAlert ? 'bg-red-600' : 'bg-green-600';
  const statusText = isAlert ? 'Alert' : 'Normal';

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 h-48 flex items-center justify-center">
        <span className="text-gray-400 text-sm animate-pulse">Loading live data...</span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">{coop.name}</h3>
        <span className={`px-3 py-1 text-xs font-medium rounded-full text-white ${statusColor}`}>
          {statusText}
        </span>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Avg Temp</p>
          <p className="text-sm font-bold text-green-600">
            {/* NOTE: Backend now sends 'avg_temperature' */}
            {formatVal(sensorData?.avg_temperature)}°C
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Avg Water</p>
          <p className="text-sm font-bold text-blue-600">
             {/* NOTE: Backend now sends 'avg_water_level' */}
            {formatVal(sensorData?.avg_water_level)}%
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Disease</p>
          <p className={`text-sm font-bold ${isAlert ? 'text-red-600' : 'text-gray-900'}`}>
            {healthData?.disease_detected || "None"}
          </p>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-gray-500 mb-1">Avg Humidity</p>
          <p className="font-medium text-green-600">
            {formatVal(sensorData?.avg_humidity)}%
          </p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">Avg Feed</p>
          <p className="font-medium text-yellow-600">
             {formatVal(sensorData?.avg_feed_level)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoopCard;