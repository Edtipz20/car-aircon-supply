"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, ShoppingCart, Heart, Loader } from "lucide-react";
import { addItemToCart } from "@/lib/actions/cart.action";
import { toggleWishlistItem } from "@/lib/actions/wishlist.action";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ProductCardAction = ({
  productId,
  slug,
  initialInWishlist,
}: {
  productId: string;
  slug: string;
  initialInWishlist: boolean;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isWishlistPending, startWishlistTransition] = useTransition();
  const [inWishlist, setInWishlist] = useState(initialInWishlist);

  const handleAddToCart = () => {
    startTransition(async () => {
      const res = await addItemToCart({ productId, qty: 1 });
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      router.refresh();
    });
  };

  const handleToggleWishlist = () => {
    startWishlistTransition(async () => {
      const res = await toggleWishlistItem(productId);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      setInWishlist(res.inWishlist);
      toast.success(res.message);
    });
  };

  const actions = [
    {
      icon: Eye,
      label: "Quick View",
      onClick: () => router.push(`/product/${slug}`),
      pending: false,
    },
    {
      icon: ShoppingCart,
      label: "Add to Cart",
      onClick: handleAddToCart,
      pending: isPending,
    },
    {
      icon: Heart,
      label: inWishlist ? "Remove from Wishlist" : "Add to Wishlist",
      onClick: handleToggleWishlist,
      pending: isWishlistPending,
      active: inWishlist,
    },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
      <div className="flex items-center bg-white shadow-lg divide-x divide-gray-200">
        {actions.map(({ icon: Icon, label, onClick, pending, active }) => (
          <button
            key={label}
            type="button"
            title={label}
            onClick={(e) => {
              e.preventDefault();
              onClick();
            }}
            disabled={pending}
            className={cn(
              "p-5 hover:bg-accent hover:text-white transition-colors duration-200 cursor-pointer",
              active && "text-accent",
            )}
          >
            {pending ? (
              <Loader className="w-4 h-4 animate-spin" strokeWidth={1.5} />
            ) : (
              <Icon
                className="w-4 h-4"
                strokeWidth={1.5}
                fill={active ? "currentColor" : "none"}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductCardAction;
