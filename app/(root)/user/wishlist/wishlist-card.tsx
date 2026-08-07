"use client";

import { useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toggleWishlistItem } from "@/lib/actions/wishlist.action";
import { toast } from "sonner";

type Product = {
  id: string;
  slug: string;
  name: string;
  images: string[];
  price: string;
};

const WishlistCard = ({ product }: { product: Product }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    startTransition(async () => {
      const res = await toggleWishlistItem(product.id);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      router.refresh();
    });
  };

  return (
    <div className="border border-border rounded-none pb-3 hover:shadow-md transition-shadow">
      <Link href={`/product/${product.slug}`}>
        <div className="aspect-square relative mb-3">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>
        <p className="text-sm font-bold text-center line-clamp-2">
          {product.name}
        </p>
        <p className="text-accent font-bold text-center mt-1">
          ${Number(product.price).toFixed(2)}
        </p>
      </Link>

      <div className="flex justify-end mr-3">
        <button
          type="button"
          onClick={handleRemove}
          disabled={isPending}
          title="Remove from wishlist"
          className="text-accent hover:text-destructive transition-colors disabled:opacity-50"
        >
          <Heart className="h-5 w-5" fill="currentColor" />
        </button>
      </div>
    </div>
  );
};

export default WishlistCard;
