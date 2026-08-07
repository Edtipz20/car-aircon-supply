import { notFound } from "next/navigation";
import { getProductById, getAllCategories } from "@/lib/actions/product.action";
import ProductForm from "../product-form";

const EditProductPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;

  const [product, categories] = await Promise.all([
    getProductById(id),
    getAllCategories(),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <h1 className="h2-bold">Edit Product</h1>
      <ProductForm
        productId={product.id}
        categories={categories}
        defaultValues={{
          name: product.name,
          slug: product.slug,
          categoryId: product.categoryId,
          brand: product.brand,
          description: product.description,
          stock: product.stock,
          images: product.images,
          isFeatured: product.isFeatured,
          banner: product.banner,
          price: product.price.toString(),
        }}
      />
    </div>
  );
};

export default EditProductPage;
