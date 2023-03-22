这是一个记事本PWA应用，支持离线模式和云端同步模式。

## 特性
* 离线可用
* 云端同步
* 笔记下载
* 可配置自动同步

## 技术栈
* 前端
  * NextJS
  * MUI
* 后端
  * Vercel serverless function (NodeJS)
  * MongoDB

## 安装应用

打开网址[https://notepad-nine.vercel.app/](https://notepad-nine.vercel.app/)，右上角会出现一个安装提示，点击它安装。

![](./screenshots/notepad-install-setp1.png)
安装后会自动打开，可以在`chrome://apps`查看。
![](./screenshots/notepad-install-setp2.png)

![](./screenshots/notepad-pwa.png)


## 截图
Web
![](./screenshots/web-note.png)

移动端
![](./screenshots/mobile-note.png)


## 开发
后端连接mangodb依赖`MONGODB_URL`变量，本地开发需要配置.env文件
```.dotenv
MONGODB_URI=mongodb+srv://[username]:[password]@[cluster-host]/?retryWrites=true&w=majority
```

运行开发环境
```bash
$ npm i
$ npm run dev
```

## 部署到vercel
```
$ vercel vercel -e NODE_ENV=production -e MANGODB_URL=
```
