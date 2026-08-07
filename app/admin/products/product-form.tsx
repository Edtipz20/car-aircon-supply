/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { Controller, Resolver, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { insertProductSchema } from "@/lib/validators";
import { createProduct, updateProduct } from "@/lib/actions/product.action";
import { toast } from "sonner";
import { z } from "zod";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { X } from "lucide-react";
import RichTextEditor from "@/components/shared/rich-text-editor";

type ProductFormValues = z.infer<typeof insertProductSchema>;

const ProductForm = ({
  productId,
  categories,
  defaultValues,
  onSuccess,
}: {
  productId?: string;
  categories: { id: string; name: string }[];
  defaultValues?: Partial<ProductFormValues>;
  onSuccess?: () => void;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(insertProductSchema) as Resolver<ProductFormValues>,
    defaultValues: {
      name: "",
      slug: "",
      categoryId: "",
      brand: "",
      description: "",
      stock: 0,
      images: [],
      isFeatured: false,
      banner: null,
      price: "0",
      ...defaultValues,
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    startTransition(async () => {
      const res = productId
        ? await updateProduct(productId, data)
        : await createProduct(data);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      form.reset();
      onSuccess ? onSuccess() : router.push("/admin/products");
    });
  };

  const generateSlug = () => {
    const name = form.getValues("name");
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    form.setValue("slug", slug);
  };

  const images = useWatch({ control: form.control, name: "images" });
  const isFeatured = useWatch({ control: form.control, name: "isFeatured" });

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5 max-w-2xl"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-xs text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="slug">Slug </Label>
          <Input id="slug" {...form.register("slug")} />
          {form.formState.errors.slug && (
            <p className="text-xs text-destructive">
              {form.formState.errors.slug.message}
            </p>
          )}
          <button
            type="button"
            onClick={generateSlug}
            className="text-xs text-accent px-1 py-0.5 font-normal border cursor-pointer"
          >
            (generate)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="categoryId">Category</Label>
          <select
            id="categoryId"
            {...form.register("categoryId")}
            className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {form.formState.errors.categoryId && (
            <p className="text-xs text-destructive">
              {form.formState.errors.categoryId.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" {...form.register("brand")} />
          {form.formState.errors.brand && (
            <p className="text-xs text-destructive">
              {form.formState.errors.brand.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="price">Price</Label>
          <Input id="price" {...form.register("price")} placeholder="0.00" />
          {form.formState.errors.price && (
            <p className="text-xs text-destructive">
              {form.formState.errors.price.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" {...form.register("stock")} />
          {form.formState.errors.stock && (
            <p className="text-xs text-destructive">
              {form.formState.errors.stock.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <Label>Description</Label>
        <Controller
          name="description"
          control={form.control}
          render={({ field }) => (
            <RichTextEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {form.formState.errors.description && (
          <p className="text-xs text-destructive">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label>Product Images</Label>
        <div className="flex flex-wrap gap-3 mb-3">
          {images?.map((image: string) => (
            <div key={image} className="relative">
              <Image
                src={image}
                alt="Product image"
                width={80}
                height={80}
                className="rounded border object-cover"
              />
              <button
                type="button"
                onClick={() =>
                  form.setValue(
                    "images",
                    images.filter((img) => img !== image), // compare to the mapped `image`, not itself
                    { shouldValidate: true },
                  )
                }
                className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        <UploadButton
          endpoint="productImage"
          appearance={{
            button:
              "bg-accent rounded-none hover:bg-accent-dark text-white text-sm font-medium px-4 h-10 ut-uploading:opacity-60 ut-uploading:cursor-not-allowed",
            allowedContent: "text-xs text-muted-foreground mt-2",
            container: "flex flex-col items-start gap-1",
          }}
          content={{
            button({ ready, isUploading }) {
              if (isUploading) return "Uploading...";
              if (ready) return "Upload Image";
              return "Loading...";
            },
            allowedContent({ ready, fileTypes, isUploading }) {
              if (!ready) return "Checking upload config...";
              if (isUploading) return "Uploading...";
              return `Images up to 4MB (${fileTypes.join(", ")})`;
            },
          }}
          onClientUploadComplete={(res) => {
            const urls = res.map((file) => file.ufsUrl);
            form.setValue("images", [...images, ...urls], {
              shouldValidate: true,
            });
            toast.success("Image uploaded");
          }}
          onUploadError={(error) => {
            toast.error(`ERROR! ${error.message}`);
          }}
        />

        {/* <UploadButton
          className="border-2 p-3 text-accent rounded-lg"
          endpoint="productImage"
          onClientUploadComplete={(res: { url: string }[]) => {
            form.setValue("images", [...images, res[0].url]);
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            toast.error(`ERROR! ${error.message}`);
          }}
        /> */}

        {form.formState.errors.images && (
          <p className="text-xs text-destructive">
            {form.formState.errors.images.message}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="isFeatured"
          checked={isFeatured}
          onCheckedChange={(checked) => form.setValue("isFeatured", !!checked)}
        />
        <Label htmlFor="isFeatured" className="font-normal">
          Featured product
        </Label>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-15 bg-accent hover:bg-accent-dark hover:bg-primary cursor-pointer text-white"
      >
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : productId ? (
          "Save Changes"
        ) : (
          "Create Product"
        )}
      </Button>
    </form>
  );
};

export default ProductForm;
