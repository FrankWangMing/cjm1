
import router from './router';

import { defineConfig } from '@umijs/max';

export default defineConfig({
  links: [{ rel: 'icon', href: '/images/ys.ico' }],
  styles: [`html,body { min-width: 1280px }`], //[`html,body { min-width: 1370px }`],
  dva:false,
  layout:{

  },
  metas: [
    {
      name: 'viewport',
      content:
        'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'
    }
  ],
  routes: router,
  // copy: [
  //   {
  //     from: '/public',
  //     to: '/public'
  //   }
  // ],
  antd: {},
  hash: true,
  plugins: [],
  targets: {
    ie: 11
  },
  autoprefixer: {},
  extraPostCSSPlugins: [
    // px2rem({
    //   remUnit: 1,
    //   minPixelValue: 3,w
    //   exclude: /node_modules|\/DingDing/i
    //   // exclude: /node_modules/i
    // })
  ],
  proxy: {
    '/static/': {
      target: 'http://10.0.1.66:9098/',
      changeOrigin: true
    },
    '/api/': {
      target: 'http://10.0.4.128:8541', //沁水测试服务
      // target: 'http://10.0.64.4:8053/', // 测试服务
      // target: 'http://10.0.1.66:8053/', // 预发环境
      // target: 'http://10.0.64.31:8053/', // 业主环境
      changeOrigin: true
    }
  },
  fastRefresh:true,
  // mfsu: {},
  publicPath: '/',
  headScripts: [
    { src: '/h5player/h5player.min.js', defer: true },
    { src: '/ysmap/mapbox-gl.js', defer: true }
  ],
});
