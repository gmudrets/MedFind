module.exports = {
    style: {
        postOptions : {
            plugins: [
                require('tailwindcss'),
                require('autoprefixer'),
            ],
        },
    },
    // resolve: {
    //     fallback:
    //         {"stream": require.resolve("stream-browserify")}
    // },
}