/** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

import { withPWA } from "next-pwa";

const nextConfig = {};

export default withPWA({
    ...nextConfig,
    pwa: {
        dest: "public",
        // disable: process.env.NODE_ENV === 'development',
        register: true,
        skipWaiting: true,
        disableDevLogs: true,
    },
});
