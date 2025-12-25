import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertTestCase } from "@shared/schema";

export function useTestCases(promptId: number) {
  return useQuery({
    queryKey: [api.testCases.listByPrompt.path, promptId],
    queryFn: async () => {
      const url = buildUrl(api.testCases.listByPrompt.path, { id: promptId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch test cases");
      return api.testCases.listByPrompt.responses[200].parse(await res.json());
    },
    enabled: !!promptId,
  });
}

export function useCreateTestCase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertTestCase) => {
      const validated = api.testCases.create.input.parse(data);
      const res = await fetch(api.testCases.create.path, {
        method: api.testCases.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.testCases.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create test case");
      }
      return api.testCases.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      const url = buildUrl(api.testCases.listByPrompt.path, { id: variables.promptId });
      queryClient.invalidateQueries({ queryKey: [api.testCases.listByPrompt.path, variables.promptId] });
    },
  });
}
