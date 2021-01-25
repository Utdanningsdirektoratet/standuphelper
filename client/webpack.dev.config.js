const ConfigBuilder = require('@utdanningsdirektoratet/udir-webpack-config');

module.exports = new ConfigBuilder()
  .withDev()
  .withPort(1337)
  .withEntry({ filename: '../../Views/App/Index.cshtml' })
  .build();
