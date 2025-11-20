import { useEffect, useState, useMemo } from "react";
import sensorService from "../../services/sensors.service";

const CoopCard = ({ coop, }) => {
  const [sensor, setSensor] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    fetchSensor();
  }, [coop.id]);

  const fetchSensor = async () => {
    try {
      setLoading(true);
      const response = await sensorService.getLocalReadings(coop.id);
      setSensor(response);
    } catch (err) {
      console.error("Failed to fetch sensor data:", err);
    } finally {
      setLoading(false);
    }
  };

  const latest = sensor?.[0];

  const formatVal = (val) => {
    if (val === undefined || val === null) return "—";
    return val.toFixed(2);
  };
  const isNormal = useMemo(() => Math.random() > 0.3, []); 

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 h-48 flex items-center justify-center">
        <span className="text-gray-400 text-sm animate-pulse">Loading data...</span>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-5  cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">{coop.name}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          isNormal ? 'bg-green-700 text-white' : 'bg-red-700 text-white'
        }`}>
          {isNormal ? 'Normal' : 'Alert'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Temperature</p>
          <p className="text-sm font-bold text-green-600">
            {formatVal(latest?.temperature)}°C
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Water level</p>
          <p className="text-sm font-bold text-blue-600">
            {formatVal(latest?.water_level)}%
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Bird count</p>
          <p className="text-sm font-bold text-gray-900">
            {coop.current_chicken_count ?? "0"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-gray-500 mb-1">Humidity</p>
          <p className="font-medium text-green-600">
            {formatVal(latest?.humidity)}%
          </p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">Feed level</p>
          <p className="font-medium text-yellow-600">
             {formatVal(latest?.feed_level)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoopCard;