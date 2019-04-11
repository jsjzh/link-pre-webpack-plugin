# link-pre-webpack-plugin

## 功能

由 html template 模板，自动插入 link preload 或者 link prefetch

- type
  - preload
  - prefetch
- as --- limit preload
  - script
  - style
  - ...
- attrs(preload 可以增加一些参数，比如 media 等等)
  - media
  - type
  - ...
- href
  - 完整地址，一般表示 cdn 地址
  - chunkName（表示入口模块，想像一个场景，多入口单页面文件，每个对应一个 template，在输入账号密码的页面可以预先加载登陆后的页面的资源，比如 login 页面增加了 preload:main，在输入完密码之后说不定 main 资源已经加载完成，登陆之后若需要请求 main 的 js 文件，直接通过 304 缓存中获取即可）
- inject
  - head
  - body
