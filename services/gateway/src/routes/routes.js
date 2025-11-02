// const libraryauthRoutes = require("../../../libraries-auth-service");
// const studentauthRoutes = require("../../../students-auth-service");

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  // Library Auth Service (port 3004)
  app.use(
    "/library-auth",
    createProxyMiddleware({
      target: "http://localhost:3004",
      changeOrigin: true,
    })
  );

  // Student Auth Service (port 3005)
  app.use(
    "/student-auth",
    createProxyMiddleware({
      target: "http://localhost:3005",
      changeOrigin: true,
    })
  );
};

// module.exports = (app) => {
//   app.use("/library-auth", libraryauthRoutes);
//   app.use("/student-auth", studentauthRoutes);
// };
