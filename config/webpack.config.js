const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const PATH_ROOT = path.resolve(__dirname, '../');

module.exports = {
    mode: 'development',
    entry: path.resolve(PATH_ROOT, 'src/index'),
    output: {
        filename: '[name].js',
        path: path.resolve(PATH_ROOT, 'build'),
    },
    resolve: {
        extensions: ['.js', '.jsx', '.lml', '.lql'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.lml$/,
                use: [{
                    loader: 'babel-loader',
                }, {
                    loader: path.resolve(PATH_ROOT, 'compiler/liwe-loader.js'),
                }],
            }
        ],
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(PATH_ROOT, 'public/index.html'),
            filename: 'index.html',
            inject: 'body',
        }),
    ],
};
