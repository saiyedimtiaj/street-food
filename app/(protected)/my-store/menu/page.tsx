"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMyStores } from "@/lib/stores";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * /my-store/menu — redirect to the first store's menu page.
 * If the user has multiple stores they'll land on the first one;
 * the [storeId] layout's tab bar lets them navigate further.
 */
export default function MyStoreMenuRedirect() {
  const router = useRouter();

  const { data: stores, isLoading } = useQuery({
    queryKey: ["my-stores"],
    queryFn: getMyStores,
  });

  useEffect(() => {
    if (!stores) return;
    if (stores.length > 0) {
      router.replace(`/my-store/${stores[0].id}/menu`);
    } else {
      router.replace("/my-store");
    }
  }, [stores, router]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-4">
      <Skeleton className="h-8 w-48 rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
