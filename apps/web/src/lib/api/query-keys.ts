export const authKeys = {
  all: ['auth'] as const,
  me: ['auth', 'me'] as const,
};

export const orderKeys = {
  all: ['orders'] as const,
  list: ['orders', 'list'] as const,
  track: (orderNumber: string, email: string) => ['orders', 'track', orderNumber, email] as const,
};

export const adminKeys = {
  all: ['admin'] as const,
  overview: ['admin', 'overview'] as const,
  orders: ['admin', 'orders'] as const,
  campaigns: ['admin', 'campaigns'] as const,
  products: ['admin', 'products'] as const,
  inventory: ['admin', 'inventory'] as const,
  reports: ['admin', 'reports'] as const,
  returns: ['admin', 'returns'] as const,
};

export const cartKeys = {
  all: ['cart'] as const,
  guest: ['cart', 'guest'] as const,
};

export const checkoutKeys = {
  all: ['checkout'] as const,
  preview: (hash: string) => ['checkout', 'preview', hash] as const,
  shipping: (country: string, subtotal: number, city?: string) =>
    ['checkout', 'shipping', country, subtotal, city] as const,
};
