"use client";

import { useToastContext } from "@/components/ui/toast/ToastProvider";

export function useToast() {
  return useToastContext();
}
