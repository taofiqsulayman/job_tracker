const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true,
    disableDevLogs: true,
    scope: "/app",
});

const nextConfig = {};

module.exports = withPWA({
    ...nextConfig,
});
