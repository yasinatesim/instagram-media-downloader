const withImages = require('next-images');

module.exports = {
  ...withImages(),
  publicRuntimeConfig: {
    staticFolder: './public',
  },
};
