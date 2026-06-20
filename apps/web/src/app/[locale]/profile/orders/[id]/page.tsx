"use client";

import { use } from "react";
import { useParams } from "next/navigation";
import Container from "@/components/container";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/client";
import RequestReturn from "@/components/orders/RequestReturn";
import Link from "@/components/link";

interface OrderDetail {
  _id: string;
  orderNumber: string;
  status: string;
  guestEmail?: string;
  pricing?: { total: number; currency: string };
  items?: { productId: string; variantSku?: string; quantity: number; title: string }[];
  timeline?: { status: string; at: string }[];
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id: orderId } = use(params);
  const { locale } = useParams();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const res = await apiFetch<{ data: OrderDetail }>(`/orders/${orderId}`);
      return res.data;
    },
  });

  return (
    <main className="p-6">
      <Container>
        <Link href={`/${locale}/profile/orders`} className="text-blue-600 text-sm mb-4 block">
          Back to orders
        </Link>
        {isLoading && <p>Loading order...</p>}
        {error && <p className="text-red-500">Failed to load order.</p>}
        {order && (
          <div className="bg-white p-6 rounded shadow space-y-4">
            <h1 className="text-xl font-bold">{order.orderNumber}</h1>
            <p>Status: <span className="font-semibold">{order.status}</span></p>
            <p>Total: {order.pricing?.total} {order.pricing?.currency}</p>
            <div>
              <h2 className="font-semibold mb-2">Items</h2>
              <ul className="space-y-1">
                {order.items?.map((item, i) => (
                  <li key={i}>{item.title} x{item.quantity}</li>
                ))}
              </ul>
            </div>
            {order.timeline && (
              <div>
                <h2 className="font-semibold mb-2">Timeline</h2>
                <ul className="text-sm text-gray-600 space-y-1">
                  {order.timeline.map((t, i) => (
                    <li key={i}>{t.status} — {new Date(t.at).toLocaleString()}</li>
                  ))}
                </ul>
              </div>
            )}
            {order.items && order.items.length > 0 && (
              <RequestReturn
                orderNumber={order.orderNumber}
                email={order.guestEmail}
                items={order.items}
              />
            )}
          </div>
        )}
      </Container>
    </main>
  );
}
