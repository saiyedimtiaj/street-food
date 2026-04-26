import api from "@/lib/api";
import type { Suggestion } from "@/lib/types";

export async function createSuggestion(data: {
  name: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}) {
  const res = await api.post("/suggestions", data);
  return res.data.data;
}

export async function getMySuggestions(): Promise<Suggestion[]> {
  const res = await api.get("/suggestions/my");
  return res.data.data;
}

export async function getAllSuggestions(status?: string): Promise<Suggestion[]> {
  const params: Record<string, string> = {};
  if (status) params.status = status;
  const res = await api.get("/suggestions", { params });
  return res.data.data;
}

export async function approveSuggestion(id: string, admin_note?: string) {
  const res = await api.patch(`/suggestions/${id}/approve`, { admin_note });
  return res.data.data;
}

export async function rejectSuggestion(id: string, admin_note?: string) {
  const res = await api.patch(`/suggestions/${id}/reject`, { admin_note });
  return res.data.data;
}
