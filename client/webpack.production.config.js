const path = require('path');
const ConfigBuilder = require('@udir/udir-webpack-config');

module.exports = new ConfigBuilder()
  .withProd()
  .withHtml({ filename: '../../Views/App/Index.cshtml' })
  .withConfig({
    output: {
      publicPath: '/dist/',
      path: path.join(__dirname, '../wwwroot/dist')
    }
  })
  .build();
