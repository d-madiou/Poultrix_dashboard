// CoopDetail.jsx
import { useEffect, useState } from "react";
import sensorService from "../../services/sensors.service";
import SensorChart from "./SensorChart";

const CoopDetail = ({ coop, onBack }) => {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch the historical list (webhook endpoint)
        const allData = await sensorService.getHistoricalReadings();
        
        // 2. Filter for this coop manually since backend returns all
        // Note: Ensure your serializer returns 'coop_name' or 'coop' (id)
        const coopReadings = allData.filter(r => 
            r.coop === coop.id || r.coop_name === coop.name // Adjust based on exact serializer output
        );
        
        setReadings(coopReadings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [coop.id, coop.name]);

  // 3. Map data (Historical endpoint still uses 'temperature', not 'avg_temperature')
  const chartData = {
    temperature: readings.map(r => r.temperature).reverse(),
    humidity: readings.map(r => r.humidity).reverse(),
    water: readings.map(r => r.water_level).reverse(),
    feed: readings.map(r => r.feed_level).reverse(),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack} 
          className="p-2 hover:bg-white bg-white/50 border border-gray-200 rounded-lg transition shadow-sm"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
            <h1 className="text-2xl font-bold text-gray-900">{coop.name}</h1>
            <p className="text-sm text-gray-500">Historical Analytics</p>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SensorChart 
            title="Temperature History" 
            data={chartData.temperature} 
            label="°C" 
            color="orange" 
          />
          <SensorChart 
            title="Humidity History" 
            data={chartData.humidity} 
            label="%" 
            color="green" 
          />
          <SensorChart 
            title="Water Level History" 
            data={chartData.water} 
            label="%" 
            color="blue" 
          />
          <SensorChart 
            title="Feed Level History" 
            data={chartData.feed} 
            label="%" 
            color="yellow" 
          />
        </div>
      )}
    </div>
  );
};

export default CoopDetail;