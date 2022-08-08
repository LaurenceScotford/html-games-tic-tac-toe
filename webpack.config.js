const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/js/tictactoe.js',
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            title: 'Tic Tac Toe',
            template: './src/index.html',
            filename: './index.html',
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        clean: true,
    },
};