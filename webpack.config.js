const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/dial.js',
    output: {
        filename: 'dial.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.glsl$/,
                use: [
                    {loader: 'webpack-glsl-loader'},
                ]
            }
        ]
    }
};
