import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Assessment } from "../backend.d";
import { useActor } from "./useActor";

export function useAggregatedStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["aggregatedStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAggregatedStats();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useSubmitAssessment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Assessment) => {
      if (!actor) return;
      return actor.submitAssessment(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aggregatedStats"] });
    },
  });
}
