const ConfigBuilder = require('@utdanningsdirektoratet/udir-webpack-config');

module.exports = new ConfigBuilder()
  .withDev()
  .withPort(1337)
  .withEntry({ filename: '../../Views/App/Index.cshtml' })
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
