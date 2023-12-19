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
  rdb: {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    synchronize: process.env.DB_SYNCHRONIZE,
    logging: process.env.DB_LOGGING,
  },
});
