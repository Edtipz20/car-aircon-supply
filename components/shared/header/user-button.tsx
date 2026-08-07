import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import SignOutItem from "./sign-out-item";

const UserButton = async () => {
  const session = await auth();
  const firstInitial = session?.user?.name?.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-muted text-primary cursor-pointer"
            >
              {firstInitial ?? <UserIcon className="h-4 w-4" />}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 space-y-2 p-2"
          align="end"
          forceMount
        >
          {session?.user.role === "admin" && (
            <DropdownMenuItem className="rounded-none" asChild>
              <Link href="/admin" className="w-full py-2 cursor-pointer">
                Admin Dashboard
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="rounded-none" asChild>
            <Link href="/user/profile" className="w-full py-2 cursor-pointer">
              My Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-none" asChild>
            <Link href="/user/orders" className="w-full py-2 cursor-pointer">
              My Orders
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-none" asChild>
            <Link href="/user/wishlist" className="w-full py-2 cursor-pointer">
              Wishlist
            </Link>
          </DropdownMenuItem>
          {session ? (
            <SignOutItem />
          ) : (
            <DropdownMenuItem className="rounded-none" asChild>
              <Link href="/sign-in" className="w-full py-2 cursor-pointer">
                Sign In
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
