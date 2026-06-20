import type { Metadata } from "next";
import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import { StoreNavbar } from "@/components/sections/StoreNavbar";
import { PromoBanner } from "@/components/sections/PromoBanner";
import { StorefrontHero } from "@/components/sections/StorefrontHero";
import { ProductCategories } from "@/components/sections/ProductCategories";
import { ProductCards } from "@/components/sections/ProductCards";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { SocialProof } from "@/components/sections/SocialProof";
import { FaqSection } from "@/components/sections/FaqSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { StoreFooter } from "@/components/sections/StoreFooter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTrans(locale);
  return {
    title: t.metaTitleHome,
    description: t.metaDescriptionHome,
  };
}

export default async function Home() {
  return (
    <main className="min-h-screen bg-bg-desktop">
      <StoreNavbar />
      <main>
        <PromoBanner />
        <StorefrontHero />
        <ProductCategories />
        <ProductCards />
        <FeatureGrid />
        <SocialProof />
        <FaqSection />
        <NewsletterSection />
      </main>
      <StoreFooter />
    </main>
  );
}
