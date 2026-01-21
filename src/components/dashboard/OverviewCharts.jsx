import React, { useState, useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const OverviewCharts = ({ data }) => {
  const [selectedCoop, setSelectedCoop] = useState('all');
  
  // Debug: Log when data prop changes
  React.useEffect(() => {
    console.log('[OverviewCharts] 📥 Data prop received:', { count: Array.isArray(data) ? data.length : 0, sample: Array.isArray(data) ? data.slice(0, 2) : data });
  }, [data]);

  // 1. Extract unique coop names efficiently
  const coops = useMemo(() => {
    const startTime = performance.now();
    console.log('[OverviewCharts] 🔄 Computing coops from', Array.isArray(data) ? data.length : 0, 'records');
    
    if (!Array.isArray(data) || data.length === 0) {
      console.log('[OverviewCharts] ⏭️ No data to process');
      return [];
    }
    // Get unique coop names, defaulting to 'Unassigned' if missing
    const uniqueNames = new Set(
      data
        .filter(d => d && (d.coop_name || d.coop)) // Validate entries
        .map(d => d.coop_name || d.coop || 'Unassigned')
    );
    const result = Array.from(uniqueNames).sort();
    const endTime = performance.now();
    console.log('[OverviewCharts] ✅ Coops computed:', result, '(' + (endTime - startTime).toFixed(2) + 'ms)');
    return result;
  }, [data]);

  // 2. Filter data based on the selected coop
  const chartData = useMemo(() => {
    const startTime = performance.now();
    console.log('[OverviewCharts] 🔄 Building chart data for coop:', selectedCoop);
    
    if (!Array.isArray(data) || data.length === 0) {
      console.log('[OverviewCharts] ⏭️ No data for chart');
      return [];
    }

    let filtered = data;
    if (selectedCoop !== 'all') {
      filtered = data.filter(d => 
        d && (d.coop_name || d.coop || 'Unassigned') === selectedCoop
      );
      console.log('[OverviewCharts] 🔽 Filtered to', filtered.length, 'records for coop:', selectedCoop);
    } else {
      console.log('[OverviewCharts] 📌 Using all', filtered.length, 'records');
    }

    // OPTIMIZATION: 
    // Assuming backend sends data sorted by -timestamp (Newest -> Oldest).
    // We take the first 20 items (Newest), THEN reverse them to get (Oldest -> Newest) for the chart.
    // This avoids cloning/reversing the entire massive array.
    return filtered
      .filter(reading => reading && reading.timestamp) // Validate before mapping
      .slice(0, 20)
      .reverse()
      .map(reading => {
        const tempValue = parseFloat(reading.temperature || reading.temp || 0);
        const humidityValue = parseFloat(reading.humidity || reading.hum || 0);
        
        return {
          time: new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temp: isNaN(tempValue) ? 0 : tempValue,
          humidity: isNaN(humidityValue) ? 0 : humidityValue,
          coop: reading.coop_name || reading.coop || 'Unassigned'
        };
      });
  }, [data, selectedCoop]);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h3 className="text-lg font-bold text-gray-900">Environmental Trends</h3>
        
        {/* Dynamic Coop Selector */}
        <select 
          value={selectedCoop}
          onChange={(e) => setSelectedCoop(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-gray-50 text-gray-700 cursor-pointer"
        >
          <option value="all">All Coops</option>
          {coops.map(coop => (
            <option key={coop} value={coop}>{coop}</option>
          ))}
        </select>
      </div>
      
      <div className="h-[300px] w-full flex-1 min-h-0">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                itemStyle={{ fontSize: '12px' }}
                labelStyle={{ fontWeight: 'bold', color: '#111827' }}
              />
              <Area 
                type="monotone" 
                dataKey="temp" 
                stroke="#f97316" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorTemp)" 
                name="Temperature (°C)"
              />
              <Area 
                type="monotone" 
                dataKey="humidity" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorHum)" 
                name="Humidity (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
            <p>No sensor data available for visualization.</p>
            {selectedCoop !== 'all' && <p className="text-xs mt-1">Try selecting a different coop.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewCharts;