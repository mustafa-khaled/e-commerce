"use client";

import { useState } from "react";
import Button from "@/components/button";
import { useAdminLowStock, useAdjustInventory } from "@/lib/api/hooks/use-admin";

export default function AdminInventoryPage() {
  const { data: lowStock = [], isLoading } = useAdminLowStock();
  const adjustMutation = useAdjustInventory();
  const [form, setForm] = useState({ productId: "", delta: 0, reason: "manual adjustment" });

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    await adjustMutation.mutateAsync(form);
    setForm({ productId: "", delta: 0, reason: "manual adjustment" });
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Inventory</h1>

      <form onSubmit={handleAdjust} className="bg-white p-4 rounded shadow mb-6 space-y-3 max-w-md">
        <h2 className="font-semibold">Stock Adjustment</h2>
        <input
          className="w-full border p-2 rounded"
          placeholder="Product ID"
          value={form.productId}
          onChange={(e) => setForm({ ...form, productId: e.target.value })}
          required
        />
        <input
          type="number"
          className="w-full border p-2 rounded"
          placeholder="Delta (+/-)"
          value={form.delta}
          onChange={(e) => setForm({ ...form, delta: Number(e.target.value) })}
          required
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Reason"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />
        <Button type="submit" disabled={adjustMutation.isPending}>Adjust Stock</Button>
      </form>

      <h2 className="font-semibold mb-2">Low Stock Alerts</h2>
      {isLoading && <p>Loading...</p>}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Product</th>
            <th className="p-3 text-left">Available</th>
          </tr>
        </thead>
        <tbody>
          {lowStock.map((item) => (
            <tr key={item.productId} className="border-b">
              <td className="p-3">{item.title}</td>
              <td className="p-3 text-red-600 font-semibold">{item.available}</td>
            </tr>
          ))}
          {!isLoading && lowStock.length === 0 && (
            <tr><td colSpan={2} className="p-3 text-gray-500">No low stock items</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
