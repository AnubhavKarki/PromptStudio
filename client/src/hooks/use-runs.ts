import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useRuns(promptId: number) {
  return useQuery({
    queryKey: [api.runs.listByPrompt.path, promptId],
    queryFn: async () => {
      const url = buildUrl(api.runs.listByPrompt.path, { id: promptId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch runs");
      return api.runs.listByPrompt.responses[200].parse(await res.json());
    },
    enabled: !!promptId,
    refetchInterval: 5000, // Poll for updates while running
  });
}
