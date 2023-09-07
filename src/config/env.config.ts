export const env = () => ({
  app: {
    node: process.env.NODE_ENV || 'develop',
    host: process.env.CENTER_API_HOST || 'localhost',
    port: +process.env.CENTER_API_PORT || 4000,
  },
});
