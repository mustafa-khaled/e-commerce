export function formatCurrency(amount: number, currency = 'EGP', locale = 'ar-EG') {
  const localeMap: Record<string, string> = {
    EGP: 'ar-EG',
    USD: 'en-US',
    EUR: 'de-DE',
  };
  return new Intl.NumberFormat(localeMap[currency] || locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
