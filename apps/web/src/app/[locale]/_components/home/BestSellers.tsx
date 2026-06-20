import MainHeading from "@/components/main-heading";
import Menu from "@/components/menu";
import { getBestSellers } from "@/server/db/products";

export default async function BestSellers() {
  const productsData = await getBestSellers();

  return (
    <section className="p-6">
      <MainHeading
        title="Our Best Sellers"
        description="This is a dummy description"
      />

      <Menu data={productsData} />
    </section>
  );
}
