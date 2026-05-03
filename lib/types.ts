export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "store" | "admin";
  profile_photo?: string;
  bio?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  name: string;
  description?: string;
  category?: string;
  address?: string;
  latitude: number;
  longitude: number;
  cover_image?: string;
  cover_image_public_id?: string;
  status: "active" | "inactive" | "suspended";
  is_claimed: boolean;
  owner_id?: string;
  created_at: string;
  updated_at: string;
  gallery?: GalleryImage[];
  foods?: Food[];
  reviews?: Review[];
  averageRating?: number;
  totalReviews?: number;
  distance_km?: number;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  public_id: string;
}

export interface Food {
  id: string;
  store_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  store_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
  user?: Pick<User, "id" | "name" | "profile_photo">;
  images?: ReviewImage[];
  replies?: ReviewReply[];
  store?: Pick<Store, "id" | "name">;
}

export interface ReviewImage {
  id: string;
  image_url: string;
  public_id: string;
}

export interface ReviewReply {
  id: string;
  review_id: string;
  store_id: string;
  reply_text: string;
  created_at: string;
  updated_at: string;
}

export interface Suggestion {
  id: string;
  suggested_by: string;
  name: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  status: "pending" | "approved" | "rejected";
  admin_note?: string;
  created_at: string;
  updated_at: string;
  user?: Pick<User, "id" | "name" | "email">;
}

export interface Claim {
  id: string;
  store_id: string;
  claimed_by: string;
  message?: string;
  status: "pending" | "approved" | "rejected";
  admin_note?: string;
  created_at: string;
  updated_at: string;
  store?: Pick<Store, "id" | "name" | "address">;
  user?: Pick<User, "id" | "name" | "email">;
}

export interface Complaint {
  id: string;
  store_id: string;
  user_id: string;
  subject: string;
  description: string;
  status: "pending" | "resolved" | "dismissed";
  admin_note?: string;
  created_at: string;
  updated_at: string;
  store?: Pick<Store, "id" | "name" | "address">;
  user?: Pick<User, "id" | "name" | "email">;
}

export interface AdminStats {
  totalUsers: number;
  totalStores: number;
  totalReviews: number;
  pendingSuggestions: number;
  pendingClaims: number;
  activeStores: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message?: string;
  data: T;
}
