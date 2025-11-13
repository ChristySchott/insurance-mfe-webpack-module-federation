import HtmlWebpackPlugin from 'html-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import webpack from 'webpack'
import 'webpack-dev-server'
import path from 'path'
import { fileURLToPath } from 'url'

const { ModuleFederationPlugin } = webpack.container

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isProduction = process.env.NODE_ENV === 'production'

const config: webpack.Configuration = {
  entry: './src/index.ts',
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction ? '[name].[contenthash:8].js' : '[name].js',
    chunkFilename: isProduction
      ? '[name].[contenthash:8].chunk.js'
      : '[name].chunk.js',
    clean: true,
    publicPath: 'auto',
    uniqueName: 'multicotadorHost',
    environment: {
      arrowFunction: true,
      const: true,
      destructuring: true,
      dynamicImport: true,
      module: true,
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  modules: false,
                  targets: {
                    esmodules: true,
                  },
                },
              ],
              [
                '@babel/preset-react',
                {
                  runtime: 'automatic',
                  development: !isProduction,
                },
              ],
              '@babel/preset-typescript',
            ],
            cacheDirectory: true,
            cacheCompression: false,
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                localIdentName: isProduction
                  ? '[hash:base64:8]'
                  : '[name]__[local]--[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[hash:8][ext][query]',
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'multicotadorHost',
      filename: 'remoteEntry.js',
      exposes: {
        './useCotacaoStore': './src/hooks/useCotacaoStore',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.3.1',
          eager: true,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.3.1',
          eager: true,
        },
        '@reduxjs/toolkit': {
          singleton: true,
          requiredVersion: '^2.10.1',
          eager: true,
        },
        'react-redux': {
          singleton: true,
          requiredVersion: '^9.2.0',
          eager: true,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
      minify: isProduction
        ? {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            minifyJS: true,
            minifyCSS: true,
          }
        : false,
    }),
    new BundleAnalyzerPlugin(),
  ],
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 25,
      maxAsyncRequests: 25,
      minSize: 20000,
      cacheGroups: {
        defaultVendors: false,
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
          name: 'react-vendors',
          priority: 40,
          reuseExistingChunk: true,
        },
        redux: {
          test: /[\\/]node_modules[\\/](react-redux|@reduxjs)[\\/]/,
          name: 'redux-vendors',
          priority: 35,
          reuseExistingChunk: true,
        },
        forms: {
          test: /[\\/]node_modules[\\/](react-hook-form|@hookform|zod)[\\/]/,
          name: 'form-vendors',
          priority: 30,
          reuseExistingChunk: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 20,
          reuseExistingChunk: true,
        },
        common: {
          minChunks: 2,
          priority: 10,
          reuseExistingChunk: true,
          name: 'common',
        },
      },
    },
    minimize: isProduction,
    usedExports: true,
    sideEffects: true,
  },
  performance: {
    hints: isProduction ? 'warning' : false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  devServer: {
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    allowedHosts: 'all',
  },
}

export default config
