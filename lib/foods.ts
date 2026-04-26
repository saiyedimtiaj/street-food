import api from "@/lib/api";
import type { Food } from "@/lib/types";

export async function getFoodsByStore(storeId: string, available?: boolean): Promise<Food[]> {
  const params: Record<string, string> = {};
  if (available !== undefined) params.available = String(available);
  const res = await api.get(`/foods/store/${storeId}`, { params });
  return res.data.data;
}

export async function createFood(data: {
  store_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available?: boolean;
}) {
  const res = await api.post("/foods", data);
  return res.data.data;
}

export async function updateFood(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    price: number;
    image_url: string;
    is_available: boolean;
  }>
) {
  const res = await api.patch(`/foods/${id}`, data);
  return res.data.data;
}

export async function deleteFood(id: string) {
  const res = await api.delete(`/foods/${id}`);
  return res.data;
}
