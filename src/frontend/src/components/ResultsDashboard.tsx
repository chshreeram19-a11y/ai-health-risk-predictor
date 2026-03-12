import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Heart,
  HeartPulse,
  Printer,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useAggregatedStats } from "../hooks/useQueries";
import type { FormData, RiskResult } from "../riskEngine";
import { getAgeBucket } from "../riskEngine";
import SDGBadges from "./SDGBadges";

interface Props {
  result: RiskResult;
  formData: FormData;
  onNewAssessment: () => void;
}

type RiskLevel = "Low" | "Moderate" | "High" | "Critical";

const RISK_CONFIG: Record<
  RiskLevel,
  {
    bg: string;
    text: string;
    border: string;
    badge: string;
    label: string;
    gradientFrom: string;
    gradientTo: string;
    iconBg: string;
  }
> = {
  Low: {
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
    label: "Your health risk appears LOW",
    gradientFrom: "from-emerald-600",
    gradientTo: "to-teal-500",
    iconBg: "bg-emerald-500/20",
  },
  Moderate: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-800 border-amber-300",
    label: "Your health risk is MODERATE",
    gradientFrom: "from-amber-500",
    gradientTo: "to-yellow-400",
    iconBg: "bg-amber-500/20",
  },
  High: {
    bg: "bg-orange-50",
    text: "text-orange-800",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-800 border-orange-300",
    label: "Your health risk is HIGH — Action Needed",
    gradientFrom: "from-orange-600",
    gradientTo: "to-amber-500",
    iconBg: "bg-orange-500/20",
  },
  Critical: {
    bg: "bg-red-50",
    text: "text-red-800",
    border: "border-red-200",
    badge: "bg-red-100 text-red-800 border-red-300",
    label: "CRITICAL RISK — Seek Medical Attention Now",
    gradientFrom: "from-red-700",
    gradientTo: "to-rose-500",
    iconBg: "bg-red-500/20",
  },
};

const CONDITION_ICONS: Record<string, React.ElementType> = {
  Cardiovascular: Heart,
  Diabetes: Activity,
  Respiratory: Activity,
  Hypertension: TrendingUp,
  "General Health": HeartPulse,
};

