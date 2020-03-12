module.exports = {
  css: {
    extract: false,
  },
  pages: {
    index: {
      entry: './examples/main.js',
    },
  },
  devServer: {
    disableHostCheck: true,
  },
};
