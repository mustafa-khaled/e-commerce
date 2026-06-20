import type { Metadata } from "next";
import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import Container from "@/components/container";
import MainHeading from "@/components/main-heading";
import Menu from "@/components/menu";
import ShopSearch from "@/components/shop/ShopSearch";
import { getProducts } from "@/server/db/products";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTrans(locale);
  return {
    title: t.metaTitleShop,
    description: t.metaDescriptionShop,
  };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { products } = await getProducts(locale);

  return (
    <main className="p-6">
      <Container>
        <MainHeading title="Shop" description="Browse our catalog" />
        <ShopSearch locale={locale} />
        <Menu data={products} />
      </Container>
    </main>
  );
}
