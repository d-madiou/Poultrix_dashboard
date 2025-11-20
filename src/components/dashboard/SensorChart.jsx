import React, { useMemo } from 'react';

const SensorChart = ({ title, data = [], label, color = 'blue' }) => {
  const theme = {
    orange: { stroke: '#f97316', fillStart: '#f97316', fillEnd: '#fff7ed', text: 'text-orange-600', bg: 'bg-orange-50' },
    blue:   { stroke: '#3b82f6', fillStart: '#3b82f6', fillEnd: '#eff6ff', text: 'text-blue-600',   bg: 'bg-blue-50' },
    green:  { stroke: '#10b981', fillStart: '#10b981', fillEnd: '#ecfdf5', text: 'text-green-600',  bg: 'bg-green-50' },
    yellow: { stroke: '#eab308', fillStart: '#eab308', fillEnd: '#fefce8', text: 'text-yellow-600', bg: 'bg-yellow-50' },
  }[color] || theme.blue;

  const { points, fillPath, latestValue, avgValue, min, max } = useMemo(() => {
    if (!data || data.length === 0) return { points: "", fillPath: "", latestValue: 0, avgValue: 0, min: 0, max: 0 };

    const maxVal = Math.max(...data) * 1.05;
    const minVal = Math.min(...data) * 0.95;
    const range = maxVal - minVal || 1;
    
    const width = 400;
    const height = 150;

    const coords = data.map((val, i) => {
      const x = (i / (data.length - 1 || 1)) * width;
      const y = height - ((val - minVal) / range) * height; 
      return [x, y];
    });

    const pointsStr = coords.map(p => `${p[0]},${p[1]}`).join(' ');

    const fillPathStr = `
      M ${coords[0][0]},${height} 
      L ${coords[0][0]},${coords[0][1]} 
      ${coords.map(p => `L ${p[0]},${p[1]}`).join(' ')} 
      L ${coords[coords.length - 1][0]},${height} 
      Z
    `;

    return {
      points: pointsStr,
      fillPath: fillPathStr,
      latestValue: data[data.length - 1],
      avgValue: (data.reduce((a, b) => a + b, 0) / data.length).toFixed(1),
      min: minVal,
      max: maxVal
    };
  }, [data]);

  if (!data.length) return <div className="p-6 text-gray-400 bg-white rounded-xl border border-gray-200">No Data for {title}</div>;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
      <div className="flex justify-between items-end mb-6">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-1">
            <h2 className="text-3xl font-bold text-gray-900">{latestValue?.toFixed(1)}</h2>
            <span className="text-sm text-gray-500 font-medium">{label}</span>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-lg text-xs font-bold ${theme.bg} ${theme.text}`}>
          Avg {avgValue}
        </div>
      </div>

      <div className="relative h-32 w-full">
        <div className="absolute left-0 top-0 text-[10px] text-gray-300 font-mono">{max.toFixed(0)}</div>
        <div className="absolute left-0 bottom-0 text-[10px] text-gray-300 font-mono">{min.toFixed(0)}</div>

        <svg 
          className="w-full h-full overflow-visible" 
          viewBox="0 0 400 150" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.fillStart} stopOpacity="0.2" />
              <stop offset="100%" stopColor={theme.fillEnd} stopOpacity="0" />
            </linearGradient>
          </defs>

          <path 
            d={fillPath} 
            fill={`url(#gradient-${color})`} 
          />

          <polyline
            fill="none"
            stroke={theme.stroke}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            vectorEffect="non-scaling-stroke" 
          />

          {points && (
            <g>
              <circle cx={points.split(' ').pop().split(',')[0]} cy={points.split(' ').pop().split(',')[1]} r="6" fill={theme.stroke} fillOpacity="0.3">
                <animate attributeName="r" from="4" to="12" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx={points.split(' ').pop().split(',')[0]} cy={points.split(' ').pop().split(',')[1]} r="3" fill={theme.stroke} />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export default SensorChart;