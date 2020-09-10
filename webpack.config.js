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
const StylelintPlugin = require('stylelint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Critters = require('critters-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

function Bundle() {
  const plugin = require('./_config/plugins.json');
  const prod = process.env.NODE_ENV === 'prod';

  const alias = {
    '@glidejs/glide': '@glidejs/glide/dist/glide.js',
    Src: path.resolve(__dirname, 'src')
  };

  const plugins = [
    new ManifestPlugin({
      output: path.join(__dirname, 'src', 'cache-manifest.json')
    }),
    new MiniCssExtractPlugin({
      filename: 'css/main.css?cb=[chunkhash]'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      filename: path.resolve(__dirname, 'src', 'site', '_includes', '_partials', 'scripts.njk'),
      template: path.resolve(__dirname, '_templates', 'scripts.njk'),
      chunks: ['common']
    }),
    new HtmlWebpackPlugin({
      inject: false,
      filename: path.resolve(__dirname, 'src', 'site', '_includes', '_partials', 'styles.njk'),
      template: path.resolve(__dirname, '_templates', 'styles.njk')
    }),
    new CopyWebpackPlugin([{
      from: './src/images/**/*.jpg',
      to: '[path][name].webp',
      transformPath(targetPath) {
        return targetPath.split('src/')[1];
      }
    }]),
    new ImageminWebpWebpackPlugin(),
    new StylelintPlugin(plugin.stylelint),
    new SpriteLoaderPlugin({ plainSprite: true }),
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
    // new Critters({
    //   inlineFonts: true,
    //   pruneSource: false,
    // })
    // new BundleAnalyzerPlugin()
  ];

  return {
    cache: false,

    devtool: !prod ? 'source-map' : 'eval',

    entry: {
      common: path.resolve(__dirname, 'src/scripts/main.ts'),
      main: path.resolve(__dirname, 'src/styles/main.scss'),
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
          test: /\.s[ac]ss$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                name: 'main.css?cb=[contenthash]',
                publicPath: '/'
              }
            },
            {
              loader: 'css-loader?-url',
              options: {
                sourceMap: true,
                url: false
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  require('postcss-sort-media-queries'),
                  require('postcss-minify-selectors'),
                  require('postcss-clean')(plugin.cleancss),
                  require('autoprefixer'),
                  require('cssnano')(plugin.cssnano)
                ]
              }
            },
            {
              loader: 'sass-loader'
            }
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
