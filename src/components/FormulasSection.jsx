import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Calculator, BookOpen, Info, Zap } from 'lucide-react';

const FormulasSection = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            How the EV Calculator Works
          </CardTitle>
          <p className="text-sm text-gray-600">
            Understanding the calculations, formulas, and industry standards behind the performance metrics
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="formulas" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="formulas">Formulas</TabsTrigger>
          <TabsTrigger value="terms">Terms</TabsTrigger>
          <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
          <TabsTrigger value="standards">Standards</TabsTrigger>
        </TabsList>

        <TabsContent value="formulas" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Range Calculation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                  <div>Energy Consumption = (Drag Force + Rolling Resistance) / 1000</div>
                  <div className="mt-2">Drag Force = 0.5 × ρ × Cd × A × v²</div>
                  <div>Rolling Resistance = m × g × Crr</div>
                  <div className="mt-2">Range = (Battery Capacity × Efficiency) / Energy Consumption</div>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Where:</strong></p>
                  <p>ρ = Air density (1.225 kg/m³ at sea level)</p>
                  <p>Cd = Drag coefficient</p>
                  <p>A = Frontal area (m²)</p>
                  <p>v = Velocity (m/s, calculated at 80 km/h)</p>
                  <p>m = Vehicle mass (kg)</p>
                  <p>g = Gravitational acceleration (9.81 m/s²)</p>
                  <p>Crr = Rolling resistance coefficient (0.01)</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Power-to-Weight Ratio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                  <div>Power-to-Weight = (Motor Power × 1000) / Vehicle Weight</div>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Units:</strong> W/kg</p>
                  <p><strong>Significance:</strong> Higher values indicate better acceleration and performance</p>
                  <p><strong>Typical Range:</strong> 100-400 W/kg for EVs</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Energy Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                  <div>Energy Efficiency = (Battery Capacity / Range) × 100</div>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Units:</strong> Wh/km</p>
                  <p><strong>Significance:</strong> Lower values indicate better efficiency</p>
                  <p><strong>Typical Range:</strong> 150-250 Wh/km for modern EVs</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estimated Torque</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                  <div>Torque = (Motor Power × 9549) / RPM</div>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Assumption:</strong> RPM = 6000 (typical for EV motors)</p>
                  <p><strong>Units:</strong> Nm (Newton-meters)</p>
                  <p><strong>Note:</strong> This is a simplified estimation</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="terms" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Battery & Energy Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">kWh</Badge>
                    <span className="font-semibold">Kilowatt-hour</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Unit of energy storage capacity. Represents how much energy the battery can store.
                    1 kWh = 1000 Wh.
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">Wh/km</Badge>
                    <span className="font-semibold">Watt-hours per kilometer</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Energy consumption rate. Lower values mean the vehicle uses less energy to travel the same distance.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">Efficiency %</Badge>
                    <span className="font-semibold">Drivetrain Efficiency</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Percentage of battery energy that actually reaches the wheels. Modern EVs achieve 85-95% efficiency.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">kW</Badge>
                    <span className="font-semibold">Kilowatt</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Unit of power. Indicates how much energy the motor can deliver per unit time.
                    1 kW ≈ 1.34 horsepower.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">Nm</Badge>
                    <span className="font-semibold">Newton-meter</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Unit of torque. Represents the rotational force the motor can produce.
                    Higher torque = better acceleration.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">W/kg</Badge>
                    <span className="font-semibold">Watts per kilogram</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Power-to-weight ratio. Higher values indicate better acceleration and performance characteristics.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Aerodynamic Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">Cd</Badge>
                    <span className="font-semibold">Drag Coefficient</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Dimensionless number representing aerodynamic efficiency. Lower values mean less air resistance.
                    Typical range: 0.20-0.35 for modern vehicles.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">m²</Badge>
                    <span className="font-semibold">Frontal Area</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Cross-sectional area of the vehicle facing the airflow. Larger area = more air resistance.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vehicle Dynamics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">0-100 km/h</Badge>
                    <span className="font-semibold">Acceleration Time</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Time required to accelerate from standstill to 100 km/h. Lower values indicate better performance.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">kg</Badge>
                    <span className="font-semibold">Vehicle Weight</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Total mass including battery pack. Affects acceleration, braking, and energy consumption.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assumptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Calculation Assumptions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Environmental Conditions</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Air density: 1.225 kg/m³ (sea level, 15°C)</li>
                    <li>• No wind resistance</li>
                    <li>• Flat road surface</li>
                    <li>• Dry conditions</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Driving Conditions</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Constant speed of 80 km/h for range calculation</li>
                    <li>• Rolling resistance coefficient: 0.01</li>
                    <li>• No auxiliary power consumption (AC, heating)</li>
                    <li>• Optimal tire pressure</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Motor Characteristics</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Peak power rating used</li>
                    <li>• Assumed motor RPM: 6000 for torque calculation</li>
                    <li>• Constant efficiency across speed range</li>
                    <li>• No power derating due to temperature</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Battery Assumptions</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 100% usable battery capacity</li>
                    <li>• No capacity degradation</li>
                    <li>• Optimal operating temperature</li>
                    <li>• No charging/discharging losses</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Important Note</h4>
                <p className="text-sm text-yellow-700">
                  These calculations provide theoretical estimates under ideal conditions. Real-world performance 
                  will vary based on driving style, weather conditions, terrain, vehicle load, and other factors. 
                  Always refer to manufacturer specifications for official performance figures.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="standards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Industry Standards & References</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Testing Standards</h4>
                  <div className="space-y-3">
                    <div>
                      <Badge variant="outline" className="mb-2">WLTP</Badge>
                      <p className="text-sm text-gray-600">
                        Worldwide Harmonized Light Vehicles Test Procedure - Current EU standard for range and efficiency testing
                      </p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">EPA</Badge>
                      <p className="text-sm text-gray-600">
                        Environmental Protection Agency - US standard for vehicle efficiency and range ratings
                      </p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">NEDC</Badge>
                      <p className="text-sm text-gray-600">
                        New European Driving Cycle - Previous EU standard, still used for comparison
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Performance Benchmarks</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Excellent Range:</span>
                      <span className="text-sm text-gray-600 ml-2">&gt; 500 km</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Good Efficiency:</span>
                      <span className="text-sm text-gray-600 ml-2">&lt; 180 Wh/km</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">High Performance:</span>
                      <span className="text-sm text-gray-600 ml-2">&gt; 300 W/kg</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Sports Car Acceleration:</span>
                      <span className="text-sm text-gray-600 ml-2">&lt; 4.0 seconds (0-100 km/h)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Typical Vehicle Categories</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">City Car:</span>
                      <span className="text-gray-600">150-300 km range</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Compact EV:</span>
                      <span className="text-gray-600">300-450 km range</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Premium EV:</span>
                      <span className="text-gray-600">450-600 km range</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Luxury EV:</span>
                      <span className="text-gray-600">500+ km range</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Reference Sources</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• SAE International Standards</p>
                    <p>• ISO 8715 (Road vehicles - Test methods)</p>
                    <p>• IEC 61851 (Electric vehicle charging)</p>
                    <p>• Automotive engineering handbooks</p>
                    <p>• Manufacturer technical specifications</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormulasSection;

