/* eslint-disable max-len */
/* eslint-disable complexity */
const glob = require('glob').sync;
const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-assets-manifest');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const TerserPlugin = require('terser-webpack-plugin');

function Bundle() {
  const plugin = require('./_config/plugins.json');
  const prod = process.env.NODE_ENV === 'production';

  const alias = {
    Src: path.resolve(__dirname, 'src')
  };

  const plugins = [
    new ManifestPlugin({
      output: path.join(__dirname, 'src', 'cache-manifest.json')
    }),
    new MiniCssExtractPlugin({
      filename: 'css/main.css?cb=[chunkhash]',
      chunkFilename: 'main.css?cb=[contenthash]'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      filename: path.resolve(__dirname, 'src', 'site', '_includes', '_partials', 'scripts.njk'),
      template: path.resolve(__dirname, '_templates', 'scripts.njk'),
      chunks: ['common']
    }),
    new HtmlWebpackPlugin({
      inject: false,
      filename: path.resolve(__dirname, 'src', 'site', '_includes', '_partials', 'preload-styles.njk'),
      template: path.resolve(__dirname, '_templates', 'preload-styles.njk'),
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      inject: false,
      filename: path.resolve(__dirname, 'src', 'site', '_includes', '_partials', 'styles.njk'),
      template: path.resolve(__dirname, '_templates', 'styles.njk')
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/images/**/*.jpg',
          to: '[path][name].webp',
          globOptions: {
            ignore: [
              '**/shopify/**'
            ]
          },
          transform(content, absoluteFrom) {
            return absoluteFrom.split('src/')[1];
          }
        }
      ],
    }),
    new ImageminWebpWebpackPlugin(),
    new SpriteLoaderPlugin({ plainSprite: true }),
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
    // new BundleAnalyzerPlugin()
  ];

  return {
    cache: false,

    devtool: !prod ? 'source-map' : 'eval',

    entry: {
      common: path.resolve(__dirname, 'src/scripts/main.ts'),
      main: path.resolve(__dirname, 'src/styles/tailwind.css'),
      sprite: glob('./src/icons/*.svg')
    },

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/[name].bundle.js?cb=[chunkhash]',
      chunkFilename: 'js/[id].chunk.js?cb=[chunkhash]',
      publicPath: '/'
    },

    mode: prod ? 'production' : 'development',

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: ['ts-loader'],
          exclude: /node_modules/
        },
        {
          test: /\.css$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '/'
              }
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                url: false
              }
            },
            { loader: 'postcss-loader' }
          ]
        },
        {
          test: /\.svg$/,
          loader: 'svg-sprite-loader',
          include: path.resolve(__dirname, 'src/icons'),
          options: {
            extract: true,
            spriteFilename: 'icons/sprite.svg'
          },
        }
      ]
    },

    optimization: {
      minimizer: prod ? [new TerserPlugin(plugin.uglify)] : [new TerserPlugin({
        terserOptions: {
          minimize: false,
          warnings: false,
          mangle: false
        }
      })]
    },

    plugins,

    resolve: {
      alias,
      extensions: ['.ts', '.js']
    },

    watch: prod ? false : true
  };
}

module.exports = Bundle();
