"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Camera, Upload, Trash2 } from "lucide-react";
import { getStoreById, updateStore, uploadGallery } from "@/lib/stores";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import type { GalleryImage } from "@/lib/types";

const MAX_GALLERY = 6;

export default function StoreGalleryPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data: store, isLoading } = useQuery({
    queryKey: ["store", storeId],
    queryFn: () => getStoreById(storeId),
  });

  const gallery: GalleryImage[] = store?.gallery || [];
  const remaining = MAX_GALLERY - gallery.length;

  const uploadMut = useMutation({
    mutationFn: async (files: File[]) => {
      setUploading(true);
      const formData = new FormData();
      files.forEach((f) => formData.append("gallery", f));
      return uploadGallery(storeId, formData);
    },
    onSuccess: () => {
      toast("ছবি আপলোড হয়েছে", "success");
      queryClient.invalidateQueries({ queryKey: ["store", storeId] });
    },
    onError: () => toast("আপলোড করতে সমস্যা হয়েছে", "error"),
    onSettled: () => setUploading(false),
  });

  const removeMut = useMutation({
    mutationFn: async (imageId: string) => {
      const updatedGallery = gallery.filter((g) => g.id !== imageId);
      const formData = new FormData();
      formData.append("gallery", JSON.stringify(updatedGallery));
      return updateStore(storeId, formData);
    },
    onSuccess: () => {
      toast("ছবি মুছে ফেলা হয়েছে", "success");
      queryClient.invalidateQueries({ queryKey: ["store", storeId] });
    },
    onError: () => toast("মুছতে সমস্যা হয়েছে", "error"),
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, remaining);
    if (files.length > 0) uploadMut.mutate(files);
    if (fileRef.current) fileRef.current.value = "";
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold font-heading">
            <ImageIcon size={20} className="text-muted-foreground" /> গ্যালারি
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">{gallery.length}/{MAX_GALLERY} ছবি</p>
        </div>
        {remaining > 0 && (
          <Button
            onClick={() => fileRef.current?.click()}
            size="sm"
            disabled={uploading}
          >
            <Upload size={14} className="mr-1.5" />
            {uploading ? "আপলোড হচ্ছে..." : `ছবি যোগ করুন (${remaining} বাকি)`}
          </Button>
        )}
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFileChange} className="hidden" />
      </div>

      {/* Empty */}
      {gallery.length === 0 && (
        <label onClick={() => fileRef.current?.click()} className="flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-border/60 p-12 text-center transition-colors hover:border-primary/40">
          <div className="rounded-full bg-muted p-4 mx-auto w-fit">
            <Camera size={32} className="text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">গ্যালারি খালি</h3>
          <p className="mt-1 text-sm text-muted-foreground">ছবি আপলোড করতে ক্লিক করুন</p>
        </label>
      )}

      {/* Gallery grid */}
      {gallery.length > 0 && (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {gallery.map((img) => (
              <motion.div
                key={img.id}
                variants={staggerItem}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative aspect-square overflow-hidden rounded-xl"
              >
                <img src={img.image_url} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                <button
                  onClick={() => removeMut.mutate(img.id)}
                  disabled={removeMut.isPending}
                  className="absolute top-2 right-2 flex items-center justify-center h-8 w-8 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}
