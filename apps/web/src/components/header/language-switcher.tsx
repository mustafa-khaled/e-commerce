"use client";

import { Languages } from "@/constants/enums";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useParams();

  const switchLanguage = (newLocale: string) => {
    const path =
      pathname?.replace(`/${locale}`, `/${newLocale}`) ?? `/${newLocale}`;
    router.push(path);
  };

  return (
    <div className="flex">
      {locale === Languages.ARABIC ? (
        <button onClick={() => switchLanguage(Languages.ENGLISH)}>
          English
        </button>
      ) : (
        <button onClick={() => switchLanguage(Languages.ARABIC)}>
          العربية
        </button>
      )}
    </div>
  );
}
