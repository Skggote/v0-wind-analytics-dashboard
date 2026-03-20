// Mock wind farm SCADA data generator and KPI calculation system

export interface Turbine {
  id: string;
  name: string;
  farmId: string;
  latitude: number;
  longitude: number;
  capacity: number;
  status: 'operational' | 'maintenance' | 'offline' | 'error';
  lastMaintenanceDate: string;
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  turbineCount: number;
  totalCapacity: number;
  status: 'operational' | 'degraded' | 'offline';
}

export interface SCADAData {
  timestamp: string;
  turbineId: string;
  windSpeed: number;
  windDirection: number;
  temperature: number;
  powerOutput: number;
  rotorRPM: number;
  generatorCurrent: number;
  generatorVoltage: number;
  bladeAngle: number;
  hydraulicPressure: number;
  vibration: number;
  nacelleBearing: number;
}

export interface KPIs {
  // Resource Efficiency
  capacity_factor: number;
  average_power_output: number;
  wind_utilization_rate: number;
  
  // Reliability
  availability: number;
  uptime: number;
  mean_time_to_failure: number;
  mean_time_to_repair: number;
  
  // Financial
  revenue_per_turbine: number;
  energy_sold: number;
  imbalance_costs: number;
  forecast_accuracy: number;
  
  // Health
  health_score: number;
  anomaly_detection_score: number;
  rul_prediction: number;
  maintenance_risk: number;
}

// Generate mock farms
export function generateFarms(): Farm[] {
  return [
    {
      id: 'farm-001',
      name: 'North Ridge Wind Farm',
      location: 'Montana, USA',
      turbineCount: 45,
      totalCapacity: 135,
      status: 'operational',
    },
    {
      id: 'farm-002',
      name: 'Coastal Breeze Farm',
      location: 'California, USA',
      turbineCount: 32,
      totalCapacity: 96,
      status: 'operational',
    },
    {
      id: 'farm-003',
      name: 'Prairie Wind Complex',
      location: 'Texas, USA',
      turbineCount: 58,
      totalCapacity: 174,
      status: 'degraded',
    },
    {
      id: 'farm-004',
      name: 'Alpine Energy Farm',
      location: 'Colorado, USA',
      turbineCount: 28,
      totalCapacity: 84,
      status: 'operational',
    },
  ];
}

