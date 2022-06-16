module.exports = {
    style: {
        postOptions: {
            plugins: [
                require('tailwindcss'),
                require('autoprefixer'),
            ],
        },
    },
    // webpack: {
    //     configure: (webpackConfig, { env, paths }) => {
    //         // eslint-disable-next-line no-param-reassign
    //         webpackConfig.resolve.fallback = {
    //             stream: require.resolve("stream-browserify")
    //         };
    //         return webpackConfig;
    //     },
    // },
    // webpack: {
    //     resolve: {
    //         fallback:
    //             {"stream": require.resolve("stream-browserify")}
    //     },
    // }
}