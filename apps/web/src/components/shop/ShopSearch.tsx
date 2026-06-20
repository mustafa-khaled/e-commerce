"use client";

import { useState } from "react";
import Menu from "@/components/menu";
import { catalogApi } from "@/lib/api/client";
import { Product } from "@/types";

function mapProduct(p: {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  variants?: Product["variants"];
}): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.title,
    description: p.description,
    basePrice: p.priceAfterDiscount || p.price,
    image: p.imageCover,
    variants: p.variants,
  };
}

export default function ShopSearch({ locale }: { locale: string }) {
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const res = await catalogApi.getProducts({ page: 1, locale, keyword });
      setProducts(res.data.map(mapProduct));
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
        <input
          className="flex-1 border p-2 rounded"
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Search
        </button>
      </form>
      {loading && <p className="mt-2 text-sm text-gray-500">Searching...</p>}
      {searched && !loading && products.length === 0 && (
        <p className="mt-2 text-sm text-gray-500">No products found.</p>
      )}
      {products.length > 0 && (
        <div className="mt-4">
          <Menu data={products} />
        </div>
      )}
    </div>
  );
}
