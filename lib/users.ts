import api from "@/lib/api";
import type { User, PaginatedResponse } from "@/lib/types";

export async function updateProfile(formData: FormData) {
  const res = await api.patch("/users/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}

export async function getAllUsers(params: {
  role?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<User>> {
  const res = await api.get("/users", { params });
  const raw = res.data.data;
  return { data: raw.users, total: raw.total, page: raw.page, limit: raw.limit, totalPages: raw.totalPages };
}

export async function getUserById(id: string): Promise<User> {
  const res = await api.get(`/users/${id}`);
  return res.data.data;
}

export async function deactivateUser(id: string) {
  const res = await api.patch(`/users/${id}/deactivate`);
  return res.data;
}
