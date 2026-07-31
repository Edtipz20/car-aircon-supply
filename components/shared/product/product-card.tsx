/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./product-price";

const ProductCard = ({ product }: { product: any }) => {
  return (
    <Card className="w-full max-w-sm border-none rounded-none py-0 gap-0 shadow-none hover:shadow-2xl">
      <CardHeader className="p-0 items-center hover:scale-100">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images && product.images[0]}
            alt={product.name}
            width={800}
            height={800}
            priority={true}
          />
        </Link>
        {/* <ProductCardAction /> */}
      </CardHeader>
      <CardContent className="px-2 grid justify-center">
        <Link href={`/product/${product.slug}`}>
          <div className="text-xs md:text-base font-bold ">{product.name}</div>
        </Link>
        <div className="flex justify-center">
          {product.stock > 0 ? (
            <p>
              <ProductPrice value={Number(product.price)} />
            </p>
          ) : (
            <p className="font-bold sm:text-lg text-sm text-muted-foreground">
              Out Of Stock
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
