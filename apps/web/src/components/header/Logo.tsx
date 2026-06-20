import Link from "@/components/link";
import { getCurrentLocale } from "@/lib/getCurrentLocale";

export default async function Logo() {
  const locale = await getCurrentLocale();

  return (
    <Link
      href={`/${locale}`}
      className="bg-gray-500 p-2 rounded-full flex justify-center items-center"
      aria-label="Homepage"
    >
      Logo
    </Link>
  );
}
