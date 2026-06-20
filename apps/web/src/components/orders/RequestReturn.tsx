"use client";

import { useState } from "react";
import Button from "@/components/button";
import { returnsApi } from "@/lib/api/client";

export default function RequestReturn({
  orderNumber,
  email,
  items,
}: {
  orderNumber: string;
  email?: string;
  items: { productId: string; variantSku?: string; quantity: number }[];
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [selected, setSelected] = useState(items[0]?.productId || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const item = items.find((i) => i.productId === selected);
    if (!item) return;
    try {
      await returnsApi.create({
        orderNumber,
        email,
        items: [{ ...item, reason }],
      });
      setMessage("Return request submitted.");
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit return");
    }
  };

  if (message) return <p className="text-green-600 text-sm">{message}</p>;

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Request Return
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2 bg-gray-50 p-4 rounded max-w-md">
      <h3 className="font-semibold">Request Return</h3>
      <select
        className="w-full border p-2 rounded"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        {items.map((i) => (
          <option key={i.productId} value={i.productId}>
            Product {i.productId.slice(-6)} (qty: {i.quantity})
          </option>
        ))}
      </select>
      <textarea
        className="w-full border p-2 rounded"
        placeholder="Reason for return"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        required
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit">Submit</Button>
        <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </form>
  );
}
