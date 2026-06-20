import Container from "@/components/container";
import CartItems from "@/app/[locale]/_components/cart/CartItems";
import MainHeading from "@/components/main-heading";
import Checkout from "@/app/[locale]/_components/cart/Checkout";

export default function CartPage() {
  return (
    <main className="bg-gray-200 py-16 h-[50vh]">
      <Container>
        <MainHeading
          title="Cart Items"
          description="This is a dummy description"
        />

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Checkout />
          <CartItems />
        </section>
      </Container>
    </main>
  );
}
