/** @type {import('next').NextConfig} */

const withImages = require('next-images');

module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  ...withImages(),
  publicRuntimeConfig: {
    staticFolder: './public',
  },
};
