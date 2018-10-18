const common = require("./webpack.common");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const merge = require("webpack-merge");
const webpack = require("webpack");

module.exports = merge(common, {
	devtool: "inline-source-map",
	devServer: {
		contentBase: "./dist",
		hot: true
	},
	plugins: [
		new HTMLWebpackPlugin({
			favicon: "public/favicon.ico",
            template: "public/index.dev.html"
		}),
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin()
	],
	mode: "development"
});
