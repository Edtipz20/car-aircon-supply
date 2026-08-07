import AddToCart from "@/components/shared/product/add-to-cart";
import ProductImages from "@/components/shared/product/product-image";
import ProductPrice from "@/components/shared/product/product-price";
import ReviewsTab from "@/components/shared/product/review-tab";
import ShippingBadges from "@/components/shared/product/shipping-badges";
import StarRating from "@/components/shared/product/star-rating";
import WishList from "@/components/shared/product/wishlist";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/db/prisma";
import { getProductBySlug } from "@/lib/actions/product.action";
import { notFound } from "next/navigation";

// Metadata
export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const product = await prisma.product.findFirst({
    where: { slug: slug },
  });
  return {
    title: product?.name,
    description: product?.description,
    openGraph: {
      title: product?.name,
      description: product?.description,
      images: [product?.images],
    },
    twitter: {
      card: "summary_large_image",
      title: product?.name,
    },
  };
}

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="w-full max-w-7xl mx-auto">
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Images */}
          <ProductImages images={product.images} />
          <div className="flex flex-col gap-4">
            <p className="h3-bold">{product.name}</p>
            <ProductPrice value={Number(product.price)} className="h1-bold" />
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
                  <StarRating
                    rating={Number(product.rating)}
                    numReviews={product.numReviews}
                  />
                </li>
              </ul>
            </div>
            <Separator />
            {product.stock > 0 && (
              <AddToCart productId={product.id} stock={product.stock} />
            )}
            <WishList />
            <Separator />
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
          </TabsList>

          <TabsContent value="description" className="pt-6 space-y-6">
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </TabsContent>

          <TabsContent value="reviews" className="pt-6">
            <ReviewsTab productId={product.id} productSlug={product.slug} />
          </TabsContent>

          <TabsContent value="shipping" className="pt-6 space-y-3">
            {/* shipping policy content */}
            <h2>
              <strong>Shipping policy should be&nbsp;know</strong>
            </h2>
            <p>
              What you cover in your shipping policy and how you communicate it
              will be highly dependent on your current business operations and
              supply chain. The&nbsp;goal is to be transparent with customers.
            </p>
            <p>
              As&nbsp;2020 brings unforeseen&nbsp;shipping delays and increased
              carrier costs, it&apos;s more important than ever to keep your
              shipping policy up to date with the following key points in mind:
            </p>
            <ul>
              <li>
                <p>
                  <strong>
                    Essential&nbsp;shipping details are easy to find.&nbsp;
                  </strong>
                  While it is common practice to&nbsp;keep a link to your
                  shipping policy page in the footer of your website, consider
                  how you can also surface important shipping details in the
                  right place at the right time (e.g. on your product page or
                  website banner).
                </p>
              </li>
              <li>
                <p>
                  <strong>Clear and concise presentation.</strong>&nbsp;Don’t
                  make customers comb through your shipping policy page for the
                  information they need. Whenever possible, make it easy to
                  navigate with clear subheadings, tables, bolded text, and
                  links to learn more.&nbsp;
                </p>
              </li>
              <li>
                <p>
                  <strong>Order processing times.</strong>&nbsp;After an order
                  is placed, how many days will it take to get it ready to ship?
                  It’s worth&nbsp;communicating if you’re excluding weekends
                  and/or holidays, and if you have certain cutoff times for
                  processing orders (e.g. orders received after 5pm will be
                  processed the next business day). If changes occur within your
                  supply chain, due to peak periods or as a result of COVID-19,
                  you should update your processing times to reflect it.&nbsp;
                </p>
              </li>
              <li>
                <p>
                  <strong>Domestic and international shipping options.</strong>
                  &nbsp;What are the qualifying regions for your domestic
                  shipping options? International shipping can be broken down in
                  its own section where you list the countries you ship to and
                  estimated delivery timelines. If you offer several shipping
                  options, you can list them in a table so the information is
                  easy to scan.
                </p>
              </li>
              <li>
                <p>
                  <strong>Shipping costs.&nbsp;</strong>Break down your&nbsp;
                  <a
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    href="https://www.shopify.com/blog/competitive-shipping-as-a-small-shop"
                  >
                    <u>shipping costs</u>
                  </a>
                  &nbsp;for the customer. If you have a free shipping threshold,
                  you&nbsp;can communicate in various places as an incentive for
                  customers. Any potential surprise fees should be surfaced too,
                  such as duties and taxes the customer may incur.
                </p>
              </li>
              <li>
                <p>
                  <strong>
                    Local delivery and buy online, pickup in-store.&nbsp;
                  </strong>
                  If you offer local shipping options, such as&nbsp;
                  <a
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    href="https://www.shopify.com/local-delivery"
                  >
                    <u>local delivery</u>
                  </a>
                  &nbsp;or&nbsp;
                  <a
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    href="https://www.shopify.com/blog/buy-online-pickup-curbside"
                  >
                    <u>buy online, pick up in-store</u>
                  </a>
                  , you can explain the steps customers will need to follow
                  after ordering and clearly communicate your local delivery
                  coverage.
                </p>
              </li>
              <li>
                <p>
                  <strong>
                    Transparency around returns, changes and cancellations
                  </strong>
                  . On top of accommodating&nbsp;
                  <a
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    href="https://help.shopify.com/en/manual/orders/refund-cancel-order"
                  >
                    <u>returns</u>
                  </a>
                  &nbsp;through a dedicated&nbsp;
                  <a
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    href="https://www.shopify.com/blog/return-policy"
                  >
                    <u>return policy</u>
                  </a>
                  , you can also summarize how your business evaluates&nbsp;
                  <a
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    href="https://help.shopify.com/en/manual/orders/refund-cancel-order"
                  >
                    <u>refunds</u>
                  </a>
                  ,&nbsp;
                  <a
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    href="https://help.shopify.com/en/manual/orders/edit-orders"
                  >
                    <u>order edits</u>
                  </a>
                  , exchanges, and what your process is in the event of a lost
                  or damaged order.
                </p>
              </li>
              <li>
                <p>
                  <strong>Potential service interruptions.&nbsp;</strong>Orders
                  may take longer to arrive due to variables outside of your
                  control. Your shipping policy page is where you can
                  communicate approximately how much longer and explain to
                  customers why.
                </p>
              </li>
            </ul>
            <p>
              It is not uncommon to update your shipping policy every few
              months, especially whenever you add new shipping options or
              carriers,&nbsp;
              <a
                target="_blank"
                rel="noopener noreferrer nofollow"
                href="https://www.shopify.com/fulfillment"
              >
                expand your fulfillment network
              </a>
              , or anticipate delays.
            </p>
          </TabsContent>

          <TabsContent value="size-chart" className="pt-6">
            {/* size chart content */}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default ProductDetailsPage;
