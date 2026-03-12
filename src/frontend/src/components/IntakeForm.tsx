import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  ArrowRight,
  Brain,
  ChevronLeft,
  ChevronRight,
  Cigarette,
  Droplets,
  Dumbbell,
  Eye,
  Flame,
  Heart,
  HeartPulse,
  MoveHorizontal,
  ShieldCheck,
  Stethoscope,
  Sun,
  Thermometer,
  User,
  Waves,
  Wind,
  Wine,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { FormData, RiskResult } from "../riskEngine";
import { assessRisk } from "../riskEngine";
import SDGBadges from "./SDGBadges";

const SYMPTOM_ICONS: Record<string, React.ElementType> = {
  Fever: Thermometer,
  Fatigue: Zap,
  "Chest Pain": Heart,
  "Shortness of Breath": Wind,
  Headache: Brain,
  Dizziness: Waves,
  Nausea: Flame,
  "Joint Pain": Activity,
  "Skin Rash": Sun,
  Cough: Wind,
  "Blurred Vision": Eye,
  "Excessive Thirst": Droplets,
  "Frequent Urination": Activity,
  "Swollen Legs": MoveHorizontal,
  "Rapid Heartbeat": HeartPulse,
  "Back Pain": Activity,
  "Abdominal Pain": Activity,
  "Loss of Appetite": Flame,
  "Night Sweats": Droplets,
  "Numbness/Tingling": Zap,
};

const SYMPTOMS = [
  "Fever",
  "Fatigue",
  "Chest Pain",
  "Shortness of Breath",
  "Headache",
  "Dizziness",
  "Nausea",
  "Joint Pain",
  "Skin Rash",
  "Cough",
  "Blurred Vision",
  "Excessive Thirst",
  "Frequent Urination",
  "Swollen Legs",
  "Rapid Heartbeat",
  "Back Pain",
  "Abdominal Pain",
  "Loss of Appetite",
  "Night Sweats",
  "Numbness/Tingling",
];

const MEDICAL_HISTORY = [
  "Diabetes",
  "Hypertension",
  "Heart Disease",
  "Asthma",
  "Obesity",
  "High Cholesterol",
  "Kidney Disease",
  "Stroke History",
  "Cancer History",
  "Thyroid Disorder",
];

const FAMILY_CONDITIONS = [
  "Diabetes",
  "Heart Disease",
  "Hypertension",
  "Cancer",
  "Stroke",
];

const STEPS = [
  { label: "Basic Info", icon: User },
  { label: "Health History", icon: Stethoscope },
  { label: "Lifestyle", icon: Activity },
];

interface Props {
  onComplete: (result: RiskResult, data: FormData) => void;
}

