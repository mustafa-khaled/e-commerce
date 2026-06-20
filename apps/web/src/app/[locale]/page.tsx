import type { Metadata } from "next";
import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import BestSellers from "@/app/[locale]/_components/home/BestSellers";
import Hero from "@/app/[locale]/_components/home/Hero";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTrans(locale);
  return {
    title: t.metaTitleHome,
    description: t.metaDescriptionHome,
  };
}

export default async function Home() {
  return (
    <main>
      <Hero />
      <BestSellers />
    </main>
  );
}
