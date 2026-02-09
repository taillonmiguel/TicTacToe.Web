"use client";

import { useQuery } from "@tanstack/react-query";

import { analyticsApi } from "@/services/analytics";

export function useEstrategiasVitoriosas(take = 10) {
  const query = useQuery({
    queryKey: ["analytics", "strategies", take],
    queryFn: async () => analyticsApi.getEstrategiasVitoriosas(take),
    staleTime: 10_000,
  });

  return {
    query,
    data: query.data,
  };
}
