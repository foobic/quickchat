module.exports = {
  devServer: {
    disableHostCheck: true,
    watchOptions: {
      poll: true,
    },
  },
  configureWebpack: {
    devtool: 'source-map',
  },
};
