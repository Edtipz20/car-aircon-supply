"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

type NavLink = {
  label: string;
  href: string;
};

const links: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Brands", href: "/brands" },
  { label: "Contact Us", href: "/contact" },
];

const NavLinks = ({ className }: { className?: string }) => {
  const pathname = usePathname();

  return (
    <ul
      role="list"
      className={cn("flex justify-between items-center gap-6", className)}
    >
      {links.map(({ label, href }) => (
        <li key={href} className="cursor-pointer font-bold hover:text-primary">
          <Link
            href={href}
            aria-current={pathname === "href" ? "page" : undefined}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;
