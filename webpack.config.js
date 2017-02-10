var path = require('path');

module.exports = {
	entry: ['babel-polyfill', 'whatwg-fetch', './app/index.js'],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
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
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
		]
	}
};