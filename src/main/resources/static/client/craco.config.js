const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

const path = require('path')

module.exports = {
    entry: "./app",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: 'node_modules',
                loader: 'babel',
                query: {presets: ['es2015']},
            }
        ]
    },
    target: 'node',
    webpack: {
        plugins: {
            add: [
                new NodePolyfillPlugin()
            ]
        },
        node:{}
        // resolve: {
        //     fallback: {
        //         "crypto": false,
        //         "stream": false
        //
        //     }
        // }

    },


}