const { createProxyMiddleware } = require("http-proxy-middleware");

/**
 * When using `npm start`, forward API paths to local Flask instances
 * (run backends on 5000 / 5001 or adjust targets below).
 */
module.exports = function (app) {
  app.use(
    "/dev/api",
    createProxyMiddleware({
      target: "http://127.0.0.1:5000",
      changeOrigin: true,
      pathRewrite: { "^/dev/api": "/api" },
    })
  );
  app.use(
    "/prod/api",
    createProxyMiddleware({
      target: "http://127.0.0.1:5001",
      changeOrigin: true,
      pathRewrite: { "^/prod/api": "/api" },
    })
  );
};
