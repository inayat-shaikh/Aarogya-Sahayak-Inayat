// Helper functions for health status assessment

export const getBloodPressureStatus = (systolic: number, diastolic: number): { status: string; color: string } => {
  if (systolic >= 140 || diastolic >= 90) {
    return { status: 'High', color: 'text-red-600' };
  } else if (systolic >= 130 || diastolic >= 80) {
    return { status: 'Elevated', color: 'text-orange-600' };
  } else if (systolic >= 120 || diastolic >= 80) {
    return { status: 'Normal High', color: 'text-yellow-600' };
  } else {
    return { status: 'Normal', color: 'text-green-600' };
  }
};

export const getHeartRateStatus = (heartRate: number): { status: string; color: string } => {
  if (heartRate < 60) {
    return { status: 'Low', color: 'text-blue-600' };
  } else if (heartRate > 100) {
    return { status: 'High', color: 'text-red-600' };
  } else {
    return { status: 'Normal', color: 'text-green-600' };
  }
};

export const getBloodSugarStatus = (bloodSugar: number): { status: string; color: string } => {
  if (bloodSugar < 70) {
    return { status: 'Low', color: 'text-blue-600' };
  } else if (bloodSugar > 140) {
    return { status: 'High', color: 'text-red-600' };
  } else if (bloodSugar > 100) {
    return { status: 'Elevated', color: 'text-orange-600' };
  } else {
    return { status: 'Normal', color: 'text-green-600' };
  }
};

export const getWeightStatus = (weight: number, height: number = 170): { status: string; color: string; bmi: number } => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  if (bmi < 18.5) {
    return { status: 'Underweight', color: 'text-blue-600', bmi: Math.round(bmi * 10) / 10 };
  } else if (bmi > 30) {
    return { status: 'Obese', color: 'text-red-600', bmi: Math.round(bmi * 10) / 10 };
  } else if (bmi > 25) {
    return { status: 'Overweight', color: 'text-orange-600', bmi: Math.round(bmi * 10) / 10 };
  } else {
    return { status: 'Normal', color: 'text-green-600', bmi: Math.round(bmi * 10) / 10 };
  }
};
