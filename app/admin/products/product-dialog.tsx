"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProductForm from "./product-form";

type ProductFormValues = Parameters<typeof ProductForm>[0]["defaultValues"];

const ProductDialog = ({
  mode,
  productId,
  categories,
  defaultValues,
}: {
  mode: "create" | "edit";
  productId?: string;
  categories: { id: string; name: string }[];
  defaultValues?: ProductFormValues;
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button className="bg-accent hover:bg-accent-dark text-white">
            <Plus className="h-4 w-4" /> New Product
          </Button>
        ) : (
          <button
            type="button"
            className="text-accent font-medium cursor-pointer"
          >
            <Pencil className="h-3.5 w-3.5 inline" /> Edit
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl rounded-none max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? (
              <p>
                <span className="text-accent">{"// "} </span>
                New Product
              </p>
            ) : (
              <p>
                <span className="text-accent">{"// "} </span>
                Edit Product
              </p>
            )}
          </DialogTitle>
        </DialogHeader>
        <ProductForm
          productId={productId}
          categories={categories}
          defaultValues={defaultValues}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
