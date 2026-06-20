"use client";

import { useEffect, useState } from "react";

const CURRENCIES = ["EGP", "USD", "EUR"] as const;

export default function CurrencySwitcher() {
  const [currency, setCurrency] = useState("EGP");

  useEffect(() => {
    const saved = localStorage.getItem("currency");
    if (saved) setCurrency(saved);
  }, []);

  const handleChange = (c: string) => {
    setCurrency(c);
    localStorage.setItem("currency", c);
    window.dispatchEvent(new CustomEvent("currency-change", { detail: c }));
  };

  return (
    <select
      value={currency}
      onChange={(e) => handleChange(e.target.value)}
      className="border rounded px-2 py-1 text-sm"
      aria-label="Currency"
    >
      {CURRENCIES.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}

export function useCurrency() {
  const [currency, setCurrency] = useState("EGP");
  useEffect(() => {
    setCurrency(localStorage.getItem("currency") || "EGP");
    const handler = (e: Event) => setCurrency((e as CustomEvent).detail);
    window.addEventListener("currency-change", handler);
    return () => window.removeEventListener("currency-change", handler);
  }, []);
  return currency;
}
