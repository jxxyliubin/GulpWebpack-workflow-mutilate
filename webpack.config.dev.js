
// 获取所有页面 生成多页面的集合
let fs = require("fs");
const getFileNameList = path => {
    let fileList = [];
    let dirList = fs.readdirSync(path);
    dirList.forEach(item => {
        if (item.indexOf('.js') > -1) {
            fileList.push(item.split('.')[0]);
        }
    });
    return fileList; //返回当前html文件夹下的所有文件名组成的数组
};

const path = require("path");
// 清理 dist 文件夹
const CleanWebpackPlugin = require("clean-webpack-plugin");
// 入口文件集合
let Entries = {}

// 生成多页面的集合
getFileNameList('./app/assets/js').forEach((page) => {
    Entries[page] = path.resolve(__dirname, `./app/assets/js/${page}.js`);
})

module.exports = {
    entry: Entries,
    devtool: "cheap-module-source-map",
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "app/assets/js_bundle"),
    },
    // 加载器
    module: {
        rules: [{
                test: /\.js$/,
                // 强制先进行 ESLint 检查
                enforce: "pre",
                // 不对 node_modules 和 lib 文件夹中的代码进行检查
                exclude: /node_modules|libs|js_bundle/,
                loader: "eslint-loader",
                options: {
                    // 启用自动修复
                    fix: true,
                    // 启用警告信息
                    emitWarning: true,
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules|libs|require/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    },
    // plugins: [
    //     // 代码压缩
    //     new webpack.optimize.UglifyJsPlugin({
    //         // 开启 sourceMap
    //         sourceMap: true
    //     })
    // ]
}