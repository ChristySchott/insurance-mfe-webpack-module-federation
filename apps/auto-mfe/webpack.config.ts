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
    uniqueName: 'autoMfe',
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
    }),
  ],
  devServer: {
    port: 3002,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    allowedHosts: 'all',
  },
}

export default config
