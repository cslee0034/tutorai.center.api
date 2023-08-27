export const env = () => ({
  app: {
    host: process.env.CENTER_API_HOST || 'localhost',
    port: +process.env.CENTER_API_PORT || 4000,
  },
});
