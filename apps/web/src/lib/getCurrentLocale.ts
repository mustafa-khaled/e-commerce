import { headers } from "next/headers";
import { Locale } from "@/i18n.config";

export async function getCurrentLocale() {
  const url = (await headers()).get("x-url");
  const locale = url?.split("/")[3] as Locale;
  return locale;
}
