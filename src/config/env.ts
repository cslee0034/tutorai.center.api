export const env = () => ({
  app: {
    node: process.env.NODE_ENV,
    host: process.env.CENTER_API_HOST,
    port: +process.env.CENTER_API_PORT,
  },
  http: {
    timeout: process.env.HTTP_TIMEOUT,
    max_redirects: process.env.HTTP_MAX_REDIRECTS,
  },
});
