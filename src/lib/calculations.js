// Advanced EV Calculation Engine
// Based on automotive engineering principles and WLTC standards

export const CONSTANTS = {
  // Physical constants
  GRAVITY: 9.81, // m/s²
  AIR_DENSITY: 1.225, // kg/m³ at sea level, 15°C
  
  // Rolling resistance coefficients by terrain type
  ROLLING_RESISTANCE: {
    urban: 0.012,
    highway: 0.008,
    mixed: 0.010,
    offroad: 0.025
  },
  
  // Motor efficiency factors
  MOTOR_EFFICIENCY: {
    peak: 0.95,
    average: 0.85,
    low_speed: 0.75
  },
  
  // Battery efficiency factors
  BATTERY_EFFICIENCY: {
    charge: 0.95,
    discharge: 0.95,
    thermal_loss: 0.98
  },
  
  // Regenerative braking efficiency
  REGEN_EFFICIENCY: 0.7,
  
  // Auxiliary power consumption (W)
  AUXILIARY_POWER: {
    lights: 200,
    hvac: 2000,
    electronics: 300,
    base: 500
  }
}

/**
 * Calculate rolling resistance force
 * @param {number} mass - Vehicle mass in kg
 * @param {string} terrainType - Type of terrain (urban, highway, mixed, offroad)
 * @param {number} grade - Road grade in percentage (default 0)
 * @returns {number} Rolling resistance force in N
 */
export function calculateRollingResistance(mass, terrainType = 'mixed', grade = 0) {
  const crr = CONSTANTS.ROLLING_RESISTANCE[terrainType] || CONSTANTS.ROLLING_RESISTANCE.mixed
  const gradeRadians = Math.atan(grade / 100)
  return crr * mass * CONSTANTS.GRAVITY * Math.cos(gradeRadians)
}

/**
 * Calculate aerodynamic drag force
 * @param {number} speed - Speed in m/s
 * @param {number} dragCoefficient - Drag coefficient (Cd)
 * @param {number} frontalArea - Frontal area in m²
 * @param {number} airDensity - Air density in kg/m³ (optional)
 * @returns {number} Drag force in N
 */
export function calculateAerodynamicDrag(speed, dragCoefficient, frontalArea, airDensity = CONSTANTS.AIR_DENSITY) {
  return 0.5 * airDensity * dragCoefficient * frontalArea * Math.pow(speed, 2)
}

/**
 * Calculate acceleration force
 * @param {number} mass - Vehicle mass in kg
 * @param {number} acceleration - Acceleration in m/s²
 * @returns {number} Acceleration force in N
 */
export function calculateAccelerationForce(mass, acceleration) {
  return mass * acceleration
}

/**
 * Calculate grade resistance force
 * @param {number} mass - Vehicle mass in kg
 * @param {number} grade - Road grade in percentage
 * @returns {number} Grade resistance force in N
 */
export function calculateGradeResistance(mass, grade) {
  const gradeRadians = Math.atan(grade / 100)
  return mass * CONSTANTS.GRAVITY * Math.sin(gradeRadians)
}

/**
 * Calculate total tractive force required
 * @param {Object} params - Parameters object
 * @returns {number} Total tractive force in N
 */
export function calculateTractiveForce(params) {
  const {
    mass,
    speed, // m/s
    acceleration = 0,
    dragCoefficient,
    frontalArea,
    terrainType = 'mixed',
    grade = 0
  } = params

  const rollingResistance = calculateRollingResistance(mass, terrainType, grade)
  const aerodynamicDrag = calculateAerodynamicDrag(speed, dragCoefficient, frontalArea)
  const accelerationForce = calculateAccelerationForce(mass, acceleration)
  const gradeResistance = calculateGradeResistance(mass, grade)

  return rollingResistance + aerodynamicDrag + accelerationForce + gradeResistance
}

/**
 * Calculate required motor power
 * @param {Object} params - Parameters object
 * @returns {Object} Power calculations
 */
