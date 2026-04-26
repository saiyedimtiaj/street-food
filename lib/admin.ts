import api from "@/lib/api";
import type { AdminStats } from "@/lib/types";

export async function getAdminStats(): Promise<AdminStats> {
  const res = await api.get("/admin/stats");
  return res.data.data;
}

export async function suspendStore(id: string) {
  const res = await api.patch(`/admin/stores/${id}/suspend`);
  return res.data;
}

export async function activateStore(id: string) {
  const res = await api.patch(`/admin/stores/${id}/activate`);
  return res.data;
}
