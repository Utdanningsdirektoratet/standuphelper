const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Config = require('webpack-config').default;

module.exports = new Config()
  .extend('@udir/udir-react-components/webpack/webpack.prod.config.js')
  .merge({
    devtool: 'source-map',
    resolve: {
      modules: [
        path.join(__dirname, 'app'),
        path.join(__dirname, 'static'),
        'node_modules'
      ],
      extensions: ['.js', '.jsx', '.less']
    },
    entry: [
      'babel-polyfill',
      'whatwg-fetch',
      'url-search-params',
      './index.js'
    ],
    output: {
      path: path.join(__dirname, '../wwwroot/dist'),
      filename: 'bundle-[hash].js',
      publicPath: '/dist/'
    },
    plugins: [
      new CleanWebpackPlugin(['wwwroot/dist'], {
        root: path.resolve(__dirname, '..')
      }),
      new HtmlWebpackPlugin({
        template: 'index-template.html',
        filename: path.join(
          path.resolve(__dirname, '..'),
          'Views/App/Index.cshtml'
        ),
        hash: false,
        devMode: false,
        inject: true
      })
    ]
  });
