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
