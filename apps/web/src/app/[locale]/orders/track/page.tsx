"use client";

import { useState } from "react";
import Container from "@/components/container";
import Button from "@/components/button";
import { useTrackOrder } from "@/lib/api/hooks/use-orders";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { data: order, error, isFetching, refetch } = useTrackOrder(orderNumber, email, submitted);

  const track = () => {
    setSubmitted(true);
    refetch();
  };

  return (
    <main className="p-6">
      <Container>
        <div className="max-w-md mx-auto space-y-4 bg-white p-6 rounded shadow">
          <h1 className="text-xl font-bold">Track Order</h1>
          <input className="w-full border p-2 rounded" placeholder="Order Number" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
          <input className="w-full border p-2 rounded" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button onClick={track} disabled={isFetching}>
            {isFetching ? "Tracking..." : "Track"}
          </Button>
          {submitted && error && <p className="text-red-500">Order not found</p>}
          {order && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <p><strong>Status:</strong> {String(order.status)}</p>
              <p><strong>Total:</strong> {JSON.stringify(order.pricing)}</p>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