export function calculateMotorPower(params) {
  const {
    mass,
    topSpeed, // km/h
    acceleration0to100, // seconds
    dragCoefficient,
    frontalArea,
    terrainType = 'mixed',
    tireRadius = 0.32
  } = params

  const topSpeedMs = topSpeed / 3.6 // Convert to m/s
  const accelerationMs2 = (100 / 3.6) / acceleration0to100 // m/s² for 0-100 km/h

  // Power for constant speed (cruise power)
  const cruiseForce = calculateTractiveForce({
    mass,
    speed: topSpeedMs,
    acceleration: 0,
    dragCoefficient,
    frontalArea,
    terrainType
  })
  const cruisePower = (cruiseForce * topSpeedMs) / 1000 // kW

  // Power for acceleration
  const accelForce = calculateTractiveForce({
    mass,
    speed: topSpeedMs / 2, // Average speed during acceleration
    acceleration: accelerationMs2,
    dragCoefficient,
    frontalArea,
    terrainType
  })
  const accelPower = (accelForce * (topSpeedMs / 2)) / 1000 // kW

  // Required motor power (accounting for efficiency)
  const requiredPower = Math.max(cruisePower, accelPower) / CONSTANTS.MOTOR_EFFICIENCY.average

  // Calculate torque
  const wheelSpeed = topSpeedMs / tireRadius // rad/s
  const motorSpeed = wheelSpeed * 10 // Assuming 10:1 gear ratio
  const requiredTorque = (requiredPower * 1000) / motorSpeed

  return {
    cruisePower: Math.round(cruisePower),
    accelerationPower: Math.round(accelPower),
    requiredPower: Math.round(requiredPower),
    requiredTorque: Math.round(requiredTorque),
    motorSpeed: Math.round(motorSpeed)
  }
}

/**
 * Calculate energy consumption using WLTC-based methodology
 * @param {Object} params - Parameters object
 * @returns {Object} Energy consumption calculations
 */
export function calculateEnergyConsumption(params) {
  const {
    mass,
    dragCoefficient,
    frontalArea,
    terrainType = 'mixed',
    range,
    auxiliaryLoad = 'normal'
  } = params

  // Simulate WLTC cycle speeds (simplified)
  const wltcSpeeds = [
    { speed: 20, time: 589, weight: 0.23 }, // Low speed
    { speed: 40, time: 433, weight: 0.25 }, // Medium speed
    { speed: 60, time: 455, weight: 0.26 }, // High speed
    { speed: 80, time: 323, weight: 0.26 }  // Extra high speed
  ]

  let totalEnergy = 0
  let totalTime = 0

  wltcSpeeds.forEach(phase => {
    const speedMs = phase.speed / 3.6
    const force = calculateTractiveForce({
      mass,
      speed: speedMs,
      acceleration: 0,
      dragCoefficient,
      frontalArea,
      terrainType
    })
    
    const power = (force * speedMs) / 1000 // kW
    const energy = power * (phase.time / 3600) * phase.weight // kWh
    totalEnergy += energy
    totalTime += phase.time * phase.weight
  })

  // Add auxiliary power consumption
  const auxPowerKw = CONSTANTS.AUXILIARY_POWER.base / 1000
  if (auxiliaryLoad === 'high') {
    totalEnergy += (CONSTANTS.AUXILIARY_POWER.hvac / 1000) * (totalTime / 3600)
  }
  totalEnergy += auxPowerKw * (totalTime / 3600)

  // Account for motor and battery efficiency
  const totalEfficiency = CONSTANTS.MOTOR_EFFICIENCY.average * 
                         CONSTANTS.BATTERY_EFFICIENCY.discharge * 
                         CONSTANTS.BATTERY_EFFICIENCY.thermal_loss

  const consumptionWhKm = (totalEnergy / totalEfficiency) * 1000 / 100 // Wh/km (WLTC is ~100km)
  const batteryCapacity = (consumptionWhKm * range) / 1000 // kWh

  return {
    consumptionWhKm: Math.round(consumptionWhKm),
    batteryCapacity: Math.round(batteryCapacity * 10) / 10,
    totalEfficiency: Math.round(totalEfficiency * 100),
    auxiliaryConsumption: Math.round(auxPowerKw * 1000) // W
  }
}

/**
 * Calculate vehicle dynamics parameters
 * @param {Object} params - Parameters object
 * @returns {Object} Vehicle dynamics calculations
 */
