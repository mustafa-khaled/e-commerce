"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "@/components/link";
import { useAuth, isAdminRole } from "@/lib/api/hooks/use-auth";

const adminLinks = [
  { href: "dashboard", label: "Dashboard" },
  { href: "orders", label: "Orders" },
  { href: "products", label: "Products" },
  { href: "inventory", label: "Inventory" },
  { href: "returns", label: "Returns" },
  { href: "campaigns", label: "Campaigns" },
  { href: "reports", label: "Reports" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, isError } = useAuth();
  const { locale } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (isError || !user || !isAdminRole(user.role)) {
      router.replace(`/${locale}/auth/signin`);
    }
  }, [isLoading, isError, user, locale, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <p>Checking access...</p>
      </div>
    );
  }

  if (isError || !user || !isAdminRole(user.role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white p-4">
        <div className="flex gap-4 flex-wrap">
          {adminLinks.map((link) => (
            <Link key={link.href} href={`../admin/${link.href}`} className="hover:text-blue-300">
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
      <div className="p-6">{children}</div>
    </div>
  );
}
