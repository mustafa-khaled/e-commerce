"use client";

import { getCartQuantity, getSubTotal } from "@/lib/cart";
import { formatCurrency } from "@/lib/formatters";
import {
  selectCartItems,
  removeItemFromCart,
  updateItemQuantity,
  clearCart,
  CartItem,
} from "@/redux/features/cart/cartSlice";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import Image from "next/image";
import Link from "@/components/link";
import { useParams } from "next/navigation";

export default function CartItems() {
  const cart = useAppSelector(selectCartItems);
  const dispatch = useAppDispatch();
  const { locale } = useParams();

  const cartQuantity = getCartQuantity(cart);
  const subTotal = getSubTotal(cart);

  return (
    <div className="bg-white p-4 w-full max-w-2xl mx-auto rounded shadow">
      {cart.length ? (
        <div className="space-y-4">
          {cart.map((item: CartItem) => (
            <div
              key={`${item.id}-${item.variantSku || ""}`}
              className="flex items-center bg-gray-50 p-4 rounded-lg"
            >
              <Image src={item.image} alt={item.name} width={80} height={80} className="rounded-md" />
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-900 font-medium">
                  {formatCurrency(item.basePrice * (item.quantity || 1))}
                </p>
                <div className="flex items-center mt-2 space-x-2">
                  <button
                    onClick={() => dispatch(updateItemQuantity({ id: item.id, type: "decrease", variantSku: item.variantSku }))}
                    className="px-3 py-1 bg-gray-300 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => dispatch(updateItemQuantity({ id: item.id, type: "increase", variantSku: item.variantSku }))}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => dispatch(removeItemFromCart({ id: item.id, variantSku: item.variantSku }))}
                    className="px-3 py-1 bg-red-500 text-white rounded ml-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-2">
            <span>Subtotal: {formatCurrency(subTotal)}</span>
            <span className="font-bold">Total: {formatCurrency(subTotal)}</span>
          </div>
          <Link href={`/${locale}/checkout`} className="block w-full text-center py-2 bg-green-600 text-white rounded">
            Proceed to Checkout
          </Link>
          <button
            className="w-full py-2 bg-red-500 text-white rounded"
            onClick={() => dispatch(clearCart())}
          >
            Clear cart ({cartQuantity})
          </button>
        </div>
      ) : (
        <p className="text-center">No items in your cart!</p>
      )}
    </div>
  );
}
