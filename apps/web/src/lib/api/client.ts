const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export type FetchOptions = {
  method?: string;
  body?: unknown;
  guestId?: string;
  locale?: string;
  currency?: string;
  idempotencyKey?: string;
  _retry?: boolean;
};

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.ok)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.guestId) headers['x-guest-id'] = options.guestId;
  if (options.locale) headers['Accept-Language'] = options.locale;
  if (options.currency) headers['x-currency'] = options.currency;
  if (options.idempotencyKey) headers['idempotency-key'] = options.idempotencyKey;

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
    credentials: 'include',
  });

  if (
    res.status === 401 &&
    !options._retry &&
    !path.startsWith('/auth/refresh') &&
    !path.startsWith('/auth/sign-in') &&
    !path.startsWith('/auth/sign-up')
  ) {
    const refreshed = await tryRefreshSession();
    if (refreshed) {
      return apiFetch<T>(path, { ...options, _retry: true });
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'API error');
  }

  return res.json();
}

export interface CatalogProduct {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  images?: string[];
  ratingsAverage?: number;
  variants?: { sku: string; price: number; quantity: number; attributes: Record<string, string> }[];
}

export const catalogApi = {
  getProducts: (params?: { page?: number; locale?: string; currency?: string; keyword?: string }) =>
    apiFetch<{ data: CatalogProduct[]; meta: { total: number; page: number; limit: number } }>(
      `/catalog/products?${new URLSearchParams({
        ...(params?.page ? { page: String(params.page) } : {}),
        ...(params?.keyword ? { keyword: params.keyword } : {}),
      })}`,
      { locale: params?.locale, currency: params?.currency },
    ),
  getProduct: (slug: string, locale?: string, currency?: string) =>
    apiFetch<{ data: CatalogProduct }>(`/catalog/products/${slug}`, { locale, currency }),
};

export const cartApi = {
  createGuest: () =>
    apiFetch<{ data: { cartId: string; items: unknown[] }; guestId: string }>('/cart/guest', {
      method: 'POST',
    }),
  get: (guestId?: string) =>
    apiFetch<{ data: { cartId: string; items: unknown[] } }>('/cart', { guestId }),
  addItem: (
    body: { cartId: string; productId: string; quantity: number; variantSku?: string },
    guestId?: string,
  ) => apiFetch<{ data: { cartId: string; items: CartApiItem[] } }>('/cart/items', { method: 'POST', body, guestId }),
  merge: () =>
    apiFetch<{ data: { cartId: string; items: CartApiItem[] } }>('/cart/merge', { method: 'POST' }),
};

export interface CartApiItem {
  productId: string;
  title: string;
  image?: string;
  quantity: number;
  unitPrice: number;
  variantSku?: string;
}

export const checkoutApi = {
  preview: (body: unknown) =>
    apiFetch<{ data: { total: number; shipping: number; tax: number } }>('/checkout/preview', {
      method: 'POST',
      body,
    }),
};

export const orderApi = {
  create: (body: unknown, guestId?: string, idempotencyKey?: string) =>
    apiFetch<{ data: { _id: string; orderNumber: string } }>('/orders', {
      method: 'POST',
      body,
      guestId,
      idempotencyKey,
    }),
  track: (orderNumber: string, email: string) =>
    apiFetch<{ data: Record<string, unknown> }>(
      `/orders/track?orderNumber=${orderNumber}&email=${encodeURIComponent(email)}`,
    ),
  list: () => apiFetch<{ data: unknown[] }>('/orders'),
};

export const authApi = {
  signIn: (email: string, password: string) =>
    apiFetch<{ message: string; data: AuthUser }>('/auth/sign-in', {
      method: 'POST',
      body: { email, password },
    }),
  signUp: (name: string, email: string, password: string) =>
    apiFetch<{ message: string; data: AuthUser }>('/auth/sign-up', {
      method: 'POST',
      body: { name, email, password },
    }),
  logout: () => apiFetch<{ message: string }>('/auth/logout', { method: 'POST' }),
  getMe: () => apiFetch<{ data: AuthUser }>('/auth/me'),
  refresh: () => apiFetch<{ message: string }>('/auth/refresh', { method: 'POST' }),
  resetPassword: (email: string) =>
    apiFetch('/auth/reset-password', { method: 'POST', body: { email } }),
  verifyCode: (email: string, code: string) =>
    apiFetch('/auth/verify-code', { method: 'POST', body: { email, code } }),
  changePassword: (email: string, password: string) =>
    apiFetch('/auth/change-password', { method: 'POST', body: { email, password } }),
};

export const paymentApi = {
  createKashierSession: (orderId: string, redirectUrl: string) =>
    apiFetch<{ data: { paymentUrl: string } }>('/payments/kashier/session', {
      method: 'POST',
      body: { orderId, redirectUrl },
    }),
};

export const shippingApi = {
  getMethods: (country: string, subtotal: number, city?: string) =>
    apiFetch<{ data: { id: string; name: string; cost: number }[] }>(
      `/shipping/zones/${country}/methods?subtotal=${subtotal}${city ? `&city=${city}` : ''}`,
    ),
};

