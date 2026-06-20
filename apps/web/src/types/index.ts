export interface Product {
  id: string;
  slug?: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  priceAfterDiscount?: number;
  variants?: { sku: string; price: number; attributes: Record<string, string> }[];
}
