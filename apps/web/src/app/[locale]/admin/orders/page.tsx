"use client";

import { useAdminOrders, useUpdateOrderStatus } from "@/lib/api/hooks/use-admin";
import Button from "@/components/button";

const STATUSES = ["confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const { data: orders = [], isLoading } = useAdminOrders();
  const updateMutation = useUpdateOrderStatus();

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Orders</h1>
      {isLoading && <p>Loading orders...</p>}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Order #</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Total</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b">
              <td className="p-3">{order.orderNumber}</td>
              <td className="p-3">{order.status}</td>
              <td className="p-3">{order.pricing?.total}</td>
              <td className="p-3 flex flex-wrap gap-1">
                {STATUSES.filter((s) => s !== order.status).map((status) => (
                  <Button
                    key={status}
                    variant="secondary"
                    className="text-xs py-1"
                    onClick={() => updateMutation.mutate({ id: order._id, status })}
                    disabled={updateMutation.isPending}
                  >
                    {status}
                  </Button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
