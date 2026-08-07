import { notFound } from "next/navigation";
import { getCategoryById } from "@/lib/actions/product.action";
import CategoryForm from "../category-form";

const EditCategoryPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const category = await getCategoryById(id);

  if (!category) notFound();

  return (
    <div className="space-y-6">
      <h1 className="h2-bold">Edit Category</h1>
      <CategoryForm
        categoryId={category.id}
        defaultValues={{ name: category.name, slug: category.slug }}
      />
    </div>
  );
};

export default EditCategoryPage;
