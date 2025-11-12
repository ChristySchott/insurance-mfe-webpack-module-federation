import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
import 'webpack-dev-server'
import path from 'path'
import { fileURLToPath } from 'url'

const { ModuleFederationPlugin } = webpack.container

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config: webpack.Configuration = {
  entry: './src/index.ts',
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: 'auto',
    uniqueName: 'multicotadorHost',
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
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
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
    }),
  ],
  devServer: {
    port: 3000,
    hot: true,
    open: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    allowedHosts: 'all',
  },
}

export default config
