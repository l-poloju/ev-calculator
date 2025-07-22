import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Download, FileText, Printer } from 'lucide-react'

export default function ExportTool({ vehicleSpecs, results }) {
  const generateReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      vehicleSpecs,
      results,
      calculations: {
        totalWeight: results.totalWeight,
        requiredPower: results.motorPower.requiredPower || 0,
        requiredTorque: results.motorPower.requiredTorque || 0,
        batteryCapacity: results.energyConsumption.batteryCapacity || 0,
        energyConsumption: results.energyConsumption.consumptionWhKm || 0,
        feasibilityScore: results.feasibilityAnalysis.score || 0
      }
    }

    const reportText = `
EV CALCULATOR REPORT
Generated: ${new Date().toLocaleString()}

VEHICLE SPECIFICATIONS:
- Vehicle Mass: ${vehicleSpecs.mass} kg
- Additional Weight: ${vehicleSpecs.additionalWeight} kg
- Total Weight: ${results.totalWeight} kg
- Top Speed: ${vehicleSpecs.topSpeed} km/h
- 0-100 km/h Acceleration: ${vehicleSpecs.acceleration0to100} seconds
- Range: ${vehicleSpecs.range} km
- Tire Radius: ${vehicleSpecs.tireRadius} m
- Drag Coefficient: ${vehicleSpecs.dragCoefficient}
- Frontal Area: ${vehicleSpecs.frontalArea} m²
- Terrain Type: ${vehicleSpecs.terrainType}
- Auxiliary Load: ${vehicleSpecs.auxiliaryLoad}

CALCULATED RESULTS:
- Required Motor Power: ${results.motorPower.requiredPower || 0} kW
- Required Torque: ${results.motorPower.requiredTorque || 0} Nm
- Battery Capacity: ${results.energyConsumption.batteryCapacity || 0} kWh
- Energy Consumption: ${results.energyConsumption.consumptionWhKm || 0} Wh/km
- Power-to-Weight Ratio: ${results.feasibilityAnalysis.powerToWeight || 0} W/kg
- Feasibility Score: ${results.feasibilityAnalysis.score || 0}/100
- Feasibility Rating: ${results.feasibilityAnalysis.rating || 'Unknown'}

VEHICLE DYNAMICS:
- Maximum Theoretical Speed: ${results.vehicleDynamics.maxTheoreticalSpeed || 0} km/h
- Braking Distance (100-0 km/h): ${results.vehicleDynamics.brakingDistance || 0} m
- Cornering Speed (50m radius): ${results.vehicleDynamics.corneringSpeed || 0} km/h

FEASIBILITY ANALYSIS:
${results.feasibilityAnalysis.issues ? results.feasibilityAnalysis.issues.map(issue => `- ${issue}`).join('\n') : 'No issues identified'}

ENGINEERING NOTES:
This report is generated using automotive engineering principles and WLTC-based energy consumption calculations.
The calculations assume standard atmospheric conditions and typical motor/battery efficiencies.
Results should be validated with detailed engineering analysis for production vehicles.
    `

    const blob = new Blob([reportText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ev-calculator-report-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportJSON = () => {
    const data = {
      timestamp: new Date().toISOString(),
      vehicleSpecs,
      results
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ev-calculator-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const printReport = () => {
    window.print()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Export & Reports
        </CardTitle>
        <CardDescription>
          Generate reports and export calculation results
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={generateReport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
          <Button onClick={exportJSON} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export JSON
          </Button>
          <Button onClick={printReport} variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print Page
          </Button>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>• <strong>Download Report:</strong> Generate a comprehensive text report with all calculations and analysis</p>
          <p>• <strong>Export JSON:</strong> Export raw data in JSON format for further analysis or integration</p>
          <p>• <strong>Print Page:</strong> Print the current calculator view for documentation</p>
        </div>
      </CardContent>
    </Card>
  )
}

