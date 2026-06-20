import type { Metadata } from "next";
import { Languages, Directions } from "@/constants/enums";
import { Roboto } from "next/font/google";
import { Locale } from "@/i18n.config";
import Header from "@/components/header";
import CartProvider from "@/components/cart/CartProvider";
import ReduxProvider from "@/providers/ReduxProvider";
import QueryProvider from "@/providers/QueryProvider";

import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  preload: true,
});

export async function generateStaticParams() {
  return [{ locale: Languages.ARABIC }, { locale: Languages.ENGLISH }];
}

export const metadata: Metadata = {
  title: { template: "%s | EE Commerce", default: "EE Commerce" },
  description: "Egypt's premier online shopping destination. Shop millions of products at unbeatable prices.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const locale = (await params).locale;

  return (
    <html
      lang={locale}
      dir={locale === Languages.ARABIC ? Directions.RTL : Directions.LTR}
      suppressHydrationWarning
    >
      <body className={roboto.className}>
        <QueryProvider>
          <ReduxProvider>
            <CartProvider />
            <Header />
            {children}
          </ReduxProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
