// const libraryauthRoutes = require("../../../libraries-auth-service");
// const studentauthRoutes = require("../../../students-auth-service");
require("dotenv").config();
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  // Library Auth Service (port 3004)
  app.use(
    "/library-auth",
    createProxyMiddleware({
      target: process.env.LIBRARY_AUTH_URL,
      changeOrigin: true,
    })
  );

  // Student Auth Service (port 3005)
  app.use(
    "/student-auth",
    createProxyMiddleware({
      target: process.env.STUDENT_AUTH_URL,
      changeOrigin: true,
    })
  );
};

// module.exports = (app) => {
//   app.use("/library-auth", libraryauthRoutes);
//   app.use("/student-auth", studentauthRoutes);
// };
