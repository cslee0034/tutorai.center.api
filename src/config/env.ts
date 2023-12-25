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
    host: process.env.RDB_HOST,
    port: +process.env.RDB_PORT,
    username: process.env.RDB_USERNAME,
    password: process.env.RDB_PASSWORD,
    name: process.env.RDB_NAME,
    synchronize: process.env.RDB_SYNCHRONIZE,
    logging: process.env.RDB_LOGGING,
  },
  cache: {
    port: process.env.CACHE_PORT,
  },
  encrypt: {
    salt: process.env.ENCRYPT_SALT,
  },
});
