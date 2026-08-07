"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { categorySchema, CategoryFormValues } from "@/lib/validators";
import { createCategory, updateCategory } from "@/lib/actions/product.action";
import { toast } from "sonner";

const CategoryForm = ({
  categoryId,
  defaultValues,
}: {
  categoryId?: string;
  defaultValues?: Partial<CategoryFormValues>;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", slug: "", ...defaultValues },
  });

  const onSubmit = (data: CategoryFormValues) => {
    startTransition(async () => {
      const res = categoryId
        ? await updateCategory(categoryId, data)
        : await createCategory(data);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      router.push("/admin/categories");
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

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
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
        <Label htmlFor="slug"></Label>
        <Input
          id="slug"
          placeholder="Or click the generate button"
          {...form.register("slug")}
        />
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

      <Button
        type="submit"
        disabled={isPending}
        className="bg-accent hover:bg-accent-dark text-white"
      >
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : categoryId ? (
          "Save Changes"
        ) : (
          "Create Category"
        )}
      </Button>
    </form>
  );
};

export default CategoryForm;
