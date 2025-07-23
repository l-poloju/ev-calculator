import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const ComparisonChart = ({ presetVehicles, currentVehicle }) => {
  const comparisonData = useMemo(() => {
    const calculateMetrics = (vehicle) => {
      const { batteryCapacity, motorPower, weight, dragCoefficient, frontalArea, efficiency, maxSpeed, acceleration } = vehicle;
      
      // Range calculation (simplified but more realistic)
      const speed = 80; // km/h reference speed
      const speedMs = speed / 3.6; // convert to m/s
      const dragForce = 0.5 * 1.225 * dragCoefficient * frontalArea * Math.pow(speedMs, 2); // N
      const rollingForce = weight * 9.81 * 0.01; // N (assuming rolling resistance coefficient of 0.01)
      const totalForce = dragForce + rollingForce; // N
      const powerRequired = totalForce * speedMs / 1000; // kW
      const energyConsumption = powerRequired / (efficiency / 100); // kW accounting for efficiency
      const range = (batteryCapacity / energyConsumption) * speed; // km
      
      // Power-to-weight ratio
      const powerToWeight = motorPower / weight * 1000;
      
      // Energy efficiency
      const energyEfficiency = batteryCapacity / range * 100;
      
      return {
        range: Math.round(range),
        powerToWeight: Math.round(powerToWeight),
        energyEfficiency: Math.round(energyEfficiency),
        topSpeed: maxSpeed,
        acceleration: acceleration,
      };
    };

    const vehicles = [
      { ...presetVehicles.regular, ...calculateMetrics(presetVehicles.regular) },
      { ...presetVehicles.sport, ...calculateMetrics(presetVehicles.sport) },
      { ...presetVehicles.suv, ...calculateMetrics(presetVehicles.suv) },
      { ...currentVehicle, ...calculateMetrics(currentVehicle) }
    ];

    return [
      {
        metric: 'Range (km)',
        [presetVehicles.regular.name]: vehicles[0].range,
        [presetVehicles.sport.name]: vehicles[1].range,
        [presetVehicles.suv.name]: vehicles[2].range,
        [currentVehicle.name]: vehicles[3].range,
      },
      {
        metric: 'Power/Weight (W/kg)',
        [presetVehicles.regular.name]: vehicles[0].powerToWeight,
        [presetVehicles.sport.name]: vehicles[1].powerToWeight,
        [presetVehicles.suv.name]: vehicles[2].powerToWeight,
        [currentVehicle.name]: vehicles[3].powerToWeight,
      },
      {
        metric: 'Top Speed (km/h)',
        [presetVehicles.regular.name]: vehicles[0].topSpeed,
        [presetVehicles.sport.name]: vehicles[1].topSpeed,
        [presetVehicles.suv.name]: vehicles[2].topSpeed,
        [currentVehicle.name]: vehicles[3].topSpeed,
      },
      {
        metric: 'Acceleration (s)',
        [presetVehicles.regular.name]: vehicles[0].acceleration,
        [presetVehicles.sport.name]: vehicles[1].acceleration,
        [presetVehicles.suv.name]: vehicles[2].acceleration,
        [currentVehicle.name]: vehicles[3].acceleration,
        inverted: true, // Lower is better for acceleration
      },
      {
        metric: 'Energy Eff. (Wh/km)',
        [presetVehicles.regular.name]: vehicles[0].energyEfficiency,
        [presetVehicles.sport.name]: vehicles[1].energyEfficiency,
        [presetVehicles.suv.name]: vehicles[2].energyEfficiency,
        [currentVehicle.name]: vehicles[3].energyEfficiency,
        inverted: true, // Lower is better for energy efficiency
      }
    ];
  }, [presetVehicles, currentVehicle]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const vehicleColors = {
    [presetVehicles.regular.name]: '#6b7280', // Gray for regular
    [presetVehicles.sport.name]: '#dc2626', // Red for sport
    [presetVehicles.suv.name]: '#059669', // Green for SUV
    [currentVehicle.name]: '#009682', // Primary green for custom
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Vehicle Performance Comparison
          </CardTitle>
          <p className="text-sm text-gray-600">
            Side-by-side comparison of key performance metrics across different vehicle types
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="metric" 
                  tick={{ fontSize: 12, fill: '#666' }}
                  axisLine={{ stroke: '#d1d5db' }}
                  tickLine={{ stroke: '#d1d5db' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#666' }}
                  axisLine={{ stroke: '#d1d5db' }}
                  tickLine={{ stroke: '#d1d5db' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Bar 
                  dataKey={presetVehicles.regular.name} 
                  fill={vehicleColors[presetVehicles.regular.name]}
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey={presetVehicles.sport.name} 
                  fill={vehicleColors[presetVehicles.sport.name]}
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey={presetVehicles.suv.name} 
                  fill={vehicleColors[presetVehicles.suv.name]}
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey={currentVehicle.name} 
                  fill={vehicleColors[currentVehicle.name]}
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-lg font-bold text-green-700">Best Range</div>
              <div className="text-sm text-green-600">
                {comparisonData[0] && Object.entries(comparisonData[0])
                  .filter(([key]) => key !== 'metric')
                  .reduce((max, [key, value]) => value > max.value ? { key, value } : max, { key: '', value: 0 }).key}
              </div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-lg font-bold text-blue-700">Best Power/Weight</div>
              <div className="text-sm text-blue-600">
                {comparisonData[1] && Object.entries(comparisonData[1])
                  .filter(([key]) => key !== 'metric')
                  .reduce((max, [key, value]) => value > max.value ? { key, value } : max, { key: '', value: 0 }).key}
              </div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-lg font-bold text-purple-700">Fastest</div>
              <div className="text-sm text-purple-600">
                {comparisonData[2] && Object.entries(comparisonData[2])
                  .filter(([key]) => key !== 'metric')
                  .reduce((max, [key, value]) => value > max.value ? { key, value } : max, { key: '', value: 0 }).key}
              </div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-lg font-bold text-orange-700">Most Efficient</div>
              <div className="text-sm text-orange-600">
                {comparisonData[4] && Object.entries(comparisonData[4])
                  .filter(([key]) => key !== 'metric' && key !== 'inverted')
                  .reduce((min, [key, value]) => value < min.value ? { key, value } : min, { key: '', value: Infinity }).key}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonChart;

