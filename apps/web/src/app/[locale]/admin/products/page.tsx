"use client";

import { useState } from "react";
import Button from "@/components/button";
import {
  useAdminProducts,
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
} from "@/lib/api/hooks/use-admin";

const emptyForm = {
  title: "",
  description: "",
  quantity: 10,
  imageCover: "https://placehold.co/400",
  price: 100,
  priceAfterDiscount: 0,
  category: "",
};

export default function AdminProductsPage() {
  const { data: products = [], isLoading } = useAdminProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.category) {
      setError("Category ID is required (MongoDB ObjectId)");
      return;
    }
    try {
      const body = {
        ...form,
        priceAfterDiscount: form.priceAfterDiscount || undefined,
        images: [],
      };
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, body });
        setEditingId(null);
      } else {
        await createMutation.mutateAsync(body);
      }
      setForm(emptyForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    }
  };

  const startEdit = (p: (typeof products)[0]) => {
    setEditingId(p._id);
    setForm({
      title: p.title,
      description: p.description,
      quantity: p.quantity,
      imageCover: p.imageCover,
      price: p.price,
      priceAfterDiscount: p.priceAfterDiscount || 0,
      category: (p.category as string) || "",
    });
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Products</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-3 max-w-lg">
        <h2 className="font-semibold">{editingId ? "Edit Product" : "Add Product"}</h2>
        {["title", "description", "imageCover", "category"].map((field) => (
          <input
            key={field}
            className="w-full border p-2 rounded"
            placeholder={field}
            value={form[field as keyof typeof form] as string}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            required={field !== "category" || !editingId}
          />
        ))}
        {["quantity", "price", "priceAfterDiscount"].map((field) => (
          <input
            key={field}
            type="number"
            className="w-full border p-2 rounded"
            placeholder={field}
            value={form[field as keyof typeof form] as number}
            onChange={(e) => setForm({ ...form, [field]: Number(e.target.value) })}
          />
        ))}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-2">
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {editingId ? "Update" : "Create"}
          </Button>
          {editingId && (
            <Button type="button" variant="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {isLoading && <p>Loading products...</p>}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Qty</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b">
              <td className="p-3">{p.title}</td>
              <td className="p-3">{p.price}</td>
              <td className="p-3">{p.quantity}</td>
              <td className="p-3 space-x-2">
                <button className="text-blue-600" onClick={() => startEdit(p)}>Edit</button>
                <button
                  className="text-red-600"
                  onClick={() => deleteMutation.mutate(p._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
