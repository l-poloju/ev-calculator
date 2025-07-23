import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const PerformanceChart = ({ data }) => {
  const chartData = [
    {
      name: 'Range',
      value: data.range || 0,
      unit: 'km',
      color: '#009682', // Green for good performance
      category: 'Efficiency'
    },
    {
      name: 'Power/Weight',
      value: data.powerToWeight || 0,
      unit: 'W/kg',
      color: '#4664aa', // Blue for power metrics
      category: 'Power'
    },
    {
      name: 'Energy Eff.',
      value: data.energyEfficiency || 0,
      unit: 'Wh/km',
      color: '#df9b1b', // Orange for efficiency metrics
      category: 'Efficiency'
    },
    {
      name: 'Torque',
      value: data.estimatedTorque || 0,
      unit: 'Nm',
      color: '#4664aa', // Blue for power metrics
      category: 'Power'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{`${label}`}</p>
          <p className="text-sm text-gray-600">{`Category: ${data.category}`}</p>
          <p className="text-lg font-bold" style={{ color: data.color }}>
            {`${data.value} ${data.unit}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomYAxisTick = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" fontSize="12">
          {payload.value}
        </text>
      </g>
    );
  };

  const CustomXAxisTick = ({ x, y, payload }) => {
    const data = chartData.find(item => item.name === payload.value);
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize="12">
          {payload.value}
        </text>
        {data && (
          <text x={0} y={0} dy={32} textAnchor="middle" fill="#999" fontSize="10">
            ({data.unit})
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            tick={<CustomXAxisTick />}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
          />
          <YAxis 
            tick={<CustomYAxisTick />}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
            label={{ 
              value: 'Performance Values', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fill: '#666', fontSize: '12px' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex justify-center mt-4 space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#009682' }}></div>
          <span className="text-sm text-gray-600">Efficiency Metrics</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#4664aa' }}></div>
          <span className="text-sm text-gray-600">Power Metrics</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#df9b1b' }}></div>
          <span className="text-sm text-gray-600">Energy Metrics</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;

