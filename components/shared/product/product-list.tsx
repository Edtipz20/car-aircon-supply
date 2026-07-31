/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductCard from "./product-card";

const ProductList = ({
  data,
  title,
  limit,
}: {
  data: any;
  title?: string;
  limit?: number;
}) => {
  const limitedData = limit ? data.slice(0, limit) : data;
  return (
    <div className="my-10 px-5 md:px-28 mt-10 md:mt-28">
      <h2 className="h2-bold text-center mb-16">
        <span className="text-accent">{"// "} </span>
        {title}
      </h2>
      {data.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {limitedData.map((product: any) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div>
          <p>No products found</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
