export interface FormData {
  age: number;
  symptoms: string[];
  conditions: string[];
  smoking: "Non-Smoker" | "Former Smoker" | "Current Smoker";
  alcohol: "None" | "Occasional" | "Regular" | "Heavy";
  activity: "Sedentary" | "Light" | "Moderate" | "Active";
  familyHistory: string[];
}

export interface ConditionRiskDetail {
  conditionName: string;
  riskLevel: "Low" | "Moderate" | "High" | "Critical";
  score: number;
}

export interface RiskResult {
  overallRiskLevel: "Low" | "Moderate" | "High" | "Critical";
  overallScore: number;
  conditionRisks: ConditionRiskDetail[];
  earlyWarningAlerts: string[];
  recommendations: string[];
}

export function getAgeBucket(age: number): string {
  if (age < 18) return "Under 18";
  if (age <= 30) return "18-30";
  if (age <= 45) return "31-45";
  if (age <= 60) return "46-60";
  if (age <= 75) return "61-75";
  return "76+";
}

function scoreToLevel(score: number): "Low" | "Moderate" | "High" | "Critical" {
  if (score <= 30) return "Low";
  if (score <= 55) return "Moderate";
  if (score <= 75) return "High";
  return "Critical";
}

export function assessRisk(data: FormData): RiskResult {
  const {
    age,
    symptoms,
    conditions,
    smoking,
    alcohol,
    activity,
    familyHistory,
  } = data;
  const ageBucket = getAgeBucket(age);

  // ─── Cardiovascular Disease ───────────────────────────────────────────────
  let cardioScore = 0;
  if (ageBucket === "46-60") cardioScore += 15;
  else if (ageBucket === "61-75") cardioScore += 25;
  else if (ageBucket === "76+") cardioScore += 35;

  if (symptoms.includes("Chest Pain")) cardioScore += 20;
  if (symptoms.includes("Shortness of Breath")) cardioScore += 15;
  if (symptoms.includes("Rapid Heartbeat")) cardioScore += 15;
  if (symptoms.includes("Dizziness")) cardioScore += 10;
  if (symptoms.includes("Swollen Legs")) cardioScore += 10;

  if (conditions.includes("Heart Disease")) cardioScore += 30;
  if (conditions.includes("Hypertension")) cardioScore += 20;
  if (conditions.includes("High Cholesterol")) cardioScore += 15;
  if (conditions.includes("Obesity")) cardioScore += 10;
  if (conditions.includes("Diabetes")) cardioScore += 10;

  if (smoking === "Current Smoker") cardioScore += 20;
  else if (smoking === "Former Smoker") cardioScore += 10;
  if (alcohol === "Heavy") cardioScore += 15;
  if (activity === "Sedentary") cardioScore += 10;

  if (familyHistory.includes("Heart Disease")) cardioScore += 15;
  if (familyHistory.includes("Hypertension")) cardioScore += 10;

  // ─── Diabetes ─────────────────────────────────────────────────────────────
  let diabetesScore = 0;
  if (ageBucket === "31-45") diabetesScore += 10;
  else if (ageBucket === "46-60") diabetesScore += 20;
  else if (ageBucket === "61-75" || ageBucket === "76+") diabetesScore += 25;

  if (symptoms.includes("Excessive Thirst")) diabetesScore += 25;
  if (symptoms.includes("Frequent Urination")) diabetesScore += 25;
  if (symptoms.includes("Fatigue")) diabetesScore += 10;
  if (symptoms.includes("Blurred Vision")) diabetesScore += 15;
  if (symptoms.includes("Numbness/Tingling")) diabetesScore += 15;

  if (conditions.includes("Diabetes")) diabetesScore += 40;
  if (conditions.includes("Obesity")) diabetesScore += 20;
  if (conditions.includes("High Cholesterol")) diabetesScore += 10;

  if (activity === "Sedentary") diabetesScore += 15;

  if (familyHistory.includes("Diabetes")) diabetesScore += 20;

  // ─── Respiratory Issues ───────────────────────────────────────────────────
  let respScore = 0;
  if (ageBucket === "Under 18") respScore += 5;
  else if (ageBucket === "61-75" || ageBucket === "76+") respScore += 15;

  if (symptoms.includes("Cough")) respScore += 15;
  if (symptoms.includes("Shortness of Breath")) respScore += 20;
  if (symptoms.includes("Fever")) respScore += 10;
  if (symptoms.includes("Fatigue")) respScore += 10;

  if (conditions.includes("Asthma")) respScore += 30;
  if (conditions.includes("Heart Disease")) respScore += 10;

  if (smoking === "Current Smoker") respScore += 25;
  else if (smoking === "Former Smoker") respScore += 15;
  if (alcohol === "Heavy") respScore += 5;

  // ─── Hypertension ─────────────────────────────────────────────────────────
  let hyperScore = 0;
  if (ageBucket === "46-60") hyperScore += 15;
  else if (ageBucket === "61-75" || ageBucket === "76+") hyperScore += 25;

  if (symptoms.includes("Headache")) hyperScore += 15;
  if (symptoms.includes("Dizziness")) hyperScore += 15;
  if (symptoms.includes("Blurred Vision")) hyperScore += 10;
  if (symptoms.includes("Nausea")) hyperScore += 5;

  if (conditions.includes("Hypertension")) hyperScore += 40;
  if (conditions.includes("Kidney Disease")) hyperScore += 20;
  if (conditions.includes("Obesity")) hyperScore += 15;
  if (conditions.includes("Diabetes")) hyperScore += 10;
  if (conditions.includes("High Cholesterol")) hyperScore += 10;

  if (smoking === "Current Smoker") hyperScore += 15;
  if (alcohol === "Heavy") hyperScore += 20;
  if (activity === "Sedentary") hyperScore += 10;

  if (familyHistory.includes("Hypertension")) hyperScore += 15;
  if (familyHistory.includes("Stroke")) hyperScore += 10;

  // ─── General Health Risk ──────────────────────────────────────────────────
  let generalScore = 0;
  generalScore += symptoms.length * 5;
  generalScore += conditions.length * 8;
  if (ageBucket === "61-75" || ageBucket === "76+") generalScore += 10;

  const earlyWarningAlerts: string[] = [];

  if (
    symptoms.includes("Night Sweats") &&
    symptoms.includes("Fatigue") &&
    symptoms.includes("Loss of Appetite")
  ) {
    generalScore += 15;
    earlyWarningAlerts.push(
      "Cancer Alert: The combination of night sweats, fatigue, and loss of appetite may indicate a serious condition. Please consult a doctor immediately.",
    );
  }

  if (
    symptoms.includes("Fever") &&
    symptoms.includes("Cough") &&
    symptoms.includes("Shortness of Breath")
  ) {
    generalScore += 20;
    earlyWarningAlerts.push(
      "Respiratory Emergency: Fever, cough, and shortness of breath together may indicate a serious respiratory infection. Seek medical attention promptly.",
    );
  }

  if (
    symptoms.includes("Chest Pain") &&
    symptoms.includes("Rapid Heartbeat") &&
    symptoms.includes("Shortness of Breath")
  ) {
    generalScore += 25;
    earlyWarningAlerts.push(
      "Cardiac Alert: Chest pain, rapid heartbeat, and shortness of breath together are signs of a possible cardiac emergency. Call emergency services now.",
    );
  }

  // ─── Overall ──────────────────────────────────────────────────────────────
  const allScores = [
    cardioScore,
    diabetesScore,
    respScore,
    hyperScore,
    generalScore,
  ];
  const overallScore = Math.max(...allScores);
  const overallRiskLevel = scoreToLevel(overallScore);

  const conditionRisks: ConditionRiskDetail[] = [
    {
      conditionName: "Cardiovascular Disease",
      riskLevel: scoreToLevel(cardioScore),
      score: cardioScore,
    },
    {
      conditionName: "Diabetes",
      riskLevel: scoreToLevel(diabetesScore),
      score: diabetesScore,
    },
    {
      conditionName: "Respiratory Issues",
      riskLevel: scoreToLevel(respScore),
      score: respScore,
    },
    {
      conditionName: "Hypertension",
      riskLevel: scoreToLevel(hyperScore),
      score: hyperScore,
    },
    {
      conditionName: "General Health Risk",
      riskLevel: scoreToLevel(generalScore),
      score: generalScore,
    },
  ];

  // ─── Recommendations ──────────────────────────────────────────────────────
  const recommendations: string[] = [];

  const cardioLevel = scoreToLevel(cardioScore);
  const diabetesLevel = scoreToLevel(diabetesScore);
  const respLevel = scoreToLevel(respScore);

  if (cardioLevel === "Critical") {
    recommendations.push(
      "Seek emergency medical attention immediately. Call emergency services.",
    );
  } else if (cardioLevel === "High") {
    recommendations.push(
      "Consult a cardiologist within 1-2 weeks. Avoid strenuous activity.",
    );
  }

  if (diabetesLevel === "High" || diabetesLevel === "Critical") {
    recommendations.push(
      "Visit a doctor for blood sugar testing. Monitor your diet closely.",
    );
  }

  if (respLevel === "High" && smoking === "Current Smoker") {
    recommendations.push("Stop smoking immediately. Consult a pulmonologist.");
  }

  if (
    activity === "Sedentary" &&
    (overallRiskLevel === "Moderate" ||
      overallRiskLevel === "High" ||
      overallRiskLevel === "Critical")
  ) {
    recommendations.push(
      "Increase physical activity to at least 30 minutes of walking daily.",
    );
  }

  if (overallRiskLevel === "Moderate" && recommendations.length === 0) {
    recommendations.push(
      "Schedule a routine health check-up within the next month.",
    );
  }

  if (overallRiskLevel === "Low") {
    recommendations.push(
      "Maintain your healthy lifestyle. Annual check-up recommended.",
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Schedule a routine health check-up within the next month.",
    );
  }

  return {
    overallRiskLevel,
    overallScore,
    conditionRisks,
    earlyWarningAlerts,
    recommendations,
  };
}
