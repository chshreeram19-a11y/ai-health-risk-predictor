import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import IntakeForm from "./components/IntakeForm";
import ResultsDashboard from "./components/ResultsDashboard";
import { useSubmitAssessment } from "./hooks/useQueries";
import type { FormData, RiskResult } from "./riskEngine";
import { getAgeBucket } from "./riskEngine";

const queryClient = new QueryClient();

type View = "form" | "results";

interface AppState {
  view: View;
  riskResult: RiskResult | null;
  formData: FormData | null;
}

function AppInner() {
  const [state, setState] = useState<AppState>({
    view: "form",
    riskResult: null,
    formData: null,
  });
  const submitMutation = useSubmitAssessment();

  function handleResults(result: RiskResult, data: FormData) {
    setState({ view: "results", riskResult: result, formData: data });

    // Fire-and-forget backend submission
    const ageBucket = getAgeBucket(data.age);
    submitMutation.mutate({
      ageBucket,
      symptoms: data.symptoms,
      conditions: data.conditions,
      overallRiskLevel: result.overallRiskLevel,
      conditionRisks: result.conditionRisks.map((c) => ({
        conditionName: c.conditionName,
        riskLevel: c.riskLevel,
      })),
    });
  }

  function handleNewAssessment() {
    setState({ view: "form", riskResult: null, formData: null });
  }

  return (
    <div className="min-h-screen bg-background">
      {state.view === "form" && <IntakeForm onComplete={handleResults} />}
      {state.view === "results" && state.riskResult && state.formData && (
        <ResultsDashboard
          result={state.riskResult}
          formData={state.formData}
          onNewAssessment={handleNewAssessment}
        />
      )}
      <Toaster richColors position="top-center" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
