import { getAllCategories } from "@/lib/actions/product.action";
import ProductForm from "../product-form";

const CreateProductPage = async () => {
  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <h1 className="h2-bold">
        {" "}
        <span className="text-accent">{"// "}/</span>New Product
      </h1>
      <ProductForm categories={categories} />
    </div>
  );
};

export default CreateProductPage;
