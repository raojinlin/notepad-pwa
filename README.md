Notepad 是一个基于 Web 的轻量级笔记应用程序，支持本地离线存储、云端同步以及自动同步等功能。它采用现代化的技术栈：Next.js、React、Material-UI、Vercel Serverless Functions 和 MongoDB。


## 特性
* 轻量便捷: Notepad 是一个轻量级 Web 应用程序，无需安装即可在线使用。
* 离线可用: 用户可以在无网络的情况下访问 Notepad，并创建、编辑和查看笔记。
* 云端同步：用户可以将笔记保存在云端，并在多个设备之间同步。
* 笔记下载：用户可以下载已保存的笔记到本地，以便在没有网络连接时使用。
* 可配置自动同步: 用户可以选择是否开启笔记的自动同步功能。


## 技术栈
采用了现代化的技术栈，具体包括：

* 前端: Next.js、React、Material-UI。
* 后端: Vercel Serverless Functions、MongoDB。

## 安装

1. 访问网址 [https://notepad-nine.vercel.app/](https://notepad-nine.vercel.app/)
![](./screenshots/notepad-install-setp1.png)
2. 在右上角会出现一个安装提示，点击它安装应用。
![](./screenshots/notepad-install-setp2.png)
3. 安装完成后，应用会自动打开。你可以在 Chrome 浏览器的“应用”页面中查看已安装的应用。
![](./screenshots/notepad-pwa.png)


## 截图
Web
![](./screenshots/web-note.png)

移动端
![](./screenshots/mobile-note.png)


暗色
![](./screenshots/dark-mode.gif)

## 开发
1. 在本地环境中运行后端应用程序所需的 MongoDB 数据库实例。
2. 在本地克隆应用程序的代码仓库。
3. 在代码仓库的根目录下运行 npm install 命令安装所有依赖。
4. 创建一个 .env 文件，并设置以下环境变量：
```.dotenv
MONGODB_URI=mongodb+srv://[username]:[password]@[cluster-host]/?retryWrites=true&w=majority
```
请确保将 MONGODB_URI 替换为你的 MongoDB 数据库的实际 URI。

5. 运行 npm run dev 命令启动开发服务器。
6. 访问 [http://localhost:3000](http://localhost:3000) 查看应用程序。


### 后端接口
Notepad 应用程序的后端接口路径为 /api/notepad，您可以自行进行定制化开发。下面是 Notepad 应用程序支持的所有后端接口列表：

以下是后端接口文档：

#### 获取所有笔记
```
GET /api/notepad
```
返回数据：
```json
[
  {
    "id": "616af0b632a3756de48d19b9",
    "title": "Note Title",
    "content": "Note Content",
    "createdAt": "2021-10-16T13:34:46.672Z",
    "updatedAt": "2021-10-16T13:34:46.672Z"
  },
  // ...
]
```

#### 更新或者创建笔记
```
POST /api/notepad
```
请求数据：
```
{
  "title": "Note Title",
  "content": "Note Content"
}
```

#### 删除指定 ID 的笔记
```
DELETE /api/notepad?id=ID
```


## 部署
1. 在 Vercel 中创建一个新的应用程序。
2. 将应用程序的代码仓库链接到 Vercel 应用程序。
3. 设置以下环境变量：
```
NODE_ENV=production
MONGODB_URI=<你的 MongoDB 数据库 URI>
```
请将 MONGODB_URI 替换为你的 MongoDB 数据库的实际 URI。

4. 部署应用程序。