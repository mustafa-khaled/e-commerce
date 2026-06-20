"use client";

import { formatCurrency } from "@/lib/formatters";
import { useState } from "react";
import { Product } from "@/types";
import Button from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectCartItems,
  selectCartMeta,
  updateItemQuantity,
} from "@/redux/features/cart/cartSlice";
import { getItemQuantity } from "@/lib/cart";
import { useAddToCartApi } from "@/lib/api/hooks/use-cart";

export default function AddToCart({ item }: { item: Product }) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCartItems);
  const { cartId } = useAppSelector(selectCartMeta);
  const [open, setOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(item.variants?.[0]?.sku);
  const [error, setError] = useState("");
  const addMutation = useAddToCartApi();

  const activeVariant = item.variants?.find((v) => v.sku === selectedVariant);
  const price = activeVariant?.price ?? item.basePrice;

  const handleAddToCart = async () => {
    if (!cartId) {
      setError("Cart not ready. Please try again.");
      return;
    }
    setError("");
    try {
      await addMutation.mutateAsync({
        cartId,
        productId: item.id,
        quantity: 1,
        variantSku: selectedVariant,
      });
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add to cart");
    }
  };

  const handleQuantityChange = async (type: "increase" | "decrease") => {
    if (!cartId) return;
    const currentQty = getItemQuantity(item.id, cart, selectedVariant);
    const newQty = type === "increase" ? currentQty + 1 : currentQty - 1;
    if (newQty <= 0) {
      dispatch(updateItemQuantity({ id: item.id, type: "decrease", variantSku: selectedVariant }));
      return;
    }
    try {
      await addMutation.mutateAsync({
        cartId,
        productId: item.id,
        quantity: type === "increase" ? 1 : -1,
        variantSku: selectedVariant,
      });
    } catch {
      dispatch(updateItemQuantity({ id: item.id, type, variantSku: selectedVariant }));
    }
  };

  const itemQuantity = getItemQuantity(item.id, cart, selectedVariant);

  if (itemQuantity) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQuantityChange("decrease")}
          className="px-3 py-1 bg-gray-300 rounded text-lg"
          disabled={addMutation.isPending}
        >
          -
        </button>
        <span className="px-3 font-semibold">{itemQuantity}</span>
        <button
          onClick={() => handleQuantityChange("increase")}
          className="px-3 py-1 bg-blue-500 text-white rounded text-lg"
          disabled={addMutation.isPending}
        >
          +
        </button>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Add To Cart</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
          <DialogDescription>{item.description}</DialogDescription>
        </DialogHeader>
        {item.variants && item.variants.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Variant</label>
            <select
              className="w-full border p-2 rounded"
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value)}
            >
              {item.variants.map((v) => (
                <option key={v.sku} value={v.sku}>
                  {Object.entries(v.attributes).map(([k, val]) => `${k}: ${val}`).join(", ")}
                </option>
              ))}
            </select>
          </div>
        )}
        <p className="font-bold">{formatCurrency(price)}</p>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <DialogFooter>
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleAddToCart}
            disabled={addMutation.isPending}
          >
            {addMutation.isPending ? "Adding..." : "Add To Cart"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
