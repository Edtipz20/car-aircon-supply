import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.action";

const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  return <ProductList data={latestProducts} title="Latest Products" />;
};

export default Homepage;
