liwe2
===

## how to start

```shell script
npm i
npm run build
```

Then go to the `/build` directory and open `index.html`。

## 项目结构

+ `src/pages/` 下面是用来放不同页面的，每个目录都是一个单独的页面（多页面不是目前的重点所以还没实现）。
+ `src/components/` 下面是用来放组件库的（目前只写了一个简单的来做 demo）。

### 文件类型

+ `.lml` 文件为 vue-like 的指令化模板。
+ `.js` 文件为 mobx-based 的数据仓库文件。
+ `.lql` 文件为简单交互 sql-like 抽象。

## 原理

+ lml

    主要看 `compiler/liwe-loader` 文件，内部实现了 .vue -> .jsx 的转换逻辑，转换成对等的 jsx 后再使用 babel 进行编译，各种特性的实现均交由 react 完成。

+ lql

    主要看 `compiler/lql-loader` 文件，为了快速搞出来，暂时没有搞成编译时，而采取了 schema 递归调用的方式，真正实战时可以根据当前的 AST 树直接生成函数嵌套调用格式的 js 文件。

## PS

本代码仅为可行性测试用，未考虑代码可维护性、可扩展性、文档等其他内容。
