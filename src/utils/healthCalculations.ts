export function calculateBMI(
  weight: number,
  weightUnit: string,
  height: number,
  heightUnit: string
): number {
  let weightInKg = weight;
  let heightInM = height;

  if (weightUnit === 'lbs') {
    weightInKg = weight * 0.453592;
  }

  if (heightUnit === 'cm') {
    heightInM = height / 100;
  } else if (heightUnit === 'ft/in') {
    heightInM = height * 0.3048;
  }

  const bmi = weightInKg / (heightInM * heightInM);
  return Math.round(bmi * 10) / 10;
}

export function calculateDailyCalories(
  weight: number,
  weightUnit: string,
  height: number,
  heightUnit: string,
  age: number,
  sex: string,
  lifestyle: string,
  goals: string[]
): number {
  let weightInKg = weight;
  let heightInCm = height;

  if (weightUnit === 'lbs') {
    weightInKg = weight * 0.453592;
  }

  if (heightUnit === 'ft/in') {
    heightInCm = height * 30.48;
  }

  let bmr: number;
  if (sex === 'male') {
    bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5;
  } else if (sex === 'female') {
    bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;
  } else {
    bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age - 78;
  }

  let activityMultiplier = 1.2;
  if (lifestyle === 'moderate') {
    activityMultiplier = 1.55;
  } else if (lifestyle === 'active') {
    activityMultiplier = 1.725;
  }

  let tdee = bmr * activityMultiplier;

  if (goals.includes('Lose Weight')) {
    tdee -= 500;
  } else if (goals.includes('Gain Weight')) {
    tdee += 500;
  }

  return Math.round(tdee);
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Optimum range';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Class I obesity';
  if (bmi < 40) return 'Class II obesity';
  return 'Class III obesity';
}

export function getBMIDetails(bmi: number): { category: string; range: string; color: string } {
  if (bmi < 18.5) {
    return { category: 'Underweight', range: 'Less than 18.5', color: 'blue' };
  }
  if (bmi < 25) {
    return { category: 'Optimum range', range: '18.5 to 24.9', color: 'green' };
  }
  if (bmi < 30) {
    return { category: 'Overweight', range: '25 to 29.9', color: 'yellow' };
  }
  if (bmi < 35) {
    return { category: 'Class I obesity', range: '30 to 34.9', color: 'orange' };
  }
  if (bmi < 40) {
    return { category: 'Class II obesity', range: '35 to 39.9', color: 'red' };
  }
  return { category: 'Class III obesity', range: 'More than 40', color: 'red' };
}

export function calculateWeightLossTarget(
  currentWeight: number,
  weightUnit: string,
  height: number,
  heightUnit: string,
  bmi: number
): { targetWeight: number; weightToLose: number; weeks: number; unit: string } | null {
  let weightInKg = currentWeight;
  let heightInM = height;

  if (weightUnit === 'lbs') {
    weightInKg = currentWeight * 0.453592;
  }

  if (heightUnit === 'cm') {
    heightInM = height / 100;
  } else if (heightUnit === 'ft/in') {
    heightInM = height * 0.3048;
  }

  if (bmi <= 24.9) {
    return null;
  }

  const targetBMI = 24.9;
  const targetWeightKg = targetBMI * (heightInM * heightInM);
  const weightToLoseKg = weightInKg - targetWeightKg;

  const safeWeeklyLossKg = 0.5;
  const weeks = Math.ceil(weightToLoseKg / safeWeeklyLossKg);

  if (weightUnit === 'lbs') {
    return {
      targetWeight: Math.round(targetWeightKg / 0.453592),
      weightToLose: Math.round(weightToLoseKg / 0.453592),
      weeks,
      unit: 'lbs'
    };
  }

  return {
    targetWeight: Math.round(targetWeightKg),
    weightToLose: Math.round(weightToLoseKg),
    weeks,
    unit: 'kg'
  };
}
