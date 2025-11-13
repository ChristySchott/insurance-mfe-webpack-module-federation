import HtmlWebpackPlugin from 'html-webpack-plugin'
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
    uniqueName: 'autoMfe',
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
      name: 'autoMfe',
      filename: 'remoteEntry.js',
      exposes: {
        './Step2': './src/steps/Step2.tsx',
        './Step3': './src/steps/Step3.tsx',
      },
      remotes: {
        multicotadorHost:
          'multicotadorHost@http://localhost:3000/remoteEntry.js',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.3.1',
          strictVersion: false,
          eager: false,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.3.1',
          strictVersion: false,
          eager: false,
        },
        '@reduxjs/toolkit': {
          singleton: true,
          requiredVersion: '^2.10.1',
          eager: false,
        },
        'react-redux': {
          singleton: true,
          requiredVersion: '^9.2.0',
          eager: false,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
      scriptLoading: 'defer',
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
  ],
  optimization: {
    moduleIds: 'deterministic',
    splitChunks: {
      chunks: 'async',
      maxInitialRequests: 3,
      maxAsyncRequests: 10,
      minSize: 30000,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'async',
          priority: 10,
          reuseExistingChunk: true,
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
    port: 3002,
    hot: true,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    allowedHosts: 'all',
  },
}

export default config
