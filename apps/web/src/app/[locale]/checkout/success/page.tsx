"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/components/container";
import Link from "@/components/link";

function SuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get("orderNumber");
  const email = params.get("email");
  const orderId = params.get("orderId");

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
      <h1 className="text-2xl font-bold text-green-700 mb-4">Order Confirmed!</h1>
      {orderNumber && <p className="mb-2">Order Number: <strong>{orderNumber}</strong></p>}
      {orderId && <p className="mb-2">Order ID: <strong>{orderId}</strong></p>}
      {email && <p className="text-gray-600 mb-4">Confirmation sent to {email}</p>}
      <Link href={`../orders/track?orderNumber=${orderNumber}&email=${email}`} className="text-blue-600">
        Track your order
      </Link>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main className="p-6">
      <Container>
        <Suspense fallback={<p>Loading...</p>}>
          <SuccessContent />
        </Suspense>
      </Container>
    </main>
  );
}
