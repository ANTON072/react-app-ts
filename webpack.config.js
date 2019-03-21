const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const ENV = process.env.NODE_ENV || 'development';
const isProd = ENV !== 'development';
const output = isProd ? 'build' : 'public';

module.exports = {
  entry: ['./src/index.tsx'],
  output: {
    filename: 'js/[name].[hash].js',
    chunkFilename: 'js/[id].[hash].js',
    publicPath: '/',
    path: path.resolve(__dirname, output)
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[id].[hash].css'
    }),
    // 型エラーのみを検知する
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true })
  ].concat(isProd ? [new CleanWebpackPlugin()] : []),
  module: {
    rules: [
      {
        test: /\.*(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            // webpackをマルチスレッド化
            loader: 'thread-loader',
            options: {
              workers: require('os').cpus().length - 1,
              poolTimeout: Infinity
            }
          },
          {
            loader: 'babel-loader'
          },
          {
            loader: 'ts-loader',
            options: {
              // 型を無視する
              happyPackMode: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [].concat(isProd ? [require('cssnano')] : [])
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'img/[hash].[ext]',
              fallback: 'file-loader'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css']
  },
  devServer: {
    contentBase: 'public',
    host: 'localhost'
  }
};
