import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertPrompt } from "@shared/schema";

export function usePrompts() {
  return useQuery({
    queryKey: [api.prompts.list.path],
    queryFn: async () => {
      const res = await fetch(api.prompts.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch prompts");
      return api.prompts.list.responses[200].parse(await res.json());
    },
  });
}

export function usePrompt(id: number) {
  return useQuery({
    queryKey: [api.prompts.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.prompts.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch prompt");
      return api.prompts.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreatePrompt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertPrompt) => {
      const validated = api.prompts.create.input.parse(data);
      const res = await fetch(api.prompts.create.path, {
        method: api.prompts.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.prompts.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create prompt");
      }
      return api.prompts.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.prompts.list.path] });
    },
  });
}

export function useRunPrompt(id: number) {
  return useMutation({
    mutationFn: async () => {
      const url = buildUrl(api.prompts.run.path, { id });
      const res = await fetch(url, {
        method: api.prompts.run.method,
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to run prompt tests");
      return api.prompts.run.responses[200].parse(await res.json());
    },
  });
}
