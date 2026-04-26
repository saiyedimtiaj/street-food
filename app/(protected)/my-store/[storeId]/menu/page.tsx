"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { UtensilsCrossed, Pencil, Trash2, Plus } from "lucide-react";
import { getFoodsByStore, createFood, updateFood, deleteFood } from "@/lib/foods";
import { getStoreById } from "@/lib/stores";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/animations";
import type { Food } from "@/lib/types";

export default function StoreMenuPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);

  const { data: foods, isLoading } = useQuery({
    queryKey: ["foods", storeId],
    queryFn: () => getFoodsByStore(storeId),
  });

  const deleteMut = useMutation({
    mutationFn: (foodId: string) => deleteFood(foodId),
    onSuccess: () => {
      toast("আইটেম মুছে ফেলা হয়েছে", "success");
      queryClient.invalidateQueries({ queryKey: ["foods", storeId] });
    },
    onError: () => toast("মুছতে সমস্যা হয়েছে", "error"),
  });

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-bold font-heading">
          <UtensilsCrossed size={20} className="text-muted-foreground" /> মেনু
        </h2>
        <Button
          onClick={() => { setEditingFood(null); setShowForm(true); }}
          size="sm"
        >
          <Plus size={14} className="mr-1.5" /> নতুন আইটেম
        </Button>
      </div>

      {/* Food Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <FoodForm
              storeId={storeId}
              food={editingFood}
              onClose={() => { setShowForm(false); setEditingFood(null); }}
              onSuccess={() => {
                setShowForm(false);
                setEditingFood(null);
                queryClient.invalidateQueries({ queryKey: ["foods", storeId] });
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      )}

      {/* Empty */}
      {foods && foods.length === 0 && !showForm && (
        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-border/60 p-12 text-center">
          <div className="rounded-full bg-muted p-4 mx-auto w-fit">
            <UtensilsCrossed size={32} className="text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">মেনু খালি</h3>
          <p className="mt-1 text-sm text-muted-foreground">আপনার প্রথম আইটেম যোগ করুন</p>
        </div>
      )}

      {/* Food list */}
      {foods && foods.length > 0 && (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map((food: Food) => (
            <motion.div key={food.id} variants={staggerItem} className="rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-primary/40 transition-colors">
              {food.image_url && (
                <img src={food.image_url} alt={food.name} className="w-full aspect-video object-cover" />
              )}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-sm">{food.name}</p>
                  <p className="font-mono text-primary font-bold text-sm shrink-0">৳{food.price}</p>
                </div>
                {food.description && <p className="text-sm text-muted-foreground line-clamp-2">{food.description}</p>}
                <div className="flex items-center justify-between pt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    food.is_available
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-red-500/10 text-red-600"
                  }`}>
                    {food.is_available ? "পাওয়া যাচ্ছে" : "পাওয়া যাচ্ছে না"}
                  </span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingFood(food); setShowForm(true); }}>
                      <Pencil size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => deleteMut.mutate(food.id)} disabled={deleteMut.isPending}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

function FoodForm({ storeId, food, onClose, onSuccess }: { storeId: string; food: Food | null; onClose: () => void; onSuccess: () => void }) {
  const { toast } = useToast();
  const [name, setName] = useState(food?.name || "");
  const [description, setDescription] = useState(food?.description || "");
  const [price, setPrice] = useState(food?.price?.toString() || "");
  const [isAvailable, setIsAvailable] = useState(food?.is_available ?? true);

  const mutation = useMutation({
    mutationFn: (data: { name: string; description?: string; price: number; is_available: boolean }) => {
      return food ? updateFood(food.id, data) : createFood({ ...data, store_id: storeId });
    },
    onSuccess: () => {
      toast(food ? "আইটেম আপডেট হয়েছে" : "আইটেম যোগ হয়েছে", "success");
      onSuccess();
    },
    onError: () => toast("সমস্যা হয়েছে", "error"),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !price) return;
    mutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      price: parseFloat(price),
      is_available: isAvailable,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border/60 p-5 space-y-4">
      <h3 className="text-sm font-semibold">{food ? "আইটেম সম্পাদনা" : "নতুন আইটেম যোগ করুন"}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label className="text-xs">নাম *</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="h-9 mt-1 border-border/60" /></div>
        <div><Label className="text-xs">দাম (৳) *</Label><Input value={price} onChange={(e) => setPrice(e.target.value)} type="number" step="0.01" min="0" className="h-9 mt-1 border-border/60" /></div>
        <div className="sm:col-span-2"><Label className="text-xs">বিবরণ</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} className="h-9 mt-1 border-border/60" /></div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer text-sm">
        <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} className="rounded border-border/60" />
        <span>পাওয়া যাচ্ছে</span>
      </label>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={mutation.isPending}>
          {mutation.isPending ? "সংরক্ষণ..." : food ? "আপডেট করুন" : "যোগ করুন"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>বাতিল</Button>
      </div>
    </form>
  );
}
