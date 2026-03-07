export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.MONGODB_URL || '',
  },
});
