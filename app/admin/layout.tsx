import Logo from "@/components/shared/header/logo";
import { requireAdmin } from "@/lib/auth-guard";
import AdminNav from "./admin-nav";
import AdminMobileNav from "./admin-mobile-nav";
import UserButton from "@/components/shared/header/user-button";
import { auth } from "@/auth";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireAdmin();

  const session = await auth();

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block w-56 shrink-0" />
      <aside className="bg-foreground hidden lg:flex lg:flex-col w-56 fixed top-0 left-0 h-screen border-r border-border z-10 p-5 pb-24 overflow-y-auto">
        <div className="flex justify-center mb-6">
          <Logo width={60} height={60} />
        </div>

        <AdminNav />
      </aside>
      {/* Sign out — pinned to the bottom-left of the viewport */}
      <div className="hidden lg:block fixed bottom-0 left-0 w-56 border-r border-t border-border p-5 bg-primary text-muted z-10">
        <div className="flex items-center gap-2">
          <UserButton />
          <p className="font-bold">{session?.user.name}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="lg:hidden flex items-center justify-between border-b border-border p-4">
          <Logo width={40} height={40} />
          <AdminMobileNav />
        </div>

        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
