const common = require("./webpack.common");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const merge = require("webpack-merge");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const webpack = require("webpack");

module.exports = merge(common, {
	plugins: [
		new HTMLWebpackPlugin({
			favicon: "public/favicon.ico",
            template: "public/index.prod.html"
		}),
		new UglifyJSPlugin({
			sourceMap: true
		}),
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": "production"
		})
	],
	mode: "production"
});