export const adminApi = {
  getOverview: () =>
    apiFetch<{
      data: {
        ordersCount: number;
        grossRevenue: number;
        avgOrderValue: number;
        pendingReturns: number;
      };
    }>('/admin/reports/overview'),
  getOrders: () => apiFetch<{ data: AdminOrder[] }>('/admin/orders'),
  updateOrderStatus: (id: string, status: string) =>
    apiFetch(`/admin/orders/${id}/status`, { method: 'PATCH', body: { status } }),
  getCampaigns: () => apiFetch<{ data: Campaign[] }>('/admin/campaigns'),
  getCampaign: (id: string) => apiFetch<{ data: Campaign }>(`/admin/campaigns/${id}`),
  createCampaign: (body: CreateCampaignBody) =>
    apiFetch<{ message: string; data: Campaign }>('/admin/campaigns', { method: 'POST', body }),
  updateCampaign: (id: string, body: UpdateCampaignBody) =>
    apiFetch<{ message: string; data: Campaign }>(`/admin/campaigns/${id}`, { method: 'PATCH', body }),
  deleteCampaign: (id: string) =>
    apiFetch<{ message: string; data: Campaign }>(`/admin/campaigns/${id}`, { method: 'DELETE' }),
  sendCampaign: (id: string) =>
    apiFetch<{ message: string; data: Campaign }>(`/admin/campaigns/${id}/send`, { method: 'POST' }),
  getCampaignStats: (id: string) =>
    apiFetch<{ message: string; data: CampaignStats }>(`/admin/campaigns/${id}/stats`),
  getLowStock: (threshold = 10) =>
    apiFetch<{ data: { productId: string; title: string; available: number }[] }>(
      `/admin/inventory/low-stock?threshold=${threshold}`,
    ),
  adjustInventory: (body: { productId: string; delta: number; reason: string; variantSku?: string }) =>
    apiFetch('/admin/inventory/adjustments', { method: 'POST', body }),
  getSales: (groupBy: 'day' | 'product' = 'day') =>
    apiFetch<{ data: unknown[] }>(`/admin/reports/sales?groupBy=${groupBy}`),
  getReturns: () => apiFetch<{ data: AdminReturn[] }>('/admin/returns'),
  updateReturnStatus: (id: string, status: string) =>
    apiFetch(`/admin/returns/${id}/status`, { method: 'PATCH', body: { status } }),
};

export interface AdminOrder {
  _id: string;
  orderNumber: string;
  status: string;
  pricing?: { total: number; currency: string };
}

export interface AdminReturn {
  _id: string;
  returnNumber: string;
  status: string;
  orderId: string;
}

export interface Campaign {
  _id: string;
  name: string;
  subject: string;
  templateId: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent';
  stats: { sent: number; opened: number; clicked: number; failed: number };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignBody {
  name: string;
  subject: string;
  templateId: string;
}

export interface UpdateCampaignBody {
  name?: string;
  subject?: string;
  templateId?: string;
}

export interface CampaignStats {
  sent: number;
  opened: number;
  clicked: number;
  failed: number;
}

export const productApi = {
  list: (page = 1) => apiFetch<{ data: AdminProduct[]; meta?: { total: number } }>(`/product?page=${page}`),
  get: (id: string) => apiFetch<{ data: AdminProduct }>(`/product/${id}`),
  create: (body: CreateProductBody) => apiFetch('/product', { method: 'POST', body }),
  update: (id: string, body: Partial<CreateProductBody>) =>
    apiFetch(`/product/${id}`, { method: 'PATCH', body }),
  delete: (id: string) => apiFetch(`/product/${id}`, { method: 'DELETE' }),
};

export interface AdminProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  priceAfterDiscount?: number;
  quantity: number;
  imageCover: string;
  isActive?: boolean;
  category?: string;
}

export interface CreateProductBody {
  title: string;
  description: string;
  quantity: number;
  imageCover: string;
  images?: string[];
  price: number;
  priceAfterDiscount?: number;
  category: string;
  brand?: string;
}

export const reviewApi = {
  getByProduct: (productId: string) =>
    apiFetch<{ data: Review[] }>(`/review/product/${productId}`),
  create: (body: { product: string; rating: number; comment: string }) =>
    apiFetch('/review', { method: 'POST', body }),
};

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  user?: { name: string };
}

export const returnsApi = {
  create: (body: {
    orderNumber: string;
    email?: string;
    items: { productId: string; variantSku?: string; quantity: number; reason: string }[];
  }) => apiFetch('/returns', { method: 'POST', body }),
};

export const userApi = {
  getMe: () => apiFetch<{ data: AuthUser & { phoneNumber?: string; addresses?: unknown[] } }>('/user/me'),
  updateMe: (body: { name?: string; phoneNumber?: string }) =>
    apiFetch('/user/me', { method: 'PATCH', body }),
};
