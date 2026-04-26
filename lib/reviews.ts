import api from "@/lib/api";
import type { Review } from "@/lib/types";

export async function getReviewsByStore(
  storeId: string,
  page = 1,
  limit = 10
): Promise<{ reviews: Review[]; total: number; page: number; limit: number; totalPages: number }> {
  const res = await api.get(`/reviews/store/${storeId}`, { params: { page, limit } });
  return res.data.data;
}

export async function createReview(formData: FormData) {
  const res = await api.post("/reviews", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}

export async function updateReview(id: string, formData: FormData) {
  const res = await api.patch(`/reviews/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}

export async function deleteReview(id: string) {
  const res = await api.delete(`/reviews/${id}`);
  return res.data;
}

export async function addReply(reviewId: string, reply_text: string) {
  const res = await api.post(`/reviews/${reviewId}/reply`, { reply_text });
  return res.data.data;
}

export async function editReply(reviewId: string, reply_text: string) {
  const res = await api.patch(`/reviews/${reviewId}/reply`, { reply_text });
  return res.data.data;
}
