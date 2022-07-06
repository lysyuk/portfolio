const path = require('path');
const PugPlugin = require('pug-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'source-map' : 'inline-source-map',

    resolve: {
      alias: {
        Views: path.join(__dirname, 'src/views/'),
        Images: path.join(__dirname, 'src/images/'),
        Fonts: path.join(__dirname, 'src/fonts/'),
        Styles: path.join(__dirname, 'src/styles/'),
        Scripts: path.join(__dirname, 'src/scripts/'),
      },
    },

    output: {
      path: path.join(__dirname, 'dist/'),
      publicPath: '/',
      clean: true,
      filename: 'assets/js/[name].[contenthash:8].js',
    },

    entry: {
      index: 'src/views/pages/home/index.pug',
    },

    plugins: [
      new PugPlugin({
        verbose: !isProd,
        pretty: !isProd,
        modules: [
          PugPlugin.extractCss({
            filename: 'assets/css/[name].[contenthash:8].css',
          }),
        ],
      }),
    ],

    module: {
      rules: [
        {
          test: /\.pug$/,
          loader: PugPlugin.loader, // pug-plugin already contain the pug-loader
          options: {
            method: 'render', // fast method to generate static HTML files
          },
        },
        {
          test: /\.(css|sass|scss)$/i,
          use: ['css-loader', 'sass-loader'],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.svg$/i,
          type: 'asset',
          use: 'svgo-loader',
        },
      ],
    },

    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 9000,
      watchFiles: {
        paths: ['src/**/*.*'],
        options: {
          usePolling: true,
        },
      },
    },
  };
};
