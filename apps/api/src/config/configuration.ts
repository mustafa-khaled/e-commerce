export default () => ({
  port: parseInt(process.env.PORT || '8080', 10),
  database: {
    host: process.env.MONGODB_URL || '',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  jwt: {
    secret: process.env.JWT_SECRET || '',
    refreshSecret: process.env.JWT_REFRESH_SECRET || '',
    accessExpiresIn: '15m',
    refreshExpiresIn: '7d',
  },
  kashier: {
    merchantId: process.env.KASHIER_MERCHANT_ID || '',
    apiKey: process.env.KASHIER_API_KEY || '',
    secretKey: process.env.KASHIER_SECRET_KEY || '',
    mode: process.env.KASHIER_MODE || 'test',
    currency: process.env.KASHIER_CURRENCY || 'EGP',
  },
});
