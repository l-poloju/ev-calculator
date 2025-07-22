import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Plus, X, Car, Zap, Battery } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { 
  calculateMotorPower, 
  calculateEnergyConsumption, 
  calculateFeasibilityScore 
} from '../lib/calculations.js'

const defaultSpecs = {
  name: 'Vehicle',
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
}

export default function ComparisonTool() {
  const [vehicles, setVehicles] = useState([
    { ...defaultSpecs, name: 'City Car', mass: 1200, topSpeed: 150, range: 300 },
    { ...defaultSpecs, name: 'Sport Car', mass: 1800, topSpeed: 250, acceleration0to100: 4.5, dragCoefficient: 0.25 }
  ])

  const addVehicle = () => {
    if (vehicles.length < 4) {
      setVehicles([...vehicles, { ...defaultSpecs, name: `Vehicle ${vehicles.length + 1}` }])
    }
  }

  const removeVehicle = (index) => {
    if (vehicles.length > 1) {
      setVehicles(vehicles.filter((_, i) => i !== index))
    }
  }

  const updateVehicle = (index, field, value) => {
    const updatedVehicles = [...vehicles]
    updatedVehicles[index] = {
      ...updatedVehicles[index],
      [field]: field === 'name' || field === 'terrainType' || field === 'auxiliaryLoad' ? value : (parseFloat(value) || 0)
    }
    setVehicles(updatedVehicles)
  }

  const calculateVehicleResults = (specs) => {
    const totalWeight = specs.mass + specs.additionalWeight
    
    const motorPower = calculateMotorPower({
      mass: totalWeight,
      topSpeed: specs.topSpeed,
      acceleration0to100: specs.acceleration0to100,
      dragCoefficient: specs.dragCoefficient,
      frontalArea: specs.frontalArea,
      terrainType: specs.terrainType,
      tireRadius: specs.tireRadius
    })

    const energyConsumption = calculateEnergyConsumption({
      mass: totalWeight,
      dragCoefficient: specs.dragCoefficient,
      frontalArea: specs.frontalArea,
      terrainType: specs.terrainType,
      range: specs.range,
      auxiliaryLoad: specs.auxiliaryLoad
    })

    const feasibilityAnalysis = calculateFeasibilityScore(
      {
        requiredPower: motorPower.requiredPower,
        batteryCapacity: energyConsumption.batteryCapacity,
        consumptionWhKm: energyConsumption.consumptionWhKm
      },
      {
        mass: totalWeight,
        acceleration0to100: specs.acceleration0to100,
        dragCoefficient: specs.dragCoefficient,
        range: specs.range,
        additionalWeight: specs.additionalWeight
      }
    )

    return {
      totalWeight,
      motorPower,
      energyConsumption,
      feasibilityAnalysis
    }
  }

  const comparisonData = vehicles.map(vehicle => {
    const results = calculateVehicleResults(vehicle)
    return {
      name: vehicle.name,
      power: results.motorPower.requiredPower,
      battery: results.energyConsumption.batteryCapacity,
      consumption: results.energyConsumption.consumptionWhKm,
      feasibility: results.feasibilityAnalysis.score,
      weight: results.totalWeight,
      range: vehicle.range,
      topSpeed: vehicle.topSpeed,
      acceleration: vehicle.acceleration0to100
    }
  })

  const radarData = vehicles.map(vehicle => {
    const results = calculateVehicleResults(vehicle)
    return {
      vehicle: vehicle.name,
      Power: Math.min(100, (results.motorPower.requiredPower / 300) * 100),
      Efficiency: Math.min(100, (250 / results.energyConsumption.consumptionWhKm) * 100),
      Range: Math.min(100, (vehicle.range / 500) * 100),
      Performance: Math.min(100, (15 / vehicle.acceleration0to100) * 100),
      Feasibility: results.feasibilityAnalysis.score
    }
  })

  const getFeasibilityColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Vehicle Configuration Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {vehicles.map((vehicle, index) => (
          <Card key={index} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  <Input
                    value={vehicle.name}
                    onChange={(e) => updateVehicle(index, 'name', e.target.value)}
                    className="border-none p-0 h-auto text-lg font-semibold bg-transparent"
                  />
                </CardTitle>
                {vehicles.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVehicle(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Mass (kg)</Label>
                  <Input
                    type="number"
                    value={vehicle.mass}
                    onChange={(e) => updateVehicle(index, 'mass', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Top Speed (km/h)</Label>
                  <Input
                    type="number"
                    value={vehicle.topSpeed}
                    onChange={(e) => updateVehicle(index, 'topSpeed', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">0-100 km/h (s)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={vehicle.acceleration0to100}
                    onChange={(e) => updateVehicle(index, 'acceleration0to100', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Range (km)</Label>
                  <Input
                    type="number"
                    value={vehicle.range}
                    onChange={(e) => updateVehicle(index, 'range', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Drag Coeff.</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={vehicle.dragCoefficient}
                    onChange={(e) => updateVehicle(index, 'dragCoefficient', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Frontal Area (m²)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={vehicle.frontalArea}
                    onChange={(e) => updateVehicle(index, 'frontalArea', e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>
              
              {/* Quick Results */}
              <div className="pt-2 border-t">
                {(() => {
                  const results = calculateVehicleResults(vehicle)
                  return (
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-gray-500">Power</div>
                        <div className="font-semibold text-blue-600">{results.motorPower.requiredPower} kW</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">Battery</div>
                        <div className="font-semibold text-orange-600">{results.energyConsumption.batteryCapacity} kWh</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">Score</div>
                        <div className={`font-semibold ${getFeasibilityColor(results.feasibilityAnalysis.score)}`}>
                          {results.feasibilityAnalysis.score}
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {vehicles.length < 4 && (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="flex items-center justify-center h-full min-h-[200px]">
              <Button
                variant="ghost"
                onClick={addVehicle}
                className="flex flex-col items-center gap-2 text-gray-500 hover:text-gray-700"
              >
                <Plus className="h-8 w-8" />
                <span>Add Vehicle</span>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Comparison</CardTitle>
            <CardDescription>Key metrics comparison across vehicles</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="power" fill="#3b82f6" name="Power (kW)" />
                <Bar dataKey="battery" fill="#f59e0b" name="Battery (kWh)" />
                <Bar dataKey="feasibility" fill="#10b981" name="Feasibility Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Multi-Dimensional Analysis</CardTitle>
            <CardDescription>Radar chart showing relative performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData[0] ? [radarData[0]] : []}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                {radarData.map((vehicle, index) => (
                  <Radar
                    key={index}
                    name={vehicle.vehicle}
                    dataKey="value"
                    stroke={['#3b82f6', '#f59e0b', '#10b981', '#ef4444'][index]}
                    fill={['#3b82f6', '#f59e0b', '#10b981', '#ef4444'][index]}
                    fillOpacity={0.1}
                    data={[
                      { subject: 'Power', value: vehicle.Power },
                      { subject: 'Efficiency', value: vehicle.Efficiency },
                      { subject: 'Range', value: vehicle.Range },
                      { subject: 'Performance', value: vehicle.Performance },
                      { subject: 'Feasibility', value: vehicle.Feasibility }
                    ]}
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Comparison</CardTitle>
          <CardDescription>Side-by-side comparison of all parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Parameter</th>
                  {vehicles.map((vehicle, index) => (
                    <th key={index} className="text-center p-2">{vehicle.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Required Power (kW)', key: 'power' },
                  { label: 'Battery Capacity (kWh)', key: 'battery' },
                  { label: 'Energy Consumption (Wh/km)', key: 'consumption' },
                  { label: 'Total Weight (kg)', key: 'weight' },
                  { label: 'Range (km)', key: 'range' },
                  { label: 'Top Speed (km/h)', key: 'topSpeed' },
                  { label: '0-100 km/h (s)', key: 'acceleration' },
                  { label: 'Feasibility Score', key: 'feasibility' }
                ].map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{row.label}</td>
                    {comparisonData.map((vehicle, colIndex) => (
                      <td key={colIndex} className="text-center p-2">
                        {row.key === 'feasibility' ? (
                          <Badge className={getFeasibilityColor(vehicle[row.key])}>
                            {vehicle[row.key]}
                          </Badge>
                        ) : (
                          vehicle[row.key]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

