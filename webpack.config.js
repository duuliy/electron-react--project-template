const path = require('path')
const webpack = require("webpack")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ProgressBarPlugin = require("progress-bar-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const apiMocker = require('mocker-api')

const env = process.env.NODE_ENV || 'dev'
const isDev = env === 'dev'
const version = '0.0.1'
const lessModuleRegex = /\.module\.less$/

module.exports = () => {
  const options = {
    target: "web",
    mode: isDev ? 'development' : 'production',
    entry: './src/index.js',
    output: {
      filename: '[name].[hash].js',
      path: path.join(__dirname, 'dist'),
      chunkFilename: `${version}/[name].[contenthash].js`,
      publicPath: isDev ? '/' : './',
    },
    devServer: {
      compress: true,
      clientLogLevel: 'warning',
      hot: true,
      inline: true,
      port: 8888,
      host: '0.0.0.0',
      before: app => {
        apiMocker(app, path.resolve('./mock/index'), {
          changeHost: true,
        })
      },
      proxy: [
        {
          context: ['/plugins'],
          // target: 'http://profile-test.longxintec.com:10889',
          // target: 'http://www.profile-test.com',
          target: 'http://192.168.7.131:9099',
          changeOrigin: true,

        }
      ],
    },
    module: {
      rules: [
        {
          test: /\.(j|t)s[x]?$/,
          use: [{
            loader: require.resolve('babel-loader'),
            options: {
              cacheDirectory: true,
            },
          }],
          include: [
            path.join(__dirname, 'src'),
            path.join(__dirname, 'mock'),
          ],
        },
        {
          test: /\.(le|c)ss$/,
          exclude: [/\.module\.css$/, lessModuleRegex],
          use: isDev
            ? [
              { loader: "style-loader" },
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1
                }
              },

              {
                loader: "postcss-loader",
                options: { sourceMap: true }
              },
              {
                loader: "less-loader",
                options: {
                  sourceMap: true,
                  lessOptions: {
                    javascriptEnabled: true
                  }
                }
              }]
            : [MiniCssExtractPlugin.loader,
              'css-loader',
              'postcss-loader',
            {
              loader: "less-loader",
              options: {
                sourceMap: false,
                lessOptions: {
                  javascriptEnabled: true
                }
              }
            }
            ],
        },
        {
          test: lessModuleRegex,
          include: [path.resolve(__dirname, 'src')],
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 2,
                modules: {
                  localIdentName: '[name]-[local]-[hash:base64:5]'
                },
              },
            },
            'postcss-loader',
          ],
        },
        {
          test: /\.(jpg|jpeg|png|gif|cur|ico|eot|ttf|svg|woff|woff2)$/,
          exclude: [path.resolve(__dirname, './src/assets/icons')],
          use: [
            {
              loader: "file-loader",
              options: {
                name: `${version}/[name].[hash:8].[ext]`,
                limit: 50000
              }
            }
          ]
        },
        {
          test: /^((?!\.color).)*((?!\.color).)\.svg$/,
          include: [path.resolve(__dirname, './src/assets/icons')],
          use: [
            { loader: 'svg-sprite-loader' },
            {
              loader: 'svgo-loader',
              options: {
                plugins: [
                  { removeTitle: true },
                  { convertColors: { shorthex: true } },
                  { convertPathData: true },
                  { removeComments: true },
                  { removeDesc: true },
                  { removeUselessDefs: true },
                  { removeEmptyAttrs: true },
                  { removeHiddenElems: true },
                  { removeEmptyText: true },
                  { removeUselessStrokeAndFill: true },
                  { moveElemsAttrsToGroup: true },
                  { removeStyleElement: true },
                  { cleanupEnableBackground: true },
                  { removeAttrs: { attrs: '(stroke|fill|filter)' } },
                ],
              },
            },
          ],
        },
      ]
    },
    resolve: {
      extensions: [".js", ".jsx", ".json", ".less", ".css", ".ts", ".tsx"],
      enforceExtension: false,
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@a': path.resolve(__dirname, './src/assets'),
        '@p': path.resolve(__dirname, './public'),
        '@c': path.resolve(__dirname, './src/components'),
        '@u': path.resolve(__dirname, './src/utils'),
        '@s': path.resolve(__dirname, './src/services'),
        '@stores': path.resolve(__dirname, './src/stores')
      },
    },
    optimization: {
      concatenateModules: true,
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors"
          },
          commons: {
            name: "commons",
            minChunks: 2,
            chunks: "initial"
          },
          styles: {
            name: "styles",
            test: /\.css$/,
            chunks: "all",
            minChunks: 2,
            enforce: true
          }
        }
      },
      minimizer: isDev
        ? []
        : [
          new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: false,
            uglifyOptions: {
              compress: {
                drop_debugger: false,
                drop_console: false
              }
            }
          }),
          new OptimizeCssAssetsPlugin({
            cssProcessor: require("cssnano"),
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true
          })
        ],
    },
    plugins: [
      new LodashModuleReplacementPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.ProvidePlugin({
        React: 'react',
        moment: 'moment',
      }),
      new ProgressBarPlugin(),
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        options: {
          runtimeChunk: {
            name: "runtime"
          }
        }
      }),
      new HtmlWebpackPlugin({
        title: "app",
        filename: "index.html",
        inject: true,
        template: path.resolve(__dirname, "./src/index.html"),
        hash: true
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'public'),
            to: path.resolve(__dirname, 'dist/public'),
          },
        ],
      })
    ],
  }
  if (isDev) {
    options.plugins = options.plugins.concat([new webpack.HotModuleReplacementPlugin()])
    options.devtool = 'cheap-module-eval-source-map'
  } else {
    options.plugins = options.plugins.concat([
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: `${version}/[name].css`,
        chunkFilename: `${version}/[name].[contenthash].css`,
      }),
    ])
  }

  return options
}





