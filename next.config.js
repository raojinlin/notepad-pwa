const isDev = process.env.NODE_ENV !== "production";


const withPWA = require('next-pwa')({
  dest: 'public',
  exclude: [
    // add buildExcludes here
    ({ asset, compilation }) => {
      if (
        asset.name.startsWith("server/") ||
        asset.name.match(/^((app-|^)build-manifest\.json|react-loadable-manifest\.json)$/)
      ) {
        return true;
      }

      return isDev && !asset.name.startsWith("static/runtime/");
    }
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = isDev ? nextConfig : withPWA(nextConfig);
