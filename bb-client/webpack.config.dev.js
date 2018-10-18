const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: {
    main: './src/Index.tsx'
  },
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: '[name].bundle.js',
  },
  watch: true,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css']
  },
  devServer: {
    contentBase: path.join(__dirname, '../dist/'),
    port: 3000
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
        // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
        { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

        { test: /\.css$/, loader: "style-loader!css-loader" },
        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

        { test: /\.(pdf|jpg|jpeg|png|gif|svg|ico)$/,
          use: [
              {
                  loader: 'url-loader'
              },
          ]}
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      showErrors: true,
      title: 'React-TS-Webpack App',
      path: path.join(__dirname, '../dist/'),
      hash: true
    })
  ]

}