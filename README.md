# link-pre-webpack-plugin

## 介绍

该插件提供了更细致化的插入 link-pre 的功能，使用的时候需要将该插件放在其他的 html-template-plugin 也就是 html 模板处理的插件下方，并传入和 html 模板的插件相同的 filename 即可使用

经测试，能够使用在 html-webpack-plugin、web-webpack-plugin html 模板插件后使用

想像一个场景，多入口单页面文件，每个对应一个 template，在输入账号密码的页面可以预先加载登陆后的页面的资源，比如 login 页面增加了 preload:main，在输入完密码之后说不定 main 资源已经加载完成，登陆之后若需要请求 main 的 js 文件，直接通过 304 缓存中获取即可）

## 使用

插件专注处理一个 html 文件，若想对多个文件进行操作请创建多个实例并传入不同的 filename 即可

插件可以适配 optimization.splitChunks 和 mini-css-extract-plugin

### 参数说明

- filename:String html 文件的名称，一定要和传给其他 html 模板处理插件的 filename 相同
- preload:Object
  - js:Object
    - hrefs:Array
      - 数字元素可以是一个 `string`，代表了资源的 `CDN` 地址
        ```js
        hrefs: ['https://cdn.bootcss.com/lodash.js/4.17.12-pre/lodash.min.js', ...]
        ```
      - 也可以传入更细致的参数，比如
        ```js
        hrefs: [
          {
            href: 'https://cdn.bootcss.com/jquery/3.3.1/jquery.js',
            attrs: [{ name: 'media', value: '(max-width: 600px)' }]
          }
        ]
        ```
        如上传入 `attrs`，插件内部会将其合并生成 `link-dom`，如上参数设置可以在 `media < 600px` 的时候再加载
    - chunks:Array
      - 数字元素可以是一个 `string`，代表了某一入口的 `entry name`，或者是 `splitChunks` 的 `name`
        ```js
        chunks: ['common-js', ...]
        ```
      - 也可以和上面一样传入更细致的参数，比如
        ```js
        chunks: [
          {
            chunk: 'main', // 代表了另一个入口的 entry name
            attrs: [{ name: 'media', value: '(max-width: 600px)' }]
          }
        ]
        ```
  - css:Object
    - hrefs:Array
      - 和 js 类似
    - chunks:Array
      - 和 js 类似
- prefetch:Object
  - 和 preload 类似

### 参考配置

```js
new LinkPreWebpackPlugin({
  filename: 'login.html',
  preload: {
    js: {
      hrefs: [
        { href: 'https://cdn.bootcss.com/lodash.js/4.17.12-pre/lodash.min.js' },
        {
          href: 'https://cdn.bootcss.com/jquery/3.3.1/jquery.js',
          attrs: [{ name: 'media', value: '(max-width: 600px)' }]
        }
      ],
      chunks: [
        { chunk: 'common-js' },
        {
          chunk: 'main',
          attrs: [{ name: 'media', value: '(max-width: 600px)' }]
        }
      ]
    },
    css: {
      hrefs: [
        { href: 'https://cdn.bootcss.com/animate.css/3.7.0/animate.min.css' },
        {
          href: 'https://cdn.bootcss.com/hover.css/2.3.1/css/hover-min.css',
          attrs: [{ name: 'media', value: '(max-width: 600px)' }]
        }
      ],
      chunks: [
        {
          chunk: 'common-style',
          attrs: [{ name: 'media', value: '(max-width: 600px)' }]
        }
      ]
    }
  },
  prefetch: {
    js: {
      hrefs: [
        { href: 'https://cdn.bootcss.com/lodash.js/4.17.12-pre/lodash.min.js' },
        { href: 'https://cdn.bootcss.com/jquery/3.3.1/jquery.js' }
      ],
      chunks: [{ chunk: 'common-js' }, { chunk: 'main' }]
    },
    css: {
      hrefs: [
        { href: 'https://cdn.bootcss.com/animate.css/3.7.0/animate.min.css' },
        { href: 'https://cdn.bootcss.com/hover.css/2.3.1/css/hover-min.css' }
      ],
      chunks: [{ chunk: 'common-style' }]
    }
  }
})
```

## TODO

- css 的 publicPath 该怎么处理
- 能不能不使用 indexOf 作为判断依据，因为当公共模块的文件名和其他模块文件名重复的时候，依赖会加载错误
- 热更新 html，在 afterCompile 的时候把 html 添加监视热更新依赖
- 测试开发环境（webpack-dev-server）下是否能使用
- 加入判断参数是否传入正确的机制

<!-- - as:String --- limit preload
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
- crossorigin:boolean
  - true
  - false

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
- done -->
