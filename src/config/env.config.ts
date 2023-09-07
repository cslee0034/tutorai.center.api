export const env = () => ({
  app: {
    node: process.env.NODE_ENV,
    host: process.env.CENTER_API_HOST,
    port: +process.env.CENTER_API_PORT,
  },
});
