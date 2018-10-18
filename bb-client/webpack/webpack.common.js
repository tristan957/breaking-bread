const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
	entry: {
        main: path.resolve(__dirname, "../src/index.tsx")
    },
	plugins: [
		new CleanWebpackPlugin(
			["dist"],
			{ root: path.resolve(__dirname, "../") })
	],
	output: {
		chunkFilename: "[name].[hash].bundle.js",
		filename: "[name].[hash].js",
		path: path.resolve(__dirname, "../dist"),
		publicPath: "/"
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
    },
	optimization: {
        splitChunks: {
            chunks: "async",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                }
            }
        },
    },
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            // This enables you to import './style.css' into the file that depends on that styling.
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            // For images
            {
                test: /\.(png|svg|jpg|gif|ico)$/,
                use: [
                    "file-loader"
                ]
            },
            // For fonts
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    "file-loader"
                ]
            },
            // For CSVs and TSVs
            {
                test: /\.(csv|tsv)$/,
                use: [
                    "csv-loader"
                ]
            },
            // For XML
            {
                test: /\.xml$/,
                use: [
                    "xml-loader"
                ]
            }
        ]
    }
}
