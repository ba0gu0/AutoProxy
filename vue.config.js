const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

// Generate pages object
const pagesObj = {};

const chromeName = ["popup", "options"];

chromeName.forEach(name => {
    pagesObj[name] = {
        entry: `src/${name}/index.js`,
        template: `src/${name}/index.html`,
        filename: `${name}.html`
    };
});

const plugins = [
    {
        from: path.resolve("src/manifest.production.json"),
        to: `${path.resolve("dist")}/manifest.json`
    },
    {
        from: path.resolve("src/icon"),
        to: `${path.resolve("dist")}/icon`
    },
    {
        from: path.resolve("src/background/index.js"),
        to: `${path.resolve("dist")}/js/background.js`
    },
    {
        from: path.resolve("src/background/index.html"),
        to: `${path.resolve("dist")}/background.html`
    }];

module.exports = {
    pages: pagesObj,
    productionSourceMap: false,
    configureWebpack: {
        performance : {
            hints : false
        },
        plugins: [CopyWebpackPlugin(plugins)]
    },
    css: {
        loaderOptions: {
            less: {
                // 若使用 less-loader@5，请移除 lessOptions 这一级，直接配置选项。
                lessOptions: {
                    modifyVars: {
                        // 直接覆盖变量
                        '@grid-item-content-padding': '0',
                        // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
                    },
                },
            },
        },
    },
};
