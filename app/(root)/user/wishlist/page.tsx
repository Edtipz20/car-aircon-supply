import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getMyWishlist } from "@/lib/actions/wishlist.action";
import WishlistCard from "./wishlist-card";

const WishlistPage = async () => {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/user/wishlist");

  const products = await getMyWishlist();

  return (
    <div className="px-5 md:px-28 py-10">
      <p className="font-bold uppercase">
        <span className="text-accent">{"// "} </span>Welcome to your store
      </p>
      <h1 className="h2-bold mb-8">Wishlist</h1>

      {products.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <p className="text-muted-foreground">Your wishlist is empty</p>
          <Link href="/products" className="text-accent font-medium">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <WishlistCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
