import Container from "@/components/container";
import CartItems from "@/app/[locale]/_components/cart/CartItems";
import MainHeading from "@/components/main-heading";
import Checkout from "@/app/[locale]/_components/cart/Checkout";

export default function CheckoutPage() {
  return (
    <main className="bg-gray-200 py-16 min-h-screen">
      <Container>
        <MainHeading title="Checkout" description="Complete your order" />
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Checkout />
          <CartItems />
        </section>
      </Container>
    </main>
  );
}
