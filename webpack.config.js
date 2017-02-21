var path = require('path');
var webpack = require('webpack')

module.exports = {
	entry: [
		'react-hot-loader/patch',
		'webpack-dev-server/client?https://localhost:8080',
	    'webpack/hot/only-dev-server',
		'babel-polyfill',
		'whatwg-fetch',
		'./app/index.js'
	],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: 'https://localhost:8080/'
	},
	module: {
		rules: [
			{
				test: /node_modules\/.*\.css$/,
				use: [ 'style-loader', 'css-loader' ]
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: [ 'style-loader', 'css-loader?modules' ]
			},
			{ test: /\.js$/, exclude: /node_modules/, loaders: ["babel-loader"] }
		]
	},
	devServer: {
		hot: true,
		https: true
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
	    new webpack.NamedModulesPlugin(),
	    // prints more readable module names in the browser console on HMR updates
    ]
};