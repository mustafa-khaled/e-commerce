"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { selectCartItems, selectCartMeta, CartItem } from "@/redux/features/cart/cartSlice";
import { getSubTotal } from "@/lib/cart";
import { formatCurrency } from "@/lib/formatters";
import {
  useCheckoutPreview,
  useKashierSession,
  usePlaceOrder,
  useShippingMethods,
} from "@/lib/api/hooks/use-checkout";
import { useCurrency } from "@/components/header/currency-switcher";
import Button from "@/components/button";

export default function Checkout() {
  const cart = useAppSelector(selectCartItems);
  const { guestId } = useAppSelector(selectCartMeta);
  const { locale } = useParams();
  const currency = useCurrency();
  const subtotal = getSubTotal(cart);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    country: "EG",
    city: "Cairo",
    street: "",
    paymentMethod: "cod",
    shippingMethodId: "",
  });
  const [shippingMethods, setShippingMethods] = useState<{ id: string; name: string; cost: number }[]>([]);
  const [preview, setPreview] = useState<{ total: number; shipping: number; tax: number } | null>(null);
  const [error, setError] = useState("");

  const shippingMutation = useShippingMethods();
  const previewMutation = useCheckoutPreview();
  const placeOrderMutation = usePlaceOrder();
  const kashierMutation = useKashierSession();

  const loading =
    shippingMutation.isPending ||
    previewMutation.isPending ||
    placeOrderMutation.isPending ||
    kashierMutation.isPending;

  const orderItems = cart.map((i: CartItem) => ({
    productId: i.id,
    variantSku: i.variantSku,
    title: i.name,
    quantity: i.quantity || 1,
    unitPrice: i.basePrice,
  }));

  const loadShipping = () => {
    shippingMutation.mutate(
      { country: form.country, subtotal, city: form.city },
      {
        onSuccess: (res) => {
          setShippingMethods(res.data);
          if (res.data[0]) setForm((f) => ({ ...f, shippingMethodId: res.data[0].id }));
        },
        onError: (e) => setError(e instanceof Error ? e.message : "Failed to load shipping"),
      },
    );
  };

  const loadPreview = () => {
    previewMutation.mutate(
      {
        items: orderItems,
        shippingMethodId: form.shippingMethodId,
        country: form.country,
        city: form.city,
        currency,
      },
      {
        onSuccess: (res) => setPreview(res.data),
        onError: (e) => setError(e instanceof Error ? e.message : "Failed to calculate total"),
      },
    );
  };

  const placeOrder = () => {
    setError("");
    placeOrderMutation.mutate(
      {
        body: {
          items: orderItems,
          shippingAddress: {
            fullName: form.fullName,
            phone: form.phone,
            country: form.country,
            city: form.city,
            street: form.street,
          },
          guestEmail: form.email,
          guestPhone: form.phone,
          paymentMethod: form.paymentMethod,
          shippingMethodId: form.shippingMethodId,
          currency,
        },
        guestId,
        idempotencyKey: crypto.randomUUID(),
      },
      {
        onSuccess: (res) => {
          const order = res.data;

          if (form.paymentMethod === "kashier") {
            kashierMutation.mutate(
              {
                orderId: order._id,
                redirectUrl: `${window.location.origin}/${locale}/checkout/success?orderId=${order._id}`,
              },
              {
                onSuccess: (payment) => {
                  window.location.href = payment.data.paymentUrl;
                },
                onError: (e) => setError(e instanceof Error ? e.message : "Payment failed"),
              },
            );
            return;
          }

          window.location.href = `/${locale}/checkout/success?orderNumber=${order.orderNumber}&email=${form.email}`;
        },
        onError: (e) => setError(e instanceof Error ? e.message : "Order failed"),
      },
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <h2 className="text-lg font-semibold">Checkout</h2>
      <input
        className="w-full border p-2 rounded"
        placeholder="Full Name"
        value={form.fullName}
        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
      />
      <input
        className="w-full border p-2 rounded"
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="w-full border p-2 rounded"
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <input
        className="w-full border p-2 rounded"
        placeholder="City"
        value={form.city}
        onChange={(e) => setForm({ ...form, city: e.target.value })}
      />
      <input
        className="w-full border p-2 rounded"
        placeholder="Street Address"
        value={form.street}
        onChange={(e) => setForm({ ...form, street: e.target.value })}
      />
      <button type="button" onClick={loadShipping} className="text-sm text-blue-600">
        Load shipping options
      </button>
      {shippingMethods.length > 0 && (
        <select
          className="w-full border p-2 rounded"
          value={form.shippingMethodId}
          onChange={(e) => setForm({ ...form, shippingMethodId: e.target.value })}
        >
          {shippingMethods.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} - {formatCurrency(m.cost, currency)}
            </option>
          ))}
        </select>
      )}
      <button type="button" onClick={loadPreview} className="text-sm text-blue-600">
        Calculate total
      </button>
      {preview && (
        <div className="text-sm space-y-1">
          <p>Shipping: {formatCurrency(preview.shipping, currency)}</p>
          <p>Tax: {formatCurrency(preview.tax, currency)}</p>
          <p className="font-bold">Total: {formatCurrency(preview.total, currency)}</p>
        </div>
      )}
      <select
        className="w-full border p-2 rounded"
        value={form.paymentMethod}
        onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
      >
        <option value="cod">Cash on Delivery</option>
        <option value="kashier">Pay Online (Kashier)</option>
      </select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button onClick={placeOrder} disabled={loading || !cart.length}>
        {loading ? "Processing..." : "Place Order"}
      </Button>
    </div>
  );
}
