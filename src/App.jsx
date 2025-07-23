import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Separator } from './components/ui/separator';
import { Badge } from './components/ui/badge';
import { Info, Download, Calculator, BarChart3, Radar } from 'lucide-react';
import PerformanceChart from './components/PerformanceChart';
import ComparisonChart from './components/ComparisonChart';
import RadarChart from './components/RadarChart';
import FormulasSection from './components/FormulasSection';

function App() {
  const [vehicleData, setVehicleData] = useState({
    batteryCapacity: 75, // kWh
    motorPower: 250, // kW
    weight: 2000, // kg
    dragCoefficient: 0.25,
    frontalArea: 2.5, // m²
    efficiency: 85, // %
    maxSpeed: 200, // km/h
    acceleration: 5.5, // 0-100 km/h in seconds
  });

  const [calculatedMetrics, setCalculatedMetrics] = useState({});
  const [presetVehicles] = useState({
    regular: {
      name: "Regular Car",
      batteryCapacity: 60,
      motorPower: 150,
      weight: 1800,
      dragCoefficient: 0.28,
      frontalArea: 2.3,
      efficiency: 80,
      maxSpeed: 180,
      acceleration: 7.2,
    },
    sport: {
      name: "Sport Car",
      batteryCapacity: 100,
      motorPower: 400,
      weight: 2200,
      dragCoefficient: 0.22,
      frontalArea: 2.1,
      efficiency: 88,
      maxSpeed: 250,
      acceleration: 3.5,
    },
    suv: {
      name: "Electric SUV",
      batteryCapacity: 95,
      motorPower: 300,
      weight: 2500,
      dragCoefficient: 0.32,
      frontalArea: 2.8,
      efficiency: 82,
      maxSpeed: 200,
      acceleration: 6.0,
    }
  });

  // Calculate performance metrics
  useEffect(() => {
    const calculateMetrics = (data) => {
      const { batteryCapacity, motorPower, weight, dragCoefficient, frontalArea, efficiency, maxSpeed, acceleration } = data;
      
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
      const powerToWeight = motorPower / weight * 1000; // W/kg
      
      // Energy efficiency
      const energyEfficiency = batteryCapacity / range * 100; // Wh/km
      
      // Torque estimation (simplified)
      const estimatedTorque = motorPower * 9549 / 6000; // Nm (assuming 6000 rpm)
      
      return {
        range: Math.round(range),
        powerToWeight: Math.round(powerToWeight),
        energyEfficiency: Math.round(energyEfficiency),
        estimatedTorque: Math.round(estimatedTorque),
        topSpeed: maxSpeed,
        acceleration: acceleration,
      };
    };

    setCalculatedMetrics(calculateMetrics(vehicleData));
  }, [vehicleData]);

  const handleInputChange = (field, value) => {
    setVehicleData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const loadPreset = (presetKey) => {
    setVehicleData(presetVehicles[presetKey]);
  };

  const exportData = (format) => {
    const exportData = {
      vehicleData,
      calculatedMetrics,
      timestamp: new Date().toISOString()
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ev-calculator-data.json';
      a.click();
    } else if (format === 'csv') {
      const csvData = [
        ['Metric', 'Value', 'Unit'],
        ['Battery Capacity', vehicleData.batteryCapacity, 'kWh'],
        ['Motor Power', vehicleData.motorPower, 'kW'],
        ['Weight', vehicleData.weight, 'kg'],
        ['Drag Coefficient', vehicleData.dragCoefficient, ''],
        ['Frontal Area', vehicleData.frontalArea, 'm²'],
        ['Efficiency', vehicleData.efficiency, '%'],
        ['Max Speed', vehicleData.maxSpeed, 'km/h'],
        ['Acceleration (0-100)', vehicleData.acceleration, 's'],
        ['Range', calculatedMetrics.range, 'km'],
        ['Power-to-Weight', calculatedMetrics.powerToWeight, 'W/kg'],
        ['Energy Efficiency', calculatedMetrics.energyEfficiency, 'Wh/km'],
        ['Estimated Torque', calculatedMetrics.estimatedTorque, 'Nm'],
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ev-calculator-data.csv';
      a.click();
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
              <Calculator className="h-8 w-8 text-primary" />
              EV Calculator
            </h1>
            <p className="text-lg text-gray-600">
              Professional Electric Vehicle Performance Analysis Tool
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Intuitive for beginners, powerful for professionals
            </p>
          </div>

          <Tabs defaultValue="calculator" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="formulas">How It Works</TabsTrigger>
            </TabsList>

            {/* Calculator Tab */}
            <TabsContent value="calculator" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Vehicle Parameters
                    </CardTitle>
                    <div className="flex gap-2">
                      <Select onValueChange={loadPreset}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Load preset..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="regular">Regular Car</SelectItem>
                          <SelectItem value="sport">Sport Car</SelectItem>
                          <SelectItem value="suv">Electric SUV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label className="flex items-center gap-1 cursor-help">
                              Battery Capacity (kWh)
                              <Info className="h-3 w-3" />
                            </Label>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Total energy storage capacity of the battery pack</p>
                          </TooltipContent>
                        </Tooltip>
                        <Input
                          type="number"
                          value={vehicleData.batteryCapacity}
                          onChange={(e) => handleInputChange('batteryCapacity', e.target.value)}
                          step="0.1"
                        />
                      </div>

                      <div className="space-y-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label className="flex items-center gap-1 cursor-help">
                              Motor Power (kW)
                              <Info className="h-3 w-3" />
                            </Label>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Maximum power output of the electric motor</p>
                          </TooltipContent>
                        </Tooltip>
                        <Input
                          type="number"
                          value={vehicleData.motorPower}
                          onChange={(e) => handleInputChange('motorPower', e.target.value)}
                          step="1"
                        />
                      </div>

                      <div className="space-y-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label className="flex items-center gap-1 cursor-help">
                              Weight (kg)
                              <Info className="h-3 w-3" />
                            </Label>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Total vehicle weight including battery</p>
                          </TooltipContent>
                        </Tooltip>
                        <Input
                          type="number"
                          value={vehicleData.weight}
                          onChange={(e) => handleInputChange('weight', e.target.value)}
                          step="10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label className="flex items-center gap-1 cursor-help">
                              Drag Coefficient
                              <Info className="h-3 w-3" />
                            </Label>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Aerodynamic drag coefficient (Cd)</p>
                          </TooltipContent>
                        </Tooltip>
                        <Input
                          type="number"
                          value={vehicleData.dragCoefficient}
                          onChange={(e) => handleInputChange('dragCoefficient', e.target.value)}
                          step="0.01"
                        />
                      </div>

                      <div className="space-y-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label className="flex items-center gap-1 cursor-help">
                              Frontal Area (m²)
                              <Info className="h-3 w-3" />
                            </Label>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Cross-sectional area facing the airflow</p>
                          </TooltipContent>
                        </Tooltip>
                        <Input
                          type="number"
                          value={vehicleData.frontalArea}
                          onChange={(e) => handleInputChange('frontalArea', e.target.value)}
                          step="0.1"
                        />
                      </div>

                      <div className="space-y-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label className="flex items-center gap-1 cursor-help">
                              Efficiency (%)
                              <Info className="h-3 w-3" />
                            </Label>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Overall drivetrain efficiency</p>
                          </TooltipContent>
                        </Tooltip>
                        <Input
                          type="number"
                          value={vehicleData.efficiency}
                          onChange={(e) => handleInputChange('efficiency', e.target.value)}
                          step="1"
                          min="0"
                          max="100"
                        />
                      </div>

                      <div className="space-y-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label className="flex items-center gap-1 cursor-help">
                              Max Speed (km/h)
                              <Info className="h-3 w-3" />
                            </Label>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Maximum achievable speed</p>
                          </TooltipContent>
                        </Tooltip>
                        <Input
                          type="number"
                          value={vehicleData.maxSpeed}
                          onChange={(e) => handleInputChange('maxSpeed', e.target.value)}
                          step="5"
                        />
                      </div>

                      <div className="space-y-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label className="flex items-center gap-1 cursor-help">
                              0-100 km/h (s)
                              <Info className="h-3 w-3" />
                            </Label>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Acceleration time from 0 to 100 km/h</p>
                          </TooltipContent>
                        </Tooltip>
                        <Input
                          type="number"
                          value={vehicleData.acceleration}
                          onChange={(e) => handleInputChange('acceleration', e.target.value)}
                          step="0.1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Results Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Performance Metrics
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportData('json')}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        JSON
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportData('csv')}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        CSV
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-700">
                          {calculatedMetrics.range || 0}
                        </div>
                        <div className="text-sm text-green-600">Range (km)</div>
                      </div>
                      
                      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-700">
                          {calculatedMetrics.powerToWeight || 0}
                        </div>
                        <div className="text-sm text-blue-600">Power/Weight (W/kg)</div>
                      </div>
                      
                      <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="text-2xl font-bold text-orange-700">
                          {calculatedMetrics.energyEfficiency || 0}
                        </div>
                        <div className="text-sm text-orange-600">Efficiency (Wh/km)</div>
                      </div>
                      
                      <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-2xl font-bold text-purple-700">
                          {calculatedMetrics.estimatedTorque || 0}
                        </div>
                        <div className="text-sm text-purple-600">Torque (Nm)</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Top Speed:</span>
                        <Badge variant="secondary">{vehicleData.maxSpeed} km/h</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">0-100 km/h:</span>
                        <Badge variant="secondary">{vehicleData.acceleration} s</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <PerformanceChart data={calculatedMetrics} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Comparison Tab */}
            <TabsContent value="comparison">
              <ComparisonChart 
                presetVehicles={presetVehicles}
                currentVehicle={{ name: "Custom Vehicle", ...vehicleData }}
              />
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis">
              <RadarChart 
                presetVehicles={presetVehicles}
                currentVehicle={{ name: "Custom Vehicle", ...vehicleData }}
              />
            </TabsContent>

            {/* Formulas Tab */}
            <TabsContent value="formulas">
              <FormulasSection />
            </TabsContent>
          </Tabs>
        </div>

        {/* Watermark */}
        <div className="watermark">
          l.poloju
        </div>
      </div>
    </TooltipProvider>
  );
}

export default App;

