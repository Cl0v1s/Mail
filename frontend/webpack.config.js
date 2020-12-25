const path = require('path');

module.exports = {
	watch: true,
  entry: [
		'babel-polyfill',
		path.resolve(__dirname, "index.jsx") 
	],
	output: {
			path: path.resolve(__dirname, './../assets/'),
			filename: "bundle.js"
	},
	mode:'development',
	module: {
		rules: [
			{
					test:/\.(js|jsx)$/,
					exclude: [
						path.resolve(__dirname, "./node-modules")
					],
					use: ['babel-loader'],
			},
			{
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
		 ]
	}
};