export function calculateVehicleDynamics(params) {
  const {
    mass,
    tireRadius,
    dragCoefficient,
    frontalArea,
    topSpeed,
    acceleration0to100
  } = params

  const topSpeedMs = topSpeed / 3.6
  const accelerationMs2 = (100 / 3.6) / acceleration0to100

  // Calculate maximum theoretical speed (drag limited)
  const maxTheoreticalSpeed = Math.sqrt(
    (2 * mass * CONSTANTS.GRAVITY * CONSTANTS.ROLLING_RESISTANCE.highway) /
    (CONSTANTS.AIR_DENSITY * dragCoefficient * frontalArea)
  ) * 3.6 // km/h

  // Calculate braking distance (from 100 km/h)
  const brakingSpeed = 100 / 3.6 // m/s
  const brakingDeceleration = 8 // m/s² (typical for good brakes)
  const brakingDistance = Math.pow(brakingSpeed, 2) / (2 * brakingDeceleration)

  // Calculate cornering performance (simplified)
  const lateralAcceleration = 0.8 * CONSTANTS.GRAVITY // Typical for passenger cars
  const corneringSpeed = Math.sqrt(lateralAcceleration * 50) * 3.6 // km/h for 50m radius

  return {
    maxTheoreticalSpeed: Math.round(maxTheoreticalSpeed),
    brakingDistance: Math.round(brakingDistance),
    corneringSpeed: Math.round(corneringSpeed),
    powerToWeight: Math.round((params.requiredPower || 0) / mass * 1000), // W/kg
    accelerationMs2: Math.round(accelerationMs2 * 100) / 100
  }
}

/**
 * Calculate feasibility score based on multiple factors
 * @param {Object} results - All calculation results
 * @param {Object} specs - Vehicle specifications
 * @returns {Object} Feasibility analysis
 */
export function calculateFeasibilityScore(results, specs) {
  let score = 100
  const issues = []

  // Power density check
  const powerToWeight = results.requiredPower / specs.mass * 1000 // W/kg
  if (powerToWeight > 300) {
    score -= 15
    issues.push('High power-to-weight ratio may increase cost')
  }

  // Battery capacity check
  if (results.batteryCapacity > 100) {
    score -= 20
    issues.push('Large battery capacity increases weight and cost')
  }

  // Energy consumption check
  if (results.consumptionWhKm > 250) {
    score -= 15
    issues.push('High energy consumption reduces efficiency')
  }

  // Acceleration performance check
  if (specs.acceleration0to100 > 12) {
    score -= 10
    issues.push('Slow acceleration may not meet market expectations')
  }

  // Weight check
  const totalWeight = specs.mass + specs.additionalWeight
  if (totalWeight > 2500) {
    score -= 15
    issues.push('High vehicle weight affects performance and efficiency')
  }

  // Aerodynamics check
  if (specs.dragCoefficient > 0.35) {
    score -= 10
    issues.push('High drag coefficient reduces efficiency at high speeds')
  }

  // Range vs battery size efficiency
  const rangeEfficiency = specs.range / results.batteryCapacity
  if (rangeEfficiency < 4) {
    score -= 10
    issues.push('Poor range-to-battery ratio indicates inefficiency')
  }

  score = Math.max(0, score)

  let rating = 'Poor'
  if (score >= 85) rating = 'Excellent'
  else if (score >= 70) rating = 'Good'
  else if (score >= 55) rating = 'Fair'

  return {
    score,
    rating,
    issues,
    powerToWeight: Math.round(powerToWeight),
    rangeEfficiency: Math.round(rangeEfficiency * 10) / 10
  }
}

/**
 * Generate power curve data for visualization
 * @param {Object} params - Parameters object
 * @returns {Array} Power curve data points
 */
export function generatePowerCurve(params) {
  const data = []
  const maxSpeed = params.topSpeed || 200
  
  for (let speed = 10; speed <= maxSpeed; speed += 10) {
    const speedMs = speed / 3.6
    const force = calculateTractiveForce({
      ...params,
      speed: speedMs,
      acceleration: 0
    })
    
    const power = (force * speedMs) / 1000 // kW
    const efficiency = speed < 50 ? 
      CONSTANTS.MOTOR_EFFICIENCY.low_speed : 
      CONSTANTS.MOTOR_EFFICIENCY.average
    
    data.push({
      speed,
      power: Math.round(power),
      efficiency: Math.round(efficiency * 100),
      force: Math.round(force)
    })
  }
  
  return data
}

