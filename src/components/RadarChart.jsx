import React, { useMemo, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Sliders, RotateCcw } from 'lucide-react';

const RadarChartComponent = ({ presetVehicles, currentVehicle }) => {
  // State for metric weights (1-5 scale, 3 is neutral)
  const [metricWeights, setMetricWeights] = useState({
    range: 3,
    power: 3,
    speed: 3,
    efficiency: 3,
    energyEff: 3,
    acceleration: 3
  });

  const [showWeightControls, setShowWeightControls] = useState(false);

  const resetWeights = () => {
    setMetricWeights({
      range: 3,
      power: 3,
      speed: 3,
      efficiency: 3,
      energyEff: 3,
      acceleration: 3
    });
  };

  const radarData = useMemo(() => {
    const calculateNormalizedMetrics = (vehicle) => {
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
      
      const powerToWeight = motorPower / weight * 1000;
      const energyEfficiency = batteryCapacity / range * 100;
      
      return {
        range,
        powerToWeight,
        energyEfficiency,
        topSpeed: maxSpeed,
        acceleration,
        efficiency
      };
    };

    const vehicles = [
      { name: presetVehicles.regular.name, ...calculateNormalizedMetrics(presetVehicles.regular) },
      { name: presetVehicles.sport.name, ...calculateNormalizedMetrics(presetVehicles.sport) },
      { name: presetVehicles.suv.name, ...calculateNormalizedMetrics(presetVehicles.suv) },
      { name: currentVehicle.name, ...calculateNormalizedMetrics(currentVehicle) }
    ];

    // Find min/max for normalization
    const metrics = ['range', 'powerToWeight', 'topSpeed', 'efficiency'];
    const invertedMetrics = ['energyEfficiency', 'acceleration']; // Lower is better
    
    const minMax = {};
    [...metrics, ...invertedMetrics].forEach(metric => {
      const values = vehicles.map(v => v[metric]);
      minMax[metric] = {
        min: Math.min(...values),
        max: Math.max(...values)
      };
    });

    // Normalize to 0-100 scale with weighting
    const normalizeMetric = (value, metric, weight = 3) => {
      const { min, max } = minMax[metric];
      if (max === min) return 50 * (weight / 3); // If all values are the same
      
      let normalized = ((value - min) / (max - min)) * 100;
      
      // For inverted metrics (lower is better), flip the scale
      if (invertedMetrics.includes(metric)) {
        normalized = 100 - normalized;
      }
      
      // Apply weighting (1-5 scale, 3 is neutral)
      normalized = normalized * (weight / 3);
      
      return Math.round(Math.min(normalized, 100)); // Cap at 100
    };

    // Create radar chart data
    const radarMetrics = [
      { metric: 'Range', fullName: 'Range (km)', weight: metricWeights.range },
      { metric: 'Power', fullName: 'Power/Weight (W/kg)', weight: metricWeights.power },
      { metric: 'Speed', fullName: 'Top Speed (km/h)', weight: metricWeights.speed },
      { metric: 'Efficiency', fullName: 'Drivetrain Efficiency (%)', weight: metricWeights.efficiency },
      { metric: 'Energy Eff.', fullName: 'Energy Efficiency (Wh/km)', weight: metricWeights.energyEff },
      { metric: 'Acceleration', fullName: 'Acceleration (0-100 km/h)', weight: metricWeights.acceleration }
    ];

    return radarMetrics.map(({ metric, fullName, weight }) => {
      const dataPoint = { metric, fullName, weight };
      
      vehicles.forEach(vehicle => {
        let value;
        switch (metric) {
          case 'Range':
            value = normalizeMetric(vehicle.range, 'range', weight);
            break;
          case 'Power':
            value = normalizeMetric(vehicle.powerToWeight, 'powerToWeight', weight);
            break;
          case 'Speed':
            value = normalizeMetric(vehicle.topSpeed, 'topSpeed', weight);
            break;
          case 'Efficiency':
            value = normalizeMetric(vehicle.efficiency, 'efficiency', weight);
            break;
          case 'Energy Eff.':
            value = normalizeMetric(vehicle.energyEfficiency, 'energyEfficiency', weight);
            break;
          case 'Acceleration':
            value = normalizeMetric(vehicle.acceleration, 'acceleration', weight);
            break;
          default:
            value = 0;
        }
        dataPoint[vehicle.name] = value;
      });
      
      return dataPoint;
    });
  }, [presetVehicles, currentVehicle, metricWeights]);

  const vehicleColors = {
    [presetVehicles.regular.name]: '#6b7280', // Gray for regular
    [presetVehicles.sport.name]: '#dc2626', // Red for sport
    [presetVehicles.suv.name]: '#059669', // Green for SUV
    [currentVehicle.name]: '#009682', // Primary green for custom
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = radarData.find(item => item.metric === label);
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{data?.fullName || label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}/100`}
            </p>
          ))}
          <p className="text-xs text-gray-500 mt-1">
            Normalized scale (0-100, higher is better)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Weight Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sliders className="h-5 w-5" />
              Performance Priority Controls
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowWeightControls(!showWeightControls)}
              >
                {showWeightControls ? 'Hide Controls' : 'Customize Analysis'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetWeights}
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Adjust the importance of different performance metrics to match your priorities
          </p>
        </CardHeader>
        {showWeightControls && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: 'range', label: 'Range Importance', description: 'How far the vehicle can travel' },
                { key: 'power', label: 'Power Importance', description: 'Power-to-weight ratio for performance' },
                { key: 'speed', label: 'Speed Importance', description: 'Maximum achievable speed' },
                { key: 'efficiency', label: 'Drivetrain Efficiency', description: 'Motor and system efficiency' },
                { key: 'energyEff', label: 'Energy Efficiency', description: 'Energy consumption per km' },
                { key: 'acceleration', label: 'Acceleration Importance', description: '0-100 km/h performance' }
              ].map(({ key, label, description }) => (
                <div key={key} className="space-y-2">
                  <Label className="text-sm font-medium">{label}</Label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={metricWeights[key]}
                    onChange={(e) => setMetricWeights(prev => ({
                      ...prev,
                      [key]: parseInt(e.target.value)
                    }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Low (1)</span>
                    <span className="font-medium">Current: {metricWeights[key]}</span>
                    <span>High (5)</span>
                  </div>
                  <p className="text-xs text-gray-400">{description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Multi-Dimensional Performance Analysis
          </CardTitle>
          <p className="text-sm text-gray-600">
            Radar chart comparing all vehicles across weighted performance metrics (0-100 scale)
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis 
                  dataKey="metric" 
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fontSize: 10, fill: '#999' }}
                  tickCount={6}
                />
                <Radar
                  name={presetVehicles.regular.name}
                  dataKey={presetVehicles.regular.name}
                  stroke={vehicleColors[presetVehicles.regular.name]}
                  fill={vehicleColors[presetVehicles.regular.name]}
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Radar
                  name={presetVehicles.sport.name}
                  dataKey={presetVehicles.sport.name}
                  stroke={vehicleColors[presetVehicles.sport.name]}
                  fill={vehicleColors[presetVehicles.sport.name]}
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Radar
                  name={presetVehicles.suv.name}
                  dataKey={presetVehicles.suv.name}
                  stroke={vehicleColors[presetVehicles.suv.name]}
                  fill={vehicleColors[presetVehicles.suv.name]}
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Radar
                  name={currentVehicle.name}
                  dataKey={currentVehicle.name}
                  stroke={vehicleColors[currentVehicle.name]}
                  fill={vehicleColors[currentVehicle.name]}
                  fillOpacity={0.2}
                  strokeWidth={3}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance Strengths */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Strengths Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(vehicleColors).map(([vehicleName, color]) => {
              // Find the strongest metrics for this vehicle
              const vehicleStrengths = radarData
                .map(item => ({
                  metric: item.fullName,
                  value: item[vehicleName]
                }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 3);

              return (
                <div key={vehicleName} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: color }}
                    ></div>
                    <h3 className="font-semibold text-gray-900">{vehicleName}</h3>
                  </div>
                  <div className="space-y-2">
                    {vehicleStrengths.map((strength, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{strength.metric}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-300"
                              style={{ 
                                width: `${strength.value}%`,
                                backgroundColor: index === 0 ? '#009682' : color
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 w-8">{strength.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RadarChartComponent;

