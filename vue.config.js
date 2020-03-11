module.exports = {
  css: {
    extract: false,
  },
  pages: {
    index: {
      entry: './docs/main.js',
    },
  },
  devServer: {
    disableHostCheck: true,
  },
};
