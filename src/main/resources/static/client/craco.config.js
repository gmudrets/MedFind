const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

const path = require('path')

module.exports = {

    webpack: {
        plugins: {
            add: [
                new NodePolyfillPlugin()
            ]
        },

    },

}