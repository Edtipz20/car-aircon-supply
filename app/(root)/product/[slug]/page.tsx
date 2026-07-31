import AddToCart from "@/components/shared/product/add-to-cart";
import ProductImages from "@/components/shared/product/product-image";
import ProductPrice from "@/components/shared/product/product-price";
import ShippingBadges from "@/components/shared/product/shipping-badges";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductBySlug } from "@/lib/actions/product.action";
import { notFound } from "next/navigation";

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Images */}
          <ProductImages images={product.images} />
          <div className="flex flex-col gap-4">
            <p className="h3-bold">{product.name}</p>
            <ProductPrice value={Number(product.price)} className="h1-bold" />
            <p>{product.description}</p>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2">
              <ul>
                <li className="flex-between">
                  <strong className="mr-10">Availability:</strong>
                  {product.stock > 0 ? (
                    product.stock <= 15 ? (
                      <span className="text-red-500">
                        {product.stock} left in stock
                      </span>
                    ) : (
                      <span>In Stock</span>
                    )
                  ) : (
                    <span>Out of Stock</span>
                  )}
                </li>
                <li className="flex-between">
                  <strong className="mr-10">Brand:</strong>
                  <span>{product.brand}</span>
                </li>
                <li className="flex-between">
                  <strong className="mr-10">Review:</strong>
                  <span>{product.numReviews}</span>
                </li>
              </ul>
            </div>
            <Separator />
            {product.stock > 0 && (
              <AddToCart productId={product.id} stock={product.stock} />
            )}
            {/* Shipping badges */}
            <ShippingBadges />
          </div>
        </div>
      </section>
      <section className="mt-8">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent px-4 py-3 font-semibold text-muted-foreground data-[state=active]:border-accent data-[state=active]:text-accent data-[state=active]:shadow-none"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent px-4 py-3 font-semibold text-muted-foreground data-[state=active]:border-accent data-[state=active]:text-accent data-[state=active]:shadow-none"
            >
              Reviews
            </TabsTrigger>
            <TabsTrigger
              value="shipping"
              className="rounded-none border-b-2 border-transparent px-4 py-3 font-semibold text-muted-foreground data-[state=active]:border-accent data-[state=active]:text-accent data-[state=active]:shadow-none"
            >
              Shipping Policy
            </TabsTrigger>
            <TabsTrigger
              value="size-chart"
              className="rounded-none border-b-2 border-transparent px-4 py-3 font-semibold text-muted-foreground data-[state=active]:border-accent data-[state=active]:text-accent data-[state=active]:shadow-none"
            >
              Size Chart
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="pt-6 space-y-6">
            <div>
              <h3 className="font-bold text-base mb-2">
                Separated they live in Bookmarksgrove right
              </h3>
              <p className="text-muted-foreground">
                Far far away, behind the word mountains, far from the countries
                Vokalia and Consonantia, there live the blind texts. Separated
                they live in Bookmarksgrove right at the coast of the Semantics,
                a large language ocean.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-base mb-2">
                It is a paradisematic country
              </h3>
              <p className="text-muted-foreground">
                A small river named Duden flows by their place and supplies it
                with the necessary regelialia. It is a paradisematic country, in
                which roasted parts of sentences fly into your mouth.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-base mb-2">Powerful Pointing</h3>
              <p className="text-muted-foreground">
                Even the all-powerful Pointing has no control about the blind
                texts it is an almost unorthographic life One day however a
                small line of blind text by the name of Lorem Ipsum decided to
                leave for the far World of Grammar.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="pt-6">
            {/* your reviews list component goes here */}
          </TabsContent>

          <TabsContent value="shipping" className="pt-6">
            {/* shipping policy content */}
          </TabsContent>

          <TabsContent value="size-chart" className="pt-6">
            {/* size chart content */}
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
};

export default ProductDetailsPage;
