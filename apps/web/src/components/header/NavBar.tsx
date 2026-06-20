"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth, useLogout } from "@/lib/api/hooks/use-auth";
import { isAdminRole } from "@/lib/api/hooks/use-auth";
import Link from "@/components/link";
import { Routes, Pages } from "@/constants/enums";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const [openMenu, setOpenMenu] = useState(false);
  const { locale } = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const { data: user, isLoading } = useAuth();
  const logout = useLogout();

  const handleLogout = async () => {
    await logout.mutateAsync();
    router.push(`/${locale}/`);
  };

  const links = [
    { id: 1, title: "Shop", href: Routes.SHOP },
    { id: 2, title: "About", href: Routes.ABOUT },
    { id: 3, title: "Contact", href: Routes.CONTACT },
    { id: 4, title: "Cart", href: Routes.CART },
  ];

  return (
    <nav className="relative flex justify-between items-center">
      <ul
        className={`fixed lg:static ${
          openMenu ? "left-0 z-50" : "-left-full"
        } top-0 px-10 py-20 lg:p-0 bg-background lg:bg-transparent transition-all duration-200 h-full lg:h-auto flex-col lg:flex-row w-full lg:w-auto flex items-start lg:items-center gap-10`}
      >
        {openMenu && (
          <button
            className="absolute top-5 right-5 text-green-500 p-2"
            onClick={() => setOpenMenu(false)}
          >
            <X size={28} />
          </button>
        )}

        {links.map((link) => (
          <li
            key={link.id}
            className="p-4 border-b-2 border-green-500 border-opacity-0 hover:border-opacity-100 hover:text-green-500 duration-200 cursor-pointer"
          >
            <Link
              href={`/${locale}/${link.href}`}
              className={pathname.startsWith(`/${locale}/${link.href}`) ? "text-red-500" : ""}
            >
              {link.title}
            </Link>
          </li>
        ))}

        {!isLoading && user ? (
          <>
            <li className="p-4">
              <Link href={`/${locale}/profile`}>{user.name}</Link>
            </li>
            <li className="p-4">
              <Link href={`/${locale}/profile/orders`}>My Orders</Link>
            </li>
            {isAdminRole(user.role) && (
              <li className="p-4">
                <Link href={`/${locale}/${Routes.ADMIN}/dashboard`}>Admin</Link>
              </li>
            )}
            <li className="p-4">
              <button onClick={handleLogout} className="text-gray-600 hover:text-red-500">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="p-4">
              <Link href={`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`}>Sign In</Link>
            </li>
            <li className="p-4">
              <Link href={`/${locale}/${Routes.AUTH}/${Pages.FORGOT_PASSWORD}`}>Forgot Password</Link>
            </li>
          </>
        )}
      </ul>

      <button className="lg:hidden p-2 text-green-500" onClick={() => setOpenMenu((p) => !p)}>
        <Menu size={28} />
      </button>

      {openMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setOpenMenu(false)}
        />
      )}
    </nav>
  );
}
