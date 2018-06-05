const ConfigBuilder = require('@udir/udir-webpack-config');

module.exports = new ConfigBuilder()
  .withDev()
  .withPort(1337)
  .withHtml({ filename: '../../Views/App/Index.cshtml' })
  .build();

