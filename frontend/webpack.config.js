const path = require('path');

module.exports = {
  entry: [
		'babel-polyfill',
		path.resolve(__dirname, "index.js") 
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