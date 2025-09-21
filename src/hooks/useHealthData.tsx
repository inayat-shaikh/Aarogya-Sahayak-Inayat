import React, { createContext, useContext, useState, useEffect } from 'react';

// Types for health data
export interface HealthMetrics {
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  bloodSugar: number;
  weight: number;
  date: string;
  timestamp: Date;
}

export interface HealthTrend {
  date: string;
  bloodPressure: number;
  heartRate: number;
  bloodSugar: number;
  weight: number;
}

interface HealthDataContextType {
  currentMetrics: HealthMetrics;
  healthTrends: HealthTrend[];
  updateMetrics: (metrics: Partial<HealthMetrics>) => void;
  refreshData: () => void;
}

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

// Generate realistic random health data
const generateRealisticHealthData = (): HealthMetrics => {
  const now = new Date();
  
  // Generate realistic ranges for a typical adult
  const bloodPressureSystolic = Math.floor(Math.random() * (140 - 110) + 110); // 110-140 mmHg
  const bloodPressureDiastolic = Math.floor(Math.random() * (90 - 70) + 70);   // 70-90 mmHg
  const heartRate = Math.floor(Math.random() * (100 - 60) + 60);               // 60-100 BPM
  const bloodSugar = Math.floor(Math.random() * (140 - 80) + 80);              // 80-140 mg/dL
  const weight = Math.round((Math.random() * (85 - 55) + 55) * 10) / 10;       // 55-85 kg

  return {
    bloodPressureSystolic,
    bloodPressureDiastolic,
    heartRate,
    bloodSugar,
    weight,
    date: now.toLocaleDateString(),
    timestamp: now
  };
};

// Generate health trends for the last 30 days
const generateHealthTrends = (): HealthTrend[] => {
  const trends: HealthTrend[] = [];
  const today = new Date();
  
  // Base values for realistic progression
  let baseWeight = 68 + Math.random() * 10; // 68-78 kg base
  let baseSystolic = 115 + Math.random() * 15; // 115-130 base
  let baseHeartRate = 70 + Math.random() * 15; // 70-85 base
  let baseBloodSugar = 95 + Math.random() * 20; // 95-115 base

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Add small variations to create realistic trends
    const weightVariation = (Math.random() - 0.5) * 2; // ±1 kg variation
    const systolicVariation = (Math.random() - 0.5) * 10; // ±5 mmHg variation
    const heartRateVariation = (Math.random() - 0.5) * 10; // ±5 BPM variation
    const bloodSugarVariation = (Math.random() - 0.5) * 20; // ±10 mg/dL variation

    trends.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      bloodPressure: Math.round(baseSystolic + systolicVariation),
      heartRate: Math.round(baseHeartRate + heartRateVariation),
      bloodSugar: Math.round(baseBloodSugar + bloodSugarVariation),
      weight: Math.round((baseWeight + weightVariation) * 10) / 10
    });

    // Gradual trend changes
    baseWeight += (Math.random() - 0.5) * 0.1;
    baseSystolic += (Math.random() - 0.5) * 0.5;
    baseHeartRate += (Math.random() - 0.5) * 0.3;
    baseBloodSugar += (Math.random() - 0.5) * 1;
  }

  return trends;
};

export const HealthDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMetrics, setCurrentMetrics] = useState<HealthMetrics>(() => generateRealisticHealthData());
  const [healthTrends, setHealthTrends] = useState<HealthTrend[]>(() => generateHealthTrends());

  const updateMetrics = (newMetrics: Partial<HealthMetrics>) => {
    setCurrentMetrics(prev => ({
      ...prev,
      ...newMetrics,
      timestamp: new Date(),
      date: new Date().toLocaleDateString()
    }));
  };

  const refreshData = () => {
    setCurrentMetrics(generateRealisticHealthData());
    setHealthTrends(generateHealthTrends());
  };

  // Update current metrics to match the latest trend data
  useEffect(() => {
    if (healthTrends.length > 0) {
      const latestTrend = healthTrends[healthTrends.length - 1];
      setCurrentMetrics(prev => ({
        ...prev,
        bloodPressureSystolic: latestTrend.bloodPressure,
        bloodPressureDiastolic: Math.round(latestTrend.bloodPressure * 0.65), // Realistic diastolic ratio
        heartRate: latestTrend.heartRate,
        bloodSugar: latestTrend.bloodSugar,
        weight: latestTrend.weight
      }));
    }
  }, [healthTrends]);

  const value: HealthDataContextType = {
    currentMetrics,
    healthTrends,
    updateMetrics,
    refreshData
  };

  return (
    <HealthDataContext.Provider value={value}>
      {children}
    </HealthDataContext.Provider>
  );
};

export const useHealthData = (): HealthDataContextType => {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
};

export default HealthDataProvider;

