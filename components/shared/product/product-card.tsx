/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./product-price";
import ProductCardAction from "./product-card-action";

const ProductCard = ({
  product,
  isWishlisted = false,
}: {
  product: any;
  isWishlisted?: boolean;
}) => {
  return (
    <Card className="w-full max-w-sm border-none rounded-none py-0 gap-0 shadow-none hover:shadow-2xl">
      <Link href={`/product/${product.slug}`}>
        <CardHeader className="relative p-0 items-center group overflow-hidden rounded-none">
          <Image
            src={product.images && product.images[0]}
            alt={product.name}
            width={800}
            height={800}
            className="rounded-none"
          />
          <ProductCardAction
            productId={product.id}
            slug={product.slug}
            initialInWishlist={isWishlisted}
          />
        </CardHeader>
      </Link>
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