// Generate mock turbines for a farm
export function generateTurbines(farmId: string, count: number): Turbine[] {
  const farms = generateFarms();
  const farm = farms.find(f => f.id === farmId);
  if (!farm) return [];

  const turbines: Turbine[] = [];
  const statuses: Array<'operational' | 'maintenance' | 'offline' | 'error'> = [
    'operational',
    'operational',
    'operational',
    'operational',
    'maintenance',
    'offline',
    'error',
  ];

  for (let i = 0; i < count; i++) {
    turbines.push({
      id: `turbine-${farmId}-${String(i + 1).padStart(3, '0')}`,
      name: `Turbine ${i + 1}`,
      farmId,
      latitude: 40.7128 + (Math.random() - 0.5) * 5,
      longitude: -74.006 + (Math.random() - 0.5) * 5,
      capacity: 3,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastMaintenanceDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return turbines;
}

// Generate mock SCADA data
export function generateSCADAData(turbineId: string, hoursBack: number = 24): SCADAData[] {
  const data: SCADAData[] = [];
  const now = Date.now();

  for (let h = hoursBack; h >= 0; h--) {
    const timestamp = new Date(now - h * 60 * 60 * 1000);
    
    // Wind patterns - stronger at night
    const hour = timestamp.getHours();
    const timeOfDay = Math.abs(Math.sin((hour - 12) * Math.PI / 24));
    
    // Realistic wind speed pattern
    const baseWindSpeed = 8 + timeOfDay * 4;
    const windSpeed = Math.max(2, baseWindSpeed + (Math.random() - 0.5) * 3);
    
    // Power output is cubic relationship with wind speed
    const cutInSpeed = 3;
    const ratedSpeed = 12;
    const cutOutSpeed = 25;
    
    let powerOutput = 0;
    if (windSpeed >= cutInSpeed && windSpeed <= ratedSpeed) {
      // Power increases cubically
      powerOutput = (Math.pow(windSpeed - cutInSpeed, 3) / Math.pow(ratedSpeed - cutInSpeed, 3)) * 3000;
    } else if (windSpeed > ratedSpeed && windSpeed < cutOutSpeed) {
      powerOutput = 3000;
    }

    data.push({
      timestamp: timestamp.toISOString(),
      turbineId,
      windSpeed: parseFloat(windSpeed.toFixed(2)),
      windDirection: Math.floor(Math.random() * 360),
      temperature: 5 + Math.random() * 25,
      powerOutput: parseFloat(powerOutput.toFixed(2)),
      rotorRPM: (windSpeed / 25) * 12.1 + (Math.random() - 0.5) * 0.5,
      generatorCurrent: (powerOutput / 3000) * 45 + (Math.random() - 0.5) * 2,
      generatorVoltage: 690 + (Math.random() - 0.5) * 10,
      bladeAngle: (windSpeed / 25) * 25 + (Math.random() - 0.5) * 2,
      hydraulicPressure: 150 + (Math.random() - 0.5) * 20,
      vibration: 0.5 + (Math.random() - 0.5) * 0.3,
      nacelleBearing: 45 + Math.random() * 20,
    });
  }

  return data;
}

// Calculate KPIs from SCADA data
export function calculateKPIs(scadaData: SCADAData[], turbineCapacity: number = 3): KPIs {
  if (scadaData.length === 0) {
    return getDefaultKPIs();
  }

  // Resource Efficiency
  const totalPossibleEnergy = (scadaData.length / 24) * turbineCapacity * 24;
  const totalActualEnergy = scadaData.reduce((sum, d) => sum + d.powerOutput, 0) / 1000; // Convert to MWh
  const capacity_factor = totalActualEnergy / totalPossibleEnergy * 100;
  
  const average_power_output = (scadaData.reduce((sum, d) => sum + d.powerOutput, 0) / scadaData.length) || 0;
  
  const operationalHours = scadaData.filter(d => d.powerOutput > 100).length;
  const wind_utilization_rate = (operationalHours / scadaData.length) * 100;

  // Reliability
  const uptime_hours = scadaData.length / 24;
  const availability = 98 + Math.random() * 1.5;
  const uptime = 99 + Math.random() * 0.8;
  const mean_time_to_failure = 8760 * (availability / 100);
  const mean_time_to_repair = 24 + Math.random() * 48;

  // Financial
  const energy_sold = totalActualEnergy;
  const electricityPrice = 45 + Math.random() * 15; // $/MWh
  const revenue_per_turbine = energy_sold * electricityPrice;
  
  const avgWindSpeed = scadaData.reduce((sum, d) => sum + d.windSpeed, 0) / scadaData.length;
  const forecast_accuracy = 92 + Math.random() * 5 - Math.abs(avgWindSpeed - 10) * 0.5;
  
  const imbalance_costs = revenue_per_turbine * (Math.random() * 0.05); // 0-5% of revenue

  // Health
  const avgVibration = scadaData.reduce((sum, d) => sum + d.vibration, 0) / scadaData.length;
  const avgBearing = scadaData.reduce((sum, d) => sum + d.nacelleBearing, 0) / scadaData.length;
  
  const vibration_score = Math.max(0, 100 - (avgVibration - 0.5) * 50);
  const bearing_score = Math.max(0, 100 - (avgBearing - 55) * 2);
  
  const health_score = (vibration_score * 0.4 + bearing_score * 0.6);
  const anomaly_detection_score = 95 + Math.random() * 5;
  
  // RUL in months
  const rul_prediction = Math.max(6, 60 - (100 - health_score) * 0.5);
  const maintenance_risk = 100 - health_score;

  return {
    capacity_factor: parseFloat(capacity_factor.toFixed(2)),
    average_power_output: parseFloat(average_power_output.toFixed(2)),
    wind_utilization_rate: parseFloat(wind_utilization_rate.toFixed(2)),
    availability: parseFloat(availability.toFixed(2)),
    uptime: parseFloat(uptime.toFixed(2)),
    mean_time_to_failure: parseFloat(mean_time_to_failure.toFixed(2)),
    mean_time_to_repair: parseFloat(mean_time_to_repair.toFixed(2)),
    revenue_per_turbine: parseFloat(revenue_per_turbine.toFixed(2)),
    energy_sold: parseFloat(energy_sold.toFixed(2)),
    imbalance_costs: parseFloat(imbalance_costs.toFixed(2)),
    forecast_accuracy: parseFloat(forecast_accuracy.toFixed(2)),
    health_score: parseFloat(health_score.toFixed(2)),
    anomaly_detection_score: parseFloat(anomaly_detection_score.toFixed(2)),
    rul_prediction: parseFloat(rul_prediction.toFixed(2)),
    maintenance_risk: parseFloat(maintenance_risk.toFixed(2)),
  };
}

function getDefaultKPIs(): KPIs {
  return {
    capacity_factor: 0,
    average_power_output: 0,
    wind_utilization_rate: 0,
    availability: 0,
    uptime: 0,
    mean_time_to_failure: 0,
    mean_time_to_repair: 0,
    revenue_per_turbine: 0,
    energy_sold: 0,
    imbalance_costs: 0,
    forecast_accuracy: 0,
    health_score: 0,
    anomaly_detection_score: 0,
    rul_prediction: 0,
    maintenance_risk: 0,
  };
}

// Get time series data for charts
export function getTimeSeriesData(scadaData: SCADAData[], aggregateBy: 'hour' | 'day' = 'hour') {
  const aggregated: { [key: string]: SCADAData[] } = {};

  scadaData.forEach(point => {
    const date = new Date(point.timestamp);
    let key: string;

    if (aggregateBy === 'hour') {
      key = date.toISOString().slice(0, 13) + ':00:00Z';
    } else {
      key = date.toISOString().slice(0, 10);
    }

    if (!aggregated[key]) aggregated[key] = [];
    aggregated[key].push(point);
  });

  return Object.entries(aggregated).map(([time, points]) => ({
    time,
    avgWindSpeed: parseFloat((points.reduce((s, p) => s + p.windSpeed, 0) / points.length).toFixed(2)),
    avgPower: parseFloat((points.reduce((s, p) => s + p.powerOutput, 0) / points.length).toFixed(2)),
    avgTemp: parseFloat((points.reduce((s, p) => s + p.temperature, 0) / points.length).toFixed(2)),
    maxVibration: Math.max(...points.map(p => p.vibration)),
  }));
}

// Generate forecast data
export function generateForecast(days: number = 7) {
  const forecast = [];
  const now = new Date();

  for (let d = 0; d < days; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() + d);

    forecast.push({
      date: date.toISOString().slice(0, 10),
      forecastedPower: Math.max(500, 2000 + Math.random() * 1500),
      confidence: 85 + Math.random() * 10,
      forecastRevenue: Math.max(20000, 60000 + Math.random() * 40000),
    });
  }

  return forecast;
}

// Generate anomaly events
export function generateAnomalies(turbineCount: number = 100) {
  const anomalies = [];
  const anomalyTypes = [
    'High vibration detected',
    'Temperature spike',
    'Rotor imbalance',
    'Yaw system malfunction',
    'Blade angle servo error',
    'Generator bearing wear',
    'Hydraulic pressure drop',
  ];

  for (let i = 0; i < Math.floor(turbineCount * 0.05); i++) {
    anomalies.push({
      id: `anomaly-${i}`,
      turbineId: `turbine-farm-001-${String(Math.floor(Math.random() * turbineCount) + 1).padStart(3, '0')}`,
      type: anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)],
      severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      value: (Math.random() * 100).toFixed(2),
      threshold: (50 + Math.random() * 50).toFixed(2),
    });
  }

  return anomalies;
}
