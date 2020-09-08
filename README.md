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

### 优点

+ 因为本框架是基于编译时的编译工具，所以可以直接复用现有开发工具
    如：版本管理、灰度、发布系统、微前端框架

+ 如果 GUI 无法满足正常工作需求，low-code 场景下 DSL 上手门槛低
    + view 层使用基于 vue 的指令模板语法，避免了 JSX 场景下 js-xml 混用的情况，降低模板层复杂度，从而降低了框架搭建难度
    + 逻辑层使用类 SQL 的命令语法，产品、后端同学可以触类旁通

+ 代码可完全转译为 JSX，框架本身并不提供任何数据操作功能
    有效避免了因为框架作者能力不足导致的代码逻辑错误

## PS

本代码仅为可行性测试用，未考虑代码可维护性、可扩展性、文档等其他内容。

## TODOs

- [x] 找个模板, 不要再用模板字符串了
- [ ] vue 模板解析重构
    - [x] 理解 vue AST 结构，修正逻辑
    - [x] 将 if-else 字符串拼接改为 AST 解析
    - [ ] if-else 指令支持
- [ ] lql 对应关系梳理
- [ ] lql 解析改为编译时
- [ ] lql `delete` 支持 (需改动 flora)
- [ ] lql 改用 yaml 或其他格式保存
- [ ] loader 入口 & 引入方式调整
- [x] 双向绑定实现修正
- [ ] 多字段双向绑定实现
- [ ] 插件扩展
    - [ ] 独立配置文件
- [ ] loader 抽成独立项目 (未定: decorator 等 babel 特性放在哪个步骤上编)
- [ ] 全局 / 支持函数从嵌入式改为引入的类库
- [ ] 支持可配置数据存储库
