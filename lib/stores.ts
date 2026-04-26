import api from "@/lib/api";
import type { Store, PaginatedResponse } from "@/lib/types";

export async function searchStores(lat: number, lng: number, radius = 5): Promise<Store[]> {
  const res = await api.get("/stores/search", { params: { lat, lng, radius } });
  return res.data.data;
}

export async function getStoreById(id: string): Promise<Store> {
  const res = await api.get(`/stores/${id}`);
  return res.data.data;
}

export async function getMyStore(): Promise<Store> {
  const res = await api.get("/stores/my-store");
  return res.data.data;
}

export async function getMyStores(): Promise<Store[]> {
  try {
    const res = await api.get("/stores/my-stores");
    return res.data.data;
  } catch {
    const res = await api.get("/stores/my-store");
    return res.data.data ? [res.data.data] : [];
  }
}

export async function createStore(formData: FormData) {
  const res = await api.post("/stores", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}

export async function updateStore(id: string, formData: FormData) {
  const res = await api.patch(`/stores/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}

export async function uploadGallery(id: string, formData: FormData) {
  const res = await api.post(`/stores/${id}/gallery`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}

export async function getAllStores(params: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Store>> {
  const res = await api.get("/stores/all", { params });
  const raw = res.data.data;
  return { data: raw.stores, total: raw.total, page: raw.page, limit: raw.limit, totalPages: raw.totalPages };
}

export async function deleteStore(id: string) {
  const res = await api.delete(`/stores/${id}`);
  return res.data;
}
