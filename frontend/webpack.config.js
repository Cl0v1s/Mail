const path = require('path');
const fs = require('fs');

function createConfig() {
	const config = {
		"name": process.env.ACCOUNT,
		"key": process.env.RSA,
		"imap": {
			"host": process.env.SERVER,
			"username": process.env.ACCOUNT,
			"password": process.env.PASSWORD,
		},
		"smtp": {
			"host": process.env.SERVER,
			"username": process.env.ACCOUNT,
			"password": process.env.PASSWORD,
		}
	};

	fs.writeFileSync('./model/config.json', JSON.stringify(config));
}

createConfig();

module.exports = {
	entry: [
		'babel-polyfill',
		path.resolve(__dirname, "index.js")
	],
	output: {
		path: path.resolve(__dirname, './../assets/'),
		filename: "bundle.js"
	},
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: [
					path.resolve(__dirname, "./node-modules")
				],
				use: ['babel-loader'],
			},
			{
				test: /\.s?css$/,
				use: ["style-loader", "css-loader?url=false", "sass-loader"]
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'fonts/'
						}
					}
				]
			}
		]
	}
};