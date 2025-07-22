import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Calculator, Car, Battery, Zap, Gauge, Info, AlertTriangle, Download, FileText } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts'
import { 
  calculateMotorPower, 
  calculateEnergyConsumption, 
  calculateVehicleDynamics, 
  calculateFeasibilityScore,
  generatePowerCurve 
} from './lib/calculations.js'
import ComparisonTool from './components/ComparisonTool.jsx'
import ExportTool from './components/ExportTool.jsx'
import './App.css'

function App() {
  // Input states
  const [vehicleSpecs, setVehicleSpecs] = useState({
    mass: 1500,
    additionalWeight: 75,
    topSpeed: 180,
    acceleration0to100: 8.5,
    range: 400,
    tireRadius: 0.32,
    dragCoefficient: 0.28,
    frontalArea: 2.3,
    terrainType: 'mixed',
    auxiliaryLoad: 'normal'
  })

  // Calculated results
  const [results, setResults] = useState({
    totalWeight: 0,
    motorPower: {},
    energyConsumption: {},
    vehicleDynamics: {},
    feasibilityAnalysis: {},
    powerCurveData: []
  })

  // Calculate results whenever inputs change
  useEffect(() => {
    calculateResults()
  }, [vehicleSpecs])

  const calculateResults = () => {
    const totalWeight = vehicleSpecs.mass + vehicleSpecs.additionalWeight
    
    // Calculate motor power requirements
    const motorPower = calculateMotorPower({
      mass: totalWeight,
      topSpeed: vehicleSpecs.topSpeed,
      acceleration0to100: vehicleSpecs.acceleration0to100,
      dragCoefficient: vehicleSpecs.dragCoefficient,
      frontalArea: vehicleSpecs.frontalArea,
      terrainType: vehicleSpecs.terrainType,
      tireRadius: vehicleSpecs.tireRadius
    })

    // Calculate energy consumption
    const energyConsumption = calculateEnergyConsumption({
      mass: totalWeight,
      dragCoefficient: vehicleSpecs.dragCoefficient,
      frontalArea: vehicleSpecs.frontalArea,
      terrainType: vehicleSpecs.terrainType,
      range: vehicleSpecs.range,
      auxiliaryLoad: vehicleSpecs.auxiliaryLoad
    })

    // Calculate vehicle dynamics
    const vehicleDynamics = calculateVehicleDynamics({
      mass: totalWeight,
      tireRadius: vehicleSpecs.tireRadius,
      dragCoefficient: vehicleSpecs.dragCoefficient,
      frontalArea: vehicleSpecs.frontalArea,
      topSpeed: vehicleSpecs.topSpeed,
      acceleration0to100: vehicleSpecs.acceleration0to100,
      requiredPower: motorPower.requiredPower
    })

    // Calculate feasibility score
    const feasibilityAnalysis = calculateFeasibilityScore(
      {
        requiredPower: motorPower.requiredPower,
        batteryCapacity: energyConsumption.batteryCapacity,
        consumptionWhKm: energyConsumption.consumptionWhKm
      },
      {
        mass: totalWeight,
        acceleration0to100: vehicleSpecs.acceleration0to100,
        dragCoefficient: vehicleSpecs.dragCoefficient,
        range: vehicleSpecs.range,
        additionalWeight: vehicleSpecs.additionalWeight
      }
    )

    // Generate power curve data
    const powerCurveData = generatePowerCurve({
      mass: totalWeight,
      dragCoefficient: vehicleSpecs.dragCoefficient,
      frontalArea: vehicleSpecs.frontalArea,
      terrainType: vehicleSpecs.terrainType,
      topSpeed: vehicleSpecs.topSpeed
    })

    setResults({
      totalWeight,
      motorPower,
      energyConsumption,
      vehicleDynamics,
      feasibilityAnalysis,
      powerCurveData
    })
  }

  const handleInputChange = (field, value) => {
    setVehicleSpecs(prev => ({
      ...prev,
      [field]: field === 'terrainType' || field === 'auxiliaryLoad' ? value : (parseFloat(value) || 0)
    }))
  }

  const getFeasibilityColor = (score) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getFeasibilityText = (rating) => {
    return rating || 'Unknown'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Advanced EV Calculator</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estimate key performance and design parameters for electric vehicles based on technical specifications
          </p>
        </div>

        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="compare" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              Compare
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Vehicle Specifications
                  </CardTitle>
                  <CardDescription>
                    Enter the technical specifications of your electric vehicle
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="mass">Vehicle Mass (kg)</Label>
                      <Input
                        id="mass"
                        type="number"
                        value={vehicleSpecs.mass}
                        onChange={(e) => handleInputChange('mass', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="additionalWeight">Additional Weight (kg)</Label>
                      <Input
                        id="additionalWeight"
                        type="number"
                        value={vehicleSpecs.additionalWeight}
                        onChange={(e) => handleInputChange('additionalWeight', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="topSpeed">Top Speed (km/h)</Label>
                      <Input
                        id="topSpeed"
                        type="number"
                        value={vehicleSpecs.topSpeed}
                        onChange={(e) => handleInputChange('topSpeed', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="acceleration0to100">0-100 km/h (seconds)</Label>
                      <Input
                        id="acceleration0to100"
                        type="number"
                        step="0.1"
                        value={vehicleSpecs.acceleration0to100}
                        onChange={(e) => handleInputChange('acceleration0to100', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="range">Range (km)</Label>
                      <Input
                        id="range"
                        type="number"
                        value={vehicleSpecs.range}
                        onChange={(e) => handleInputChange('range', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tireRadius">Tire Radius (m)</Label>
                      <Input
                        id="tireRadius"
                        type="number"
                        step="0.01"
                        value={vehicleSpecs.tireRadius}
                        onChange={(e) => handleInputChange('tireRadius', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dragCoefficient">Drag Coefficient</Label>
                      <Input
                        id="dragCoefficient"
                        type="number"
                        step="0.01"
                        value={vehicleSpecs.dragCoefficient}
                        onChange={(e) => handleInputChange('dragCoefficient', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="frontalArea">Frontal Area (m²)</Label>
                      <Input
                        id="frontalArea"
                        type="number"
                        step="0.1"
                        value={vehicleSpecs.frontalArea}
                        onChange={(e) => handleInputChange('frontalArea', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="terrainType">Terrain Type</Label>
                      <Select value={vehicleSpecs.terrainType} onValueChange={(value) => handleInputChange('terrainType', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urban">Urban</SelectItem>
                          <SelectItem value="highway">Highway</SelectItem>
                          <SelectItem value="mixed">Mixed</SelectItem>
                          <SelectItem value="offroad">Off-road</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="auxiliaryLoad">Auxiliary Load</Label>
                      <Select value={vehicleSpecs.auxiliaryLoad} onValueChange={(value) => handleInputChange('auxiliaryLoad', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High (A/C, Heating)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Calculated Results
                  </CardTitle>
                  <CardDescription>
                    Estimated performance parameters based on your specifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600">Total Weight</div>
                      <div className="text-2xl font-bold text-blue-600">{results.totalWeight} kg</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600">Required Power</div>
                      <div className="text-2xl font-bold text-green-600">{results.motorPower.requiredPower || 0} kW</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600">Required Torque</div>
                      <div className="text-2xl font-bold text-purple-600">{results.motorPower.requiredTorque || 0} Nm</div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="text-sm text-gray-600">Battery Capacity</div>
                      <div className="text-2xl font-bold text-orange-600">{results.energyConsumption.batteryCapacity || 0} kWh</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="text-sm text-gray-600">Energy Consumption</div>
                      <div className="text-2xl font-bold text-red-600">{results.energyConsumption.consumptionWhKm || 0} Wh/km</div>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-lg">
                      <div className="text-sm text-gray-600">Power-to-Weight</div>
                      <div className="text-2xl font-bold text-indigo-600">{results.feasibilityAnalysis.powerToWeight || 0} W/kg</div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-600">Feasibility Score</div>
                      <Badge className={`${getFeasibilityColor(results.feasibilityAnalysis.score || 0)} text-white`}>
                        {getFeasibilityText(results.feasibilityAnalysis.rating)}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getFeasibilityColor(results.feasibilityAnalysis.score || 0)}`}
                        style={{ width: `${results.feasibilityAnalysis.score || 0}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-sm text-gray-600 mt-1">{results.feasibilityAnalysis.score || 0}/100</div>
                    
                    {results.feasibilityAnalysis.issues && results.feasibilityAnalysis.issues.length > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center gap-2 text-sm text-amber-600 mb-2">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="font-medium">Issues to Consider:</span>
                        </div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {results.feasibilityAnalysis.issues.map((issue, index) => (
                            <li key={index}>• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Power vs Speed Analysis</CardTitle>
                  <CardDescription>Power requirements at different speeds</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={results.powerCurveData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="speed" label={{ value: 'Speed (km/h)', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="power" stroke="#2563eb" strokeWidth={2} name="Power" />
                      <Line type="monotone" dataKey="efficiency" stroke="#16a34a" strokeWidth={2} name="Efficiency %" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Breakdown</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { name: 'Power', value: results.motorPower.requiredPower || 0, unit: 'kW' },
                      { name: 'Torque', value: (results.motorPower.requiredTorque || 0) / 10, unit: 'Nm (÷10)' },
                      { name: 'Battery', value: results.energyConsumption.batteryCapacity || 0, unit: 'kWh' },
                      { name: 'Consumption', value: (results.energyConsumption.consumptionWhKm || 0) / 10, unit: 'Wh/km (÷10)' },
                      { name: 'Max Speed', value: (results.vehicleDynamics.maxTheoreticalSpeed || 0) / 10, unit: 'km/h (÷10)' },
                      { name: 'Braking Dist', value: results.vehicleDynamics.brakingDistance || 0, unit: 'm' }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Engineering Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Calculation Methodology:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Rolling resistance: Crr × Weight × g</li>
                      <li>• Air drag: 0.5 × ρ × Cd × A × v²</li>
                      <li>• Power: (Forces × velocity) / efficiency</li>
                      <li>• Torque: Power / angular velocity</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Assumptions:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Air density: 1.225 kg/m³</li>
                      <li>• Motor efficiency: 85%</li>
                      <li>• Rolling resistance varies by terrain</li>
                      <li>• Constant acceleration assumption</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <ExportTool vehicleSpecs={vehicleSpecs} results={results} />
          </TabsContent>

          <TabsContent value="compare" className="space-y-6">
            <ComparisonTool />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App

