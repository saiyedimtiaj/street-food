import api from "@/lib/api";
import type { Complaint } from "@/lib/types";

export async function createComplaint(data: {
  store_id: string;
  subject: string;
  description: string;
}): Promise<Complaint> {
  const res = await api.post("/complaints", data);
  return res.data.data;
}

export async function getMyComplaintForStore(storeId: string): Promise<Complaint | null> {
  const res = await api.get(`/complaints/my/store/${storeId}`);
  return res.data.data;
}

export async function getMyComplaints(): Promise<Complaint[]> {
  const res = await api.get("/complaints/my");
  return res.data.data;
}

export async function getComplaintsByStore(storeId: string): Promise<Complaint[]> {
  const res = await api.get(`/complaints/store/${storeId}`);
  return res.data.data;
}

export async function getAllComplaints(status?: string): Promise<Complaint[]> {
  const params: Record<string, string> = {};
  if (status) params.status = status;
  const res = await api.get("/complaints", { params });
  return res.data.data;
}

export async function resolveComplaint(id: string, admin_note?: string): Promise<Complaint> {
  const res = await api.patch(`/complaints/${id}/resolve`, { admin_note });
  return res.data.data;
}

export async function dismissComplaint(id: string, admin_note?: string): Promise<Complaint> {
  const res = await api.patch(`/complaints/${id}/dismiss`, { admin_note });
  return res.data.data;
}
