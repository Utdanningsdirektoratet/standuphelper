require('react-hot-loader/patch');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Config = require('webpack-config').default;

module.exports = new Config()
  .extend('@udir/udir-react-components/webpack/webpack.dev.config.js')
  .merge({
    devtool: 'inline-source-map',
    resolve: {
      modules: [
        path.join(__dirname, 'app'),
        path.join(__dirname, 'static'),
        'node_modules'
      ],
      extensions: ['.js', '.jsx', '.less'],
      enforceExtension: false,
      alias: {
        ie: 'component-ie'
      }
    },
    entry: ['webpack-dev-server/client?http://localhost:3000', './index.js'],
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: 'http://localhost:3000/static/'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'index-template.html',
        filename: '../../Views/App/Index.cshtml',
        hash: false,
        devMode: true,
        inject: false
      })
    ]
  });
