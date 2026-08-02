import Search from "./search";
import UserButton from "./user-button";
import CartSheet from "../cart/cart-sheets";
import { getMyCart } from "@/lib/actions/cart.action";

const Actions = async () => {
  const cart = await getMyCart();
  return (
    <div className="relative flex items-center gap-6">
      <Search />
      <CartSheet cart={cart} />
      <UserButton />
    </div>
  );
};

export default Actions;
