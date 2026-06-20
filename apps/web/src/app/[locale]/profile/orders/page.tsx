"use client";

import Container from "@/components/container";
import Link from "@/components/link";
import { useOrders } from "@/lib/api/hooks/use-orders";
import { useParams } from "next/navigation";

export default function ProfileOrdersPage() {
  const { locale } = useParams();
  const { data: orders = [], isLoading, error } = useOrders();

  return (
    <main className="p-6">
      <Container>
        <h1 className="text-xl font-bold mb-4">My Orders</h1>
        {isLoading && <p>Loading orders...</p>}
        {error && <p className="text-red-500">Failed to load orders. Please sign in.</p>}
        {!isLoading && !error && orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <ul className="space-y-3">
            {orders.map((o: unknown) => {
              const order = o as { _id: string; orderNumber: string; status: string; pricing: { total: number } };
              return (
                <li key={order._id} className="bg-white p-4 rounded shadow">
                  <Link href={`/${locale}/profile/orders/${order._id}`}>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">{order.status}</p>
                    <p>{order.pricing?.total} EGP</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Container>
    </main>
  );
}