function RiskBadge({ level }: { level: string }) {
  const cfg = RISK_CONFIG[level as RiskLevel] ?? RISK_CONFIG.Low;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.badge}`}
    >
      {level}
    </span>
  );
}

export default function ResultsDashboard({
  result,
  formData,
  onNewAssessment,
}: Props) {
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useAggregatedStats();
  const overallCfg = RISK_CONFIG[result.overallRiskLevel];
  const ageBucket = getAgeBucket(formData.age);

  function handlePrint() {
    window.print();
  }

  const barColors: Record<RiskLevel, string> = {
    Low: "bg-emerald-500",
    Moderate: "bg-amber-500",
    High: "bg-orange-500",
    Critical: "bg-red-500",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-xs">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-md">
              <HeartPulse className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">
                Your Health Assessment
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                Age {formData.age} · {ageBucket} age group
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-2 border-2 text-muted-foreground hover:text-foreground"
            data-ocid="results.print_button"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Overall Risk Banner */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          data-ocid="results.overall_card"
          className="rounded-2xl overflow-hidden shadow-elevated"
        >
          <div
            className={`bg-gradient-to-br ${overallCfg.gradientFrom} ${overallCfg.gradientTo} p-6 md:p-8 relative`}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 90% 10%, white 0%, transparent 50%), radial-gradient(circle at 10% 90%, white 0%, transparent 50%)",
              }}
            />
            <div className="relative z-10 flex items-start gap-5">
              <div
                className={`w-16 h-16 rounded-2xl ${overallCfg.iconBg} border border-white/20 flex items-center justify-center flex-shrink-0`}
              >
                <HeartPulse className="w-9 h-9 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white/75 text-xs font-bold uppercase tracking-widest mb-1">
                  Overall Risk Level
                </p>
                <p className="text-2xl md:text-3xl font-display font-bold text-white leading-tight">
                  {overallCfg.label}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex-1 bg-white/25 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="h-full bg-white/80 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(result.overallScore, 100)}%`,
                      }}
                      transition={{
                        delay: 0.2,
                        duration: 0.7,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                  <span className="text-white font-bold text-sm whitespace-nowrap">
                    {result.overallScore} pts
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Summary pills */}
          <div
            className={`${overallCfg.bg} ${overallCfg.border} border-t px-6 py-3 flex flex-wrap gap-3`}
          >
            <span className={`text-xs font-semibold ${overallCfg.text}`}>
              {formData.symptoms.length} symptoms reported
            </span>
            <span className="text-muted-foreground text-xs">·</span>
            <span className={`text-xs font-semibold ${overallCfg.text}`}>
              {formData.conditions.length} medical conditions
            </span>
            <span className="text-muted-foreground text-xs">·</span>
            <span className={`text-xs font-semibold ${overallCfg.text}`}>
              {formData.activity} activity level
            </span>
          </div>
        </motion.div>

        {/* Condition Breakdown */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-7 rounded-full bg-primary" />
            <h2 className="text-xl font-display font-bold text-foreground">
              Risk by Health Condition
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {result.conditionRisks.map((condition, idx) => {
              const cfg =
                RISK_CONFIG[condition.riskLevel as RiskLevel] ??
                RISK_CONFIG.Low;
              const barPct = Math.min((condition.score / 100) * 100, 100);
              const CondIcon =
                CONDITION_ICONS[condition.conditionName] ?? Activity;
              return (
                <motion.div
                  key={condition.conditionName}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.35 }}
                  data-ocid={`results.condition.card.${idx + 1}`}
                  className="bg-white rounded-2xl shadow-card p-5 border border-border/60"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${cfg.bg}`}
                      >
                        <CondIcon className={`w-5 h-5 ${cfg.text}`} />
                      </div>
                      <p className="font-bold text-foreground text-sm leading-tight">
                        {condition.conditionName}
                      </p>
                    </div>
                    <RiskBadge level={condition.riskLevel} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-medium">
                        Risk Score
                      </span>
                      <span className={`font-black text-sm ${cfg.text}`}>
                        {condition.score}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${barColors[condition.riskLevel as RiskLevel] ?? "bg-emerald-500"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${barPct}%` }}
                        transition={{
                          delay: idx * 0.08 + 0.2,
                          duration: 0.6,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Early Warning Alerts */}
        {result.earlyWarningAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            data-ocid="results.alerts.panel"
            className="bg-red-50 border-2 border-red-200 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-display font-bold text-red-800">
                Early Warning Alerts
              </h2>
            </div>
            <div className="space-y-3">
              {result.earlyWarningAlerts.map((alert) => (
                <div
                  key={alert}
                  className="flex gap-3 bg-white/80 rounded-xl p-4 border border-red-100"
                >
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 font-medium leading-relaxed">
                    {alert}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          data-ocid="results.recommendations.panel"
          className="bg-white rounded-2xl shadow-card border border-border/60 p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-display font-bold text-foreground">
              Personalized Recommendations
            </h2>
          </div>
          <ol className="space-y-3">
            {result.recommendations.map((rec, i) => (
              <li key={rec} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-black flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-foreground leading-relaxed pt-0.5">
                  {rec}
                </p>
              </li>
            ))}
          </ol>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            variant="outline"
            onClick={onNewAssessment}
            className="flex-1 h-14 text-base font-semibold border-2 border-primary text-primary hover:bg-primary/5"
            data-ocid="results.new_assessment.button"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Start New Assessment
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handlePrint}
            className="sm:flex-none h-14 px-6 text-base font-semibold border-2 sm:hidden"
            data-ocid="results.print_button.mobile"
          >
            <Printer className="w-5 h-5 mr-2" />
            Print
          </Button>
        </div>

        {/* Community Trends */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          data-ocid="trends.section"
          className="bg-white rounded-2xl shadow-card border border-border/60 p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-display font-bold text-foreground">
              Community Health Trends
            </h2>
          </div>

          {statsLoading && (
            <div className="space-y-3" data-ocid="trends.loading_state">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          )}

          {statsError && (
            <div
              className="flex items-center gap-2 text-muted-foreground py-4"
              data-ocid="trends.error_state"
            >
              <RefreshCw className="w-4 h-4" />
              <p className="text-sm">
                Could not load community trends. Please try again later.
              </p>
            </div>
          )}

          {stats && (
            <div className="space-y-6">
              <div className="bg-primary/8 rounded-xl p-4 flex items-center gap-4 border border-primary/15">
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-display font-black text-primary">
                    {stats.totalAssessments.toString()}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">
                    Total assessments completed
                  </p>
                </div>
              </div>

              {stats.riskLevelBreakdown.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-3">
                    Risk Level Distribution
                  </h3>
                  <div className="space-y-2.5">
                    {stats.riskLevelBreakdown.map(([level, count]) => {
                      const total = stats.riskLevelBreakdown.reduce(
                        (sum, [, c]) => sum + Number(c),
                        0,
                      );
                      const pct =
                        total > 0
                          ? Math.round((Number(count) / total) * 100)
                          : 0;
                      const cfg =
                        RISK_CONFIG[level as RiskLevel] ?? RISK_CONFIG.Low;
                      return (
                        <div key={level} className="flex items-center gap-3">
                          <span
                            className={`text-xs font-bold w-20 ${cfg.text}`}
                          >
                            {level}
                          </span>
                          <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${barColors[level as RiskLevel] ?? "bg-emerald-500"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-16 text-right font-medium">
                            {count.toString()} ({pct}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {stats.topSymptoms.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-3">
                    Top Reported Symptoms
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {stats.topSymptoms.slice(0, 5).map(([symptom, count]) => (
                      <span
                        key={symptom}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent rounded-xl text-xs font-semibold text-accent-foreground border border-accent/60"
                      >
                        <span>{symptom}</span>
                        <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-black">
                          {count.toString()}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        <SDGBadges />

        {/* Disclaimer */}
        <div
          data-ocid="disclaimer.panel"
          className="bg-slate-50 border border-slate-200 rounded-2xl p-5"
        >
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-1">
                Important Medical Disclaimer
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                This assessment is for awareness purposes only. It is not a
                substitute for professional medical advice, diagnosis, or
                treatment. Always consult a qualified healthcare provider. In
                case of emergency, call your local emergency number immediately.
              </p>
            </div>
          </div>
        </div>
      </main>

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
