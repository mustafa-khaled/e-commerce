import Container from "@/components/container";
import Menu from "@/components/menu";
import ProductReviews from "@/components/product/ProductReviews";
import { getProductBySlug } from "@/server/db/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatCurrency } from "@/lib/formatters";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug, locale);
  if (!product) notFound();

  return (
    <main className="p-6">
      <Container>
        <div className="grid md:grid-cols-2 gap-8">
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            className="rounded-lg"
          />
          <div>
            <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-xl font-semibold text-primary mb-6">
              {formatCurrency(product.basePrice)}
            </p>
            <Menu data={[product]} />
            <ProductReviews productId={product.id} />
          </div>
        </div>
      </Container>
    </main>
  );
}
