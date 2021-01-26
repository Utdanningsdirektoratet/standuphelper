const path = require('path');
const ConfigBuilder = require('@utdanningsdirektoratet/udir-webpack-config');

module.exports = new ConfigBuilder()
  .withProd()
  .withEntry({ filename: '../Views/App/Index.cshtml' })
  .withConfig({
    output: {
      publicPath: '/dist/',
      path: path.join(__dirname, '../wwwroot/dist')
    }
  })
  .withConfig({
    module: {
      rules: [
        {
          test: /node_modules(\/|\\)vfile(\/|\\)core\.js/,
          use: [{
            loader: 'imports-loader',
            options: {
              type: 'commonjs',
              imports: ['single process/browser process']
            }
          }]
        }
      ]
    }
  })
  .build();
