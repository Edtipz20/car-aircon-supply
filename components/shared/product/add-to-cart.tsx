"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { addItemToCart } from "@/lib/actions/cart.action";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const QuantitySelector = ({
  qty,
  onDecrement,
  onIncrement,
}: {
  qty: number;
  onDecrement: () => void;
  onIncrement: () => void;
}) => {
  return (
    <ButtonGroup>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onDecrement}
        disabled={qty <= 1}
        className="h-15 border-2 border-gray-200 dark:border-gray-200 p-5 cursor-pointer"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        className="pointer-events-none w-12 justify-center h-15 border-2 border-gray-200 dark:border-gray-200 px-8"
      >
        {qty}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onIncrement}
        className="h-15 border-2 border-gray-200 dark:border-gray-200 p-5 cursor-pointer"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  );
};

const AddToCart = ({
  productId,
  stock,
}: {
  productId: string;
  stock: number;
}) => {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [isPending, startTransition] = useTransition();

  const handleIncrement = () => setQty((q) => Math.min(stock, q + 1));
  const handleDecrement = () => setQty((q) => Math.max(1, q - 1));

  const handleAddToCart = () => {
    startTransition(async () => {
      const res = await addItemToCart({ productId, qty });

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message, {
        action: {
          label: "Go To Cart",
          onClick: () => router.push("/cart"),
        },
      });
    });
  };

  const handleBuyNow = () => {
    startTransition(async () => {
      const res = await addItemToCart({ productId, qty });

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      router.push("/cart");
    });
  };

  return (
    <div className="flex justify-start gap-2">
      <QuantitySelector
        qty={qty}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
      />
      <Button
        type="button"
        disabled={isPending}
        onClick={handleAddToCart}
        className="bg-accent text-white h-15 px-8 hover:text-primary hover:bg-white hover:border-primary cursor-pointer"
      >
        <ShoppingCart /> Add to cart
      </Button>
      <Button
        type="button"
        disabled={isPending}
        onClick={handleBuyNow}
        className=" text-white h-15 px-8 hover:text-gray-500 hover:bg-primary cursor-pointer"
      >
        Buy it now
      </Button>
    </div>
  );
};

export default AddToCart;
