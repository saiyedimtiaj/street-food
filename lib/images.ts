const STORE_IMAGES: Record<string, string> = {
  Snacks:
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop",
  "Chaat & Snacks":
    "https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=600&h=400&fit=crop",
  Biriyani:
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop",
  Seafood:
    "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=600&h=400&fit=crop",
  "Street Snacks":
    "https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&h=400&fit=crop",
  "Seafood BBQ":
    "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=600&h=400&fit=crop",
  Desserts:
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop",
  Beverages:
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=400&fit=crop",
  Traditional:
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop",
  "Tea & Beverages":
    "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=400&fit=crop",
  Newari:
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop",
  "BBQ & Grill":
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop",
  "Noodles & Soup":
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop",
  "Indian Street Food":
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop",
  Dumplings:
    "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&h=400&fit=crop",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop";

export function getStoreImage(
  coverImage?: string,
  category?: string
): string {
  if (coverImage) return coverImage;
  if (category && STORE_IMAGES[category]) return STORE_IMAGES[category];
  return FALLBACK_IMAGE;
}

const FOOD_IMAGES: string[] = [
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop",
];

export function getFoodImage(imageUrl?: string, index = 0): string {
  if (imageUrl) return imageUrl;
  return FOOD_IMAGES[index % FOOD_IMAGES.length];
}
