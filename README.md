https://github.com/jxxyliubin/GulpWebpack-workflow-mutilate.git

# Gulp 工作流使用说明

索引
---
- [安装 node.js和cnmp]()
- [window 安装msysGit]()
- [安装ruby和sass]()
- [终端命令行下全局安装gulp]()
- [使用]()
- [项目文件夹结构]()

## 一、安装 node.js和cnmp(已安装请忽略)

cnmp是淘宝的npm镜像，可在国内代替npm,以加快模块安装速度。

`$ npm install -g cnpm --registry=https://registry.npm.taobao.org`

## 二、安装git(已安装请忽略)

windows下安装 [msysGit](https://git-for-windows.github.io/) 。
MAC不用安装相关软件。

## 三、安装ruby和sass(已安装请忽略)

1.先去官网下载并安装[Ruby](http://rubyinstaller.org/downloads)（在安装的时候，请勾选Add Ruby executables to your PATH这个选项，添加环境变量，不然以后使用编译软件的时候会提示找不到ruby环境）。

2.安装完ruby之后，在开始菜单中，找到刚才我们安装的ruby，打开Start Command Prompt with Ruby

3.然后直接在命令行中输入
`gem install sass`
按回车键确认，等待一段时间就会提示你sass安装成功。
注：由于近期墙的比较严重，外加（上海）电信限制了外网访问速度。如果安装失败，请使用淘宝的Ruby镜像。具体操作方法请参考[淘宝RubyGems镜像安装 sass](http://www.w3cplus.com/sassguide/install.html)。

## 四、使用

### 1.新建项目：

a) windows系统在项目文件夹中右键鼠标，选择 Git Bash Here。MAC启动终端，输入sudo -s 获得root权限

b) git clone https://github.com/jxxyliubin/GulpWebpack-workflow-mutilate.git。

c) 输入 `cnpm install` 来安装依赖模块。



### 2.使用工作流

### 首先需要先编译js
js文件支持ES6，并全部交由webpack来打包。
输入: npm run webpack_js

#### 开发模式：

终端环境下输入 `gulp`。

此模式下会启动本地服务器，用浏览器打项目文件夹下的dist(项目输出文件)下的index.html页面。修改sass\js\img等，会自动编译完后刷新页面。

此模式下不会进行css\js\图片压缩、css文件名\图片文件名 md5 重命令等工作。

#### 发布模式：
git 环境下输入 `gulp publish`。

此模式为最终发布用。

此环境下会进行代码和图片的压缩，并自动重命命HTML\CSS\IMG文件名及其引用。不会启动本地服务。

#七、项目文件夹结构
略

