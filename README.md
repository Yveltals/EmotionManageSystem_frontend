# EmotionManageSystem_frontend

## 前端部署

### 克隆仓库代码
```bash
git clone https://codehub.devcloud.cn-east-3.huaweicloud.com/qxjkglxt00016/EmotionManageSystem_frontend.git
```

### 进入项目目录
```bash
cd ./EmotionManageSystem_frontend
```

### 安装依赖
```bash
npm install
```
### 配置config.js文件
设定系统界面的浏览器访问端口1024，
设定后端请求ip端口为`https://b2884t1064.oicp.vip`
```javascript
module.exports={
  devServer:{
    host:'localhost',
    port:1024,
    proxy: {
      '/api': {
          target: 'https://b2884t1064.oicp.vip',
          changeOrigin: true,
          ws: true,
          secure: false,
          pathRewrite: {
              // '^/api': '',
          },
      },
    },
  },
}
```

### 启动服务
```bash
npm run serve
```

### 访问前端界面
在浏览器地址栏输入 http://localhost:1024