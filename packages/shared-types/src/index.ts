export enum UserRole {
  CUSTOMER = 'customer',
  USER = 'customer',
  ADMIN = 'admin',
  SUPPORT = 'support',
  MARKETING = 'marketing',
  INVENTORY = 'inventory',
}

export enum OrderStatus {
  PENDING_PAYMENT = 'pending_payment',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  RETURN_REQUESTED = 'return_requested',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  COD = 'cod',
  KASHIER = 'kashier',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIAL_REFUND = 'partial_refund',
}

export enum ReturnStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  RECEIVED = 'received',
  REFUNDED = 'refunded',
}

export enum ReservationStatus {
  ACTIVE = 'active',
  COMMITTED = 'committed',
  RELEASED = 'released',
}

export enum CampaignStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  SENDING = 'sending',
  SENT = 'sent',
}

export enum NotificationChannel {
  EMAIL = 'email',
  PUSH = 'push',
}

export const DEFAULT_CURRENCY = 'EGP';
export const SUPPORTED_CURRENCIES = ['EGP', 'USD', 'EUR'] as const;
export const SUPPORTED_LOCALES = ['ar', 'en'] as const;
