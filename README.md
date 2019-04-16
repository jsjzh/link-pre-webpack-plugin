# link-pre-webpack-plugin

## TODO

- css 的 publicPath 该怎么处理
- 能不能不使用 indexOf 作为判断依据，因为当公共模块的文件名和其他模块文件名重复的时候，依赖会加载错误
- 热更新 html，在 afterCompile 的时候把 html 添加监视热更新依赖

## 功能

由 html template 模板，自动插入 link preload 或者 link prefetch

- target:object
  - template:string 模板 html
  - filename:string 输出文件的名称
- links:[]
  - hrefs:[]
    - 完整地址，一般表示 cdn 地址
  - chunks:[]
    - chunkName（表示入口模块，想像一个场景，多入口单页面文件，每个对应一个 template，在输入账号密码的页面可以预先加载登陆后的页面的资源，比如 login 页面增加了 preload:main，在输入完密码之后说不定 main 资源已经加载完成，登陆之后若需要请求 main 的 js 文件，直接通过 304 缓存中获取即可）
  - rel:[]
    - preload
    - prefetch
  - as:string --- limit preload
    - script: JavaScript 文件。
    - style: 样式表。
    - font: 字体文件。
    - audio: 音频文件。
    - image: 图片文件。
    - video: 视频文件。
    - document: 一个将要被嵌入到<frame>或<iframe>内部的 HTML 文档。
    - worker: 一个 JavaScript 的 web worker 或 shared worker。
    - embed: 一个将要被嵌入到<embed>元素内部的资源。
    - fetch: 那些将要通过 fetch 和 XHR 请求来获取的资源，比如一个 ArrayBuffer 或 JSON 文件。
    - object: 一个将会被嵌入到<embed>元素内的文件。
    - track: WebVTT 文件。
  - attrs:[]（preload 可以增加一些参数，比如 media 等等）
    - media
    - type
    - ...
  - crossorigin:boolean
    - true
    - false
  - inject:string
    - head
    - body

## Compiler hooks

- shouldEmit
- done
- additionalPass
- beforeRun
- run
- emit
- afterEmit
- thisCompilation
- compilation
- normalModuleFactory
- contextModuleFactory
- beforeCompile
- compile
- make
- afterCompile
- watchRun
- failed
- invalid
- watchClose
- environment
- afterEnvironment
- afterPlugins
- afterResolvers
- entryOption

### Compiler hooks 触发顺序

- environment
- afterEnvironment
- entryOption
- afterPlugins
- afterResolvers
- beforeRun
- run
- normalModuleFactory
- contextModuleFactory
- beforeCompile
- compile
- thisCompilation
- compilation
- make
- afterCompile
- shouldEmit
- emit
- afterEmit
- done
