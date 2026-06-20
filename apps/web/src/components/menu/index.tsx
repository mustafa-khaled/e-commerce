import { Product } from "@/types";
import MenuItem from "./MenuItem";

export default function Menu({ data }: { data: Product[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {data.map((product) => (
        <MenuItem product={product} key={product.id} />
      ))}
    </div>
  );
}
