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
    priceAfterDiscount: p.priceAfterDiscount,
    variants: p.variants,
  };
}

export async function getBestSellers(locale = "ar", currency = "EGP") {
  try {
    const res = await catalogApi.getProducts({ page: 1, locale, currency });
    return res.data.map(mapProduct);
  } catch {
    return [];
  }
}

export async function getProducts(locale = "ar", currency = "EGP", page = 1) {
  const res = await catalogApi.getProducts({ page, locale, currency });
  return { products: res.data.map(mapProduct), meta: res.meta };
}

export async function getProductBySlug(slug: string, locale = "ar", currency = "EGP") {
  const res = await catalogApi.getProduct(slug, locale, currency);
  return res.data ? mapProduct(res.data) : null;
}