export default function IntakeForm({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [age, setAge] = useState("");
  const [ageError, setAgeError] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [smoking, setSmoking] = useState<FormData["smoking"]>("Non-Smoker");
  const [alcohol, setAlcohol] = useState<FormData["alcohol"]>("None");
  const [activity, setActivity] = useState<FormData["activity"]>("Light");
  const [familyHistory, setFamilyHistory] = useState<string[]>([]);

  function toggleItem(
    list: string[],
    setList: (v: string[]) => void,
    item: string,
  ) {
    setList(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item],
    );
  }

  function validateStep0(): boolean {
    const num = Number.parseInt(age, 10);
    if (!age || Number.isNaN(num) || num < 1 || num > 120) {
      setAgeError("Please enter a valid age between 1 and 120.");
      return false;
    }
    setAgeError("");
    return true;
  }

  function handleNext() {
    if (step === 0 && !validateStep0()) return;
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubmit() {
    const data: FormData = {
      age: Number.parseInt(age, 10),
      symptoms,
      conditions,
      smoking,
      alcohol,
      activity,
      familyHistory,
    };
    const result = assessRisk(data);
    onComplete(result, data);
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen gradient-mesh dot-grid">
      {/* Header */}
      <header className="bg-white/85 backdrop-blur-md border-b border-border sticky top-0 z-10 shadow-xs">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-md">
              <HeartPulse className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground leading-tight">
                AI Health Risk Predictor
              </h1>
              <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
                AI-powered health awareness tool
              </p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-3">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-1.5 flex-1">
                  <div
                    className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-300 ${
                      i < step
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : i === step
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-sm"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i < step ? "✓" : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  <span
                    className={`text-xs font-semibold hidden sm:block ${
                      i === step ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 h-0.5 bg-border mx-1 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500 rounded-full"
                        style={{ width: i < step ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-2 rounded-full" />
        </div>
      </header>

      {/* Form body */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-5">
                {/* Welcome card */}
                <div className="bg-primary rounded-2xl p-6 md:p-8 text-primary-foreground shadow-elevated overflow-hidden relative">
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 80% 20%, white 0%, transparent 60%), radial-gradient(circle at 20% 80%, white 0%, transparent 50%)",
                    }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                        <ShieldCheck className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">
                          Free Assessment
                        </p>
                        <h2 className="text-2xl font-display font-bold text-white leading-tight">
                          Your Personal Health Check
                        </h2>
                      </div>
                    </div>
                    <p className="text-white/85 text-sm leading-relaxed mb-5">
                      Answer 3 short sections about your age, symptoms, and
                      lifestyle. Our AI engine evaluates risk across 5 major
                      health conditions and gives you personalized guidance.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Cardiovascular",
                        "Diabetes",
                        "Respiratory",
                        "Hypertension",
                        "General Health",
                      ].map((c) => (
                        <span
                          key={c}
                          className="bg-white/15 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/25"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Age input card */}
                <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
                      <User className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-bold text-foreground leading-tight">
                        Tell us about yourself
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        Your age personalizes the risk calculations
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="age"
                        className="text-sm font-semibold text-foreground mb-2 block"
                      >
                        How old are you?
                      </Label>
                      <div className="relative">
                        <Input
                          id="age"
                          type="number"
                          min={1}
                          max={120}
                          placeholder="e.g. 35"
                          value={age}
                          onChange={(e) => {
                            setAge(e.target.value);
                            setAgeError("");
                          }}
                          className="text-2xl h-16 font-bold pl-5 pr-16 rounded-xl border-2 focus:border-primary transition-colors"
                          data-ocid="form.age_input"
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                          years
                        </span>
                      </div>
                      {ageError && (
                        <p
                          className="text-destructive text-sm mt-2 font-medium"
                          data-ocid="form.age_error"
                        >
                          {ageError}
                        </p>
                      )}
                    </div>

                    <div className="bg-accent/40 rounded-xl p-4 border border-accent">
                      <p className="text-sm text-accent-foreground leading-relaxed">
                        <strong>Privacy notice:</strong> This information is
                        processed locally and is never stored with any personal
                        identifier.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                {/* Symptoms */}
                <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1 h-8 rounded-full bg-primary" />
                    <div>
                      <h2 className="text-xl font-display font-bold text-foreground">
                        Current Symptoms
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        Select all you're currently experiencing
                      </p>
                    </div>
                  </div>

                  {symptoms.length > 0 && (
                    <div className="mt-3 mb-4 inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold">
                      <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-black">
                        {symptoms.length}
                      </span>
                      symptom{symptoms.length !== 1 ? "s" : ""} selected
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {SYMPTOMS.map((symptom, idx) => {
                      const Icon = SYMPTOM_ICONS[symptom] ?? Activity;
                      const isSelected = symptoms.includes(symptom);
                      return (
                        <motion.button
                          key={symptom}
                          type="button"
                          onClick={() =>
                            toggleItem(symptoms, setSymptoms, symptom)
                          }
                          whileTap={{ scale: 0.97 }}
                          className={`px-3 py-3 rounded-xl border-2 text-sm font-medium text-left transition-all duration-200 flex items-center gap-2 ${
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground shadow-md scale-[1.01]"
                              : "border-border bg-white text-foreground hover:border-primary/60 hover:bg-primary/5 hover:text-primary"
                          }`}
                          data-ocid={`form.symptom.checkbox.${idx + 1}`}
                          aria-pressed={isSelected}
                        >
                          <Icon
                            className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`}
                          />
                          <span className="leading-tight">{symptom}</span>
                          {isSelected && (
                            <span className="ml-auto text-primary-foreground/80 text-xs font-black">
                              ✓
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Medical History */}
                <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1 h-8 rounded-full bg-chart-2" />
                    <div>
                      <h2 className="text-xl font-display font-bold text-foreground">
                        Medical History
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        Conditions you've been diagnosed with
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {MEDICAL_HISTORY.map((condition, idx) => {
                      const isSelected = conditions.includes(condition);
                      return (
                        <motion.button
                          key={condition}
                          type="button"
                          onClick={() =>
                            toggleItem(conditions, setConditions, condition)
                          }
                          whileTap={{ scale: 0.97 }}
                          className={`px-3 py-3 rounded-xl border-2 text-sm font-medium text-left transition-all duration-200 flex items-center gap-2 ${
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground shadow-md scale-[1.01]"
                              : "border-border bg-white text-foreground hover:border-primary/60 hover:bg-primary/5 hover:text-primary"
                          }`}
                          data-ocid={`form.history.checkbox.${idx + 1}`}
                          aria-pressed={isSelected}
                        >
                          <Stethoscope
                            className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`}
                          />
                          <span className="leading-tight">{condition}</span>
                          {isSelected && (
                            <span className="ml-auto text-primary-foreground/80 text-xs font-black">
                              ✓
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                {/* Lifestyle card */}
                <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 rounded-full bg-chart-3" />
                    <div>
                      <h2 className="text-xl font-display font-bold text-foreground">
                        Lifestyle Factors
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        Your daily habits significantly affect your health risks
                      </p>
                    </div>
                  </div>

                  <div className="space-y-7">
                    {/* Smoking */}
                    <fieldset>
                      <legend className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
                        <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
                          <Cigarette className="w-4 h-4 text-orange-600" />
                        </div>
                        Smoking Status
                      </legend>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {(
                          [
                            "Non-Smoker",
                            "Former Smoker",
                            "Current Smoker",
                          ] as const
                        ).map((opt) => (
                          <label
                            key={opt}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                              smoking === opt
                                ? "border-primary bg-primary/8 shadow-sm"
                                : "border-border hover:border-primary/50 hover:bg-primary/3"
                            }`}
                          >
                            <input
                              type="radio"
                              name="smoking"
                              value={opt}
                              checked={smoking === opt}
                              onChange={() => setSmoking(opt)}
                              className="sr-only"
                              data-ocid="form.smoking.radio"
                            />
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                smoking === opt
                                  ? "border-primary bg-primary"
                                  : "border-border"
                              }`}
                            >
                              {smoking === opt && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                              )}
                            </div>
                            <span
                              className={`text-sm font-semibold ${smoking === opt ? "text-primary" : "text-foreground"}`}
                            >
                              {opt}
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    {/* Alcohol */}
                    <fieldset>
                      <legend className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
                        <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                          <Wine className="w-4 h-4 text-purple-600" />
                        </div>
                        Alcohol Use
                      </legend>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(
                          ["None", "Occasional", "Regular", "Heavy"] as const
                        ).map((opt) => (
                          <label
                            key={opt}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                              alcohol === opt
                                ? "border-primary bg-primary/8 shadow-sm"
                                : "border-border hover:border-primary/50 hover:bg-primary/3"
                            }`}
                          >
                            <input
                              type="radio"
                              name="alcohol"
                              value={opt}
                              checked={alcohol === opt}
                              onChange={() => setAlcohol(opt)}
                              className="sr-only"
                              data-ocid="form.alcohol.radio"
                            />
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                alcohol === opt
                                  ? "border-primary bg-primary"
                                  : "border-border"
                              }`}
                            >
                              {alcohol === opt && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                              )}
                            </div>
                            <span
                              className={`text-sm font-semibold ${alcohol === opt ? "text-primary" : "text-foreground"}`}
                            >
                              {opt}
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    {/* Activity */}
                    <fieldset>
                      <legend className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
                        <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
                          <Dumbbell className="w-4 h-4 text-green-600" />
                        </div>
                        Physical Activity
                      </legend>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(
                          ["Sedentary", "Light", "Moderate", "Active"] as const
                        ).map((opt) => (
                          <label
                            key={opt}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                              activity === opt
                                ? "border-primary bg-primary/8 shadow-sm"
                                : "border-border hover:border-primary/50 hover:bg-primary/3"
                            }`}
                          >
                            <input
                              type="radio"
                              name="activity"
                              value={opt}
                              checked={activity === opt}
                              onChange={() => setActivity(opt)}
                              className="sr-only"
                              data-ocid="form.activity.radio"
                            />
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                activity === opt
                                  ? "border-primary bg-primary"
                                  : "border-border"
                              }`}
                            >
                              {activity === opt && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                              )}
                            </div>
                            <span
                              className={`text-sm font-semibold ${activity === opt ? "text-primary" : "text-foreground"}`}
                            >
                              {opt}
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                </div>

                {/* Family History */}
                <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 rounded-full bg-chart-5" />
                    <div>
                      <h2 className="text-xl font-display font-bold text-foreground">
                        Family Medical History
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        Immediate family (parents, siblings)
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {FAMILY_CONDITIONS.map((condition) => {
                      const isSelected = familyHistory.includes(condition);
                      return (
                        <motion.button
                          key={condition}
                          type="button"
                          onClick={() =>
                            toggleItem(
                              familyHistory,
                              setFamilyHistory,
                              condition,
                            )
                          }
                          whileTap={{ scale: 0.97 }}
                          className={`px-3 py-3 rounded-xl border-2 text-sm font-medium text-left transition-all duration-200 flex items-center gap-2 ${
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground shadow-md"
                              : "border-border bg-white text-foreground hover:border-primary/60 hover:bg-primary/5 hover:text-primary"
                          }`}
                          aria-pressed={isSelected}
                        >
                          <Heart
                            className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`}
                          />
                          <span>{condition}</span>
                          {isSelected && (
                            <span className="ml-auto text-primary-foreground/80 text-xs font-black">
                              ✓
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <SDGBadges />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              className="flex-1 sm:flex-none h-14 text-base border-2"
              data-ocid="form.back_button"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button
              size="lg"
              onClick={handleNext}
              className="flex-1 h-14 text-base font-semibold"
              data-ocid="form.next_button"
            >
              Continue
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleSubmit}
              className="flex-1 h-14 text-base font-semibold"
              data-ocid="form.submit_button"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Get My Health Assessment
            </Button>
          )}
        </div>

        {step === 0 && (
          <div className="mt-6">
            <SDGBadges />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-muted-foreground px-4">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
