# AutoProxy

- Auto Proxy 是一个自动切换代理的一个浏览器插件, 专为测试人员使用.
- 2.0版本使用vue+vant进行了重构, 界面变化比较大.
- 新增了自定义代理功能, 可以自行添加代理并进行切换, 比如BurpSuite代理、Shadowsocks代理等, 同时支持添加IP白名单, 暂不支持编写PAC脚本功能.
- 去除了代理筛选功能, 去除了计划任务功能. 但是可以获取远程服务器上的代理数据.

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

