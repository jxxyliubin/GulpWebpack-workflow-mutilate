// 引入gulp
var gulp = require('gulp'); // 基础库

// 引入gulp插件
var htmlInclude = require('gulp-file-include'); //html文件include
var  sass = require('gulp-ruby-sass');  // sass/scss编译
var tmodjs = require('gulp-tmod'); //tmodjs
var babel = require('gulp-babel'); //ES6转ES5
var uglify = require("gulp-uglify"); //js压缩
var imagemin = require("gulp-imagemin"); // 图片压缩
var cache = require("gulp-cache"); // 图片缓存
var del = require("del"); // 文件夹和文件删除
var rev = require("gulp-rev"); // md5版本号
var revCollector = require("gulp-rev-collector"); // 版本替换
var sequence = require("gulp-sequence"); // 任务队列
var browserSync = require('browser-sync').create(); //本地服务器及动态刷新
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var webpack = require('webpack-stream');

//清除文件
gulp.task('clean', function() {
    return gulp.src(['dist/**/*.*', '!dist/**/*.swf'])
        .pipe(clean());
});

//合并复制HTML文件
gulp.task('html', function() {
    return gulp.src(['./app/**/*.html', '!./app/htmlInclude/*.html'])
        .pipe(htmlInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .on('error', function(e) { console.log(e) })
        .pipe(gulp.dest('dist'));
});

//sass
gulp.task('sass', function() {
    var plugins = [
        autoprefixer({ browsers: ['last 5 versions', 'Android >= 4.0'], cascade: false })
    ];
    return sass('app/assets/sass/*.scss')
        .on('error', function(err) {
            console.error('Error!', err.message); // 显示错误信息
        })
        .pipe(postcss(plugins))
        .pipe(gulp.dest('dist/assets/css')) // 输出路径
});
gulp.task('sass-compress', function() {
    var plugins = [
        autoprefixer({ browsers: ['last 5 versions', 'Android >= 4.0'], cascade: false })
    ];
    return sass('app/assets/sass/*.scss', { style: 'compressed' }) // 指明源文件路径、并进行文件匹配（style: nested：嵌套缩进的css代码，它是默认值。expanded：没有缩进的、扩展的css代码。compact：简洁格式的css代码。compressed：压缩后的css代码。）
        .on('error', function(err) {
            console.error('Error!', err.message); // 显示错误信息
        })
        .pipe(postcss(plugins))
        .pipe(rev())
        .on('error', function(e) { console.log(e) })
        .pipe(gulp.dest('dist/assets/css')) // 输出路径
        .pipe(rev.manifest())
        .on('error', function(e) { console.log(e) })
        .pipe(gulp.dest('dist/assets/rev/css'));
});

//tmod
gulp.task('tmod', function() {
    return gulp.src('app/assets/tmod/**/*.tpl')
        .pipe(tmodjs({
            templateBase: 'app/assets/tmod',
            type: "cmd"
        }))
        .on('error', function(e) { console.log(e) })
        .pipe(gulp.dest('app/assets/tmod'))
        .pipe(gulp.dest('dist/assets/tmod'));
});
gulp.task('tmod-compress', function() {
    return gulp.src('app/assets/tmod/**/*.tpl')
        .pipe(tmodjs({
            templateBase: 'app/assets/tmod',
            type: "cmd"
        }))
        .on('error', function(e) { console.log(e) })
        // 压缩会有问题吗？
        .pipe(uglify({
            mangle: {
                except: ["define", "require", "exports", "module", "$", "jQuery"], //排除混淆关键字
                compress: true //是否完全压缩
            }
        }))
        .on('error', function(e) { console.log(e) })
        .pipe(gulp.dest('app/assets/tmod'))
        .pipe(gulp.dest('dist/assets/tmod'));
});

// 编译并压缩js
gulp.task('js', function() {
    return gulp.src("app/assets/js/*.js")
        .pipe(webpack( require('./webpack.config.dev.js') ))
        .pipe(gulp.dest("dist/assets/js"))
})
gulp.task('js-compress', function() {
    return gulp.src("app/assets/js/*.js")
        .pipe(webpack( require('./webpack.config.js') ))
        .on('error', function(e) {console.log("webpack error!!!!!");  console.log(e) })
        // .pipe(uglify({
        //     compress: true,
        //     ie8: true
        // }))
        // .pipe(uglify())
        // .on('error', function(e) {console.log("uglify error!!!!!");  console.log(e) })
        .pipe(gulp.dest("dist/assets/js"))
})


//js库、swf、音频视频等文件都放在libs文件夹里
gulp.task("libs", function() {
    return gulp.src("app/assets/libs/**/*.*")
        .pipe(gulp.dest("dist/assets/libs/"));
});

//图片压缩
gulp.task("image", function() {
    return gulp.src('app/assets/img/**/*.*')
        .pipe(gulp.dest("dist/assets/img"));
});
gulp.task("image-compress", function() {
    return gulp.src('app/assets/img/**/*.*')
        .pipe(
            cache(
                imagemin({
                    optimizationLevel: 3,
                    progressive: true,
                    interlaced: true
                })
            )
        )
        .on('error', function(e) { console.log(e) })
        .pipe(rev())
        .on('error', function(e) { console.log(e) })
        .pipe(gulp.dest("dist/assets/img"))
        .pipe(rev.manifest())
        .on('error', function(e) { console.log(e) })
        .pipe(gulp.dest('dist/assets/rev/img'));
});

//替换为加了MD5后缀的文件
gulp.task('revUrl', function() {
    return gulp.src(['dist/**/*.html', 'dist/**/*.css', 'dist/**/*.js', 'dist/assets/rev/css/**/*.json', 'dist/assets/rev/img/**/*.json']) //- 读取 rev-manifest.json 文件以及需要进行替换的文件
        .pipe(revCollector()) //- 执行文件内的替换
        .on('error', function(e) { console.log(e) })
        .pipe(gulp.dest('dist')); //- 替换后的文件输出的目录
});
//替换完后删除存放对应关系json的rev文件夹
gulp.task('clean-rev', function() {
    return del(['dist/assets/rev']);
});


//删除文件
// Clean  任务执行前，先清除之前生成的文件
gulp.task('clean', function() {
    return del(['dist/**/*'])
});

// 静态服务器
gulp.task('browser-sync', function() {
    browserSync.init({
        // proxy: "你的域名或IP",
        server: {
            baseDir: "./dist"
        }
    });
});


// Watch
gulp.task('watch', function() {
    // Watch .html files
    gulp.watch('app/**/*.html', ['reloadHtml']).on('change', browserSync.reload);
    // Watch .scss files
    gulp.watch('app/**/*.scss', ['reloadCss']).on('change', browserSync.reload);
    // Watch .top files
    gulp.watch('app/**/*.tpl', ['reloadTpl']).on('change', browserSync.reload);
    // Watch .js files
    gulp.watch('app/**/*.js', ['reloadJs']).on('change', browserSync.reload);
    // Watch image files
    gulp.watch('app/assets/img/**/*.*', ['reloadImg']).on('change', browserSync.reload);

});

//重载
gulp.task("reloadHtml", ["html"]);
gulp.task("reloadCss", ["sass"]);
gulp.task("reloadTpl", ["js"]);
gulp.task("reloadJs", ["js"]);
gulp.task("reloadImg", ["image"]);




// 设置默认任务和发布任务
gulp.task('default', sequence(
    // ['clean'],
    ['libs', 'image', 'sass', 'js', 'html'], ['browser-sync'], ['watch']
));
gulp.task('build', sequence(
    ['clean'], ['sass-compress', 'js-compress', 'html'],['libs', 'image-compress'],  ['revUrl'], ['clean-rev']
));