import { formatCurrency } from "@/lib/formatters";
import { Product } from "@/types";
import AddToCart from "./AddToCart";
import Image from "next/image";
import Link from "@/components/link";

export default function MenuItem({ product, locale = "ar" }: { product: Product; locale?: string }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4">
        <Link href={product.slug ? `/${locale}/shop/${product.slug}` : "#"}>
          <Image
            src={product.image}
            alt={product.name}
            width={140}
            height={140}
            className="mb-2"
          />
        </Link>
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
        <p className="text-primary font-bold my-2">
          {formatCurrency(product.basePrice)}
        </p>
        <AddToCart item={product} />
      </div>
    </div>
  );
}
