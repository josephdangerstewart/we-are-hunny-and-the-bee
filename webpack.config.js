const path = require('path');

module.exports = {
	devtool: 'inline-source-map',
	entry: './src/index.ts',
	mode: process.env.NODE_MODULES || 'development',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.svg$/,
				use: [
					{ loader: 'raw-loader' },
					{
						loader: 'svgo-loader',
						options: {
							externalConfig: "svgo-config.yml"
						}
					}
				]
			}
		]
	},
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'public/scripts')
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
};
