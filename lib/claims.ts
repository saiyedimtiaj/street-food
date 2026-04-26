import api from "@/lib/api";
import type { Claim } from "@/lib/types";

export async function createClaim(data: { store_id: string; message?: string }) {
  const res = await api.post("/claims", data);
  return res.data.data;
}

export async function getAllClaims(status?: string): Promise<Claim[]> {
  const params: Record<string, string> = {};
  if (status) params.status = status;
  const res = await api.get("/claims", { params });
  return res.data.data;
}

export async function approveClaim(id: string, admin_note?: string) {
  const res = await api.patch(`/claims/${id}/approve`, { admin_note });
  return res.data.data;
}

export async function rejectClaim(id: string, admin_note?: string) {
  const res = await api.patch(`/claims/${id}/reject`, { admin_note });
  return res.data.data;
}
