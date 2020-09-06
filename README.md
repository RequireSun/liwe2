liwe2
===

## how to start

```shell script
npm i
npm run build
```

Then go to the `/build` directory and open `index.html`。

## 项目结构

`src/pages/` 下面是用来放不同页面的，每个目录都是一个单独的页面（多页面不是目前的重点所以还没实现）。
`src/components/` 下面是用来放组件库的（目前只写了一个简单的来做 demo）。

`.lml` 文件为 vue-like 的指令化模板。
`.js` 文件为 mobx-based 的数据仓库文件。
`.lql` 文件为简单交互 sql-like 抽象。（待实现）

## 原理

主要看 `compiler/liwe-loader` 文件，内部实现了 .vue -> .jsx 的转换逻辑。
