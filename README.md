# boss-robot-admin

对话机器人商户系统

## 技术栈

React18 + ant-design4

## 目录结构介绍

    |-- src                          // 页面
        |-- *                        // 一级菜单项key
            |-- pages                // 菜单项对应的全部页面
                |-- components       // 当前菜单项组件
            |-- components           // 一级菜单内公用组件
    |-- scripts                      // 脚本
    |-- components                   // 系统公用组件
    |-- hooks                        // 系统公用hooks
    |-- custom                       // 常用配置
        |-- api                      // api集合
        |-- router-list              // 本地路由集合
        |-- server-proxy             // 服务代理
    |-- js                           // js公用类
        |-- config                   // 项目公共配置
            |-- router-config        // 路由对应组件配置文件
        |-- utils                    // 常用工具
    |-- redux                        // redux配置文件
    |-- assets                       // 静态资源
    |-- entry                        // 项目入口文件
    |-- build/qa                     // 测试环境文件
    |-- build/pro                    // 生产环境文件

## 启动

安装：`npm install`
开发：`npm run dev`

## 开发注意事项
- redux
  - 配置文件放置于对应目录redux文件夹内
- 菜单路由基于iuc控制，路由对应组件存于/js/config/router-config.js文件内

## 打包上线

### 打包到测试环境
```
npm run test
```

### 打包到生产环境
```
npm run build
```
