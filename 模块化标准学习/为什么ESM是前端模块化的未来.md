#### 1. 无模块化标准阶段

在模块化标准还没有诞生的时候，前端界已经产生了一些模块化的开发手段，如`文件划分`、`命名空间`和 `IIFE 私有作用域`

##### 1.1 文件划分

文件划分方式是最原始的模块化实现，简单来说就是将应用的状态和逻辑分散到不同的文件中，然后通过 `HTML` 中的 `script` 来一一引入

🌰

```javascript
// module-a.js

let data = '这是模块a的data'
```

```javascript
// module-b.js

function mymethod() {
  console.log('这是模块b的函数')
}
```

```html
<!-- index.html-->

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="./module-a.js"></script>
    <script src="./module-b.js"></script>
    <script>
      console.log(data) // 这是模块a的data
      mymethod() // 这是模块b的函数
    </script>
  </body>
</html>
```

`module-a`和`module-b`为两个不同的模块，通过两个 `script` 标签分别引入到 `HTML` 中，这么做看似是分散了不同模块的状态和运行逻辑，但实际上也隐藏着一些风险因素:

- 模块变量相当于在全局声明和定义，会有`变量名冲突`的问题。比如 module-b 可能也存在 data 变量，这就会与 module-a 中的变量冲突。
- 由于`变量都在全局定义`，我们很难知道某个变量到底属于哪些模块，因此也给调试带来了困难。
- 无法清晰地管理`模块之间的依赖关系和加载顺序`。假如 module-a 依赖 module-b，那么上述 HTML 的 script 执行顺序需要手动调整，不然可能会产生运行时错误。

##### 1.2 命名空间

`命名空间`是模块化的另一种实现手段，它可以解决上述文件划分方式中全局变量定义所带来的一系列问题

🌰

```javascript
// module-a.js

window.moduleA = {
  data: 'moduleA',
  method: function () {
    console.log("execute A's method")
  }
}
```

```javascript
// module-b.js

window.moduleB = {
  data: 'moduleB',
  method: function () {
    console.log("execute B's method")
  }
}
```

```html
<!-- index.html-->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="./module-a.js"></script>
    <script src="./module-b.js"></script>
    <script>
      // 此时 window 上已经绑定了 moduleA 和 moduleB
      console.log(moduleA.data)
      moduleB.method()
    </script>
  </body>
</html>
```

每个变量都有自己`专属的命名空间`，我们可以清楚地知道某个变量到底属于哪个模块，同时也避免全局变量命名的问题

##### 1.3 IIFE 立即执行函数

相比于`命名空间`的模块化手段，`IIFE实现的模块化安全性要更高`，对于模块作用域的区分更加彻底

🌰

```javascript
// module-a.js

;(function () {
  let data = 'moduleA'

  function method() {
    console.log(data + 'execute')
  }

  window.moduleA = {
    method: method
  }
})()
```

```javascript
// module-b.js

;(function () {
  let data = 'moduleB'

  function method() {
    console.log(data + 'execute')
  }

  window.moduleB = {
    method: method
  }
})()
```

```html
<!-- index.html -->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="./module-a.js"></script>
    <script src="./module-b.js"></script>
    <script>
      // 此时 window 上已经绑定了 moduleA 和 moduleB
      console.log(moduleA.data)
      moduleB.method()
    </script>
  </body>
</html>
```

每个`IIFE` 即立即执行函数都会创建一个`私有的作用域`，在私有作用域中的变量外界是无法访问的，只有模块内部的方法才能访问

#### 2. 业界主流三大模块规范（`CommonJS`、`AMD` 和 `ES Module`）

##### 2.1 CommonJS 规范

`CommonJS` 是业界最早正式提出的 JavaScript 模块规范，主要用于服务端，随着 Node.js 越来越普及，这个规范也被业界广泛应用。对于模块规范而言，一般会包含 2 方面内容:

- 统一的模块化代码规范
- 实现自动加载模块的加载器(也称 loader)

🌰

```javascript
// module-a.js
var data = 'hello world'
function getData() {
  return data
}
module.exports = {
  getData
}

// index.js
const { getData } = require('./module-a.js')
console.log(getData())
```

代码中使用 `require` 来导入一个模块，用 `module.exports` 来导出一个模块

Node.js 内部会有相应的 loader 转译模块代码，最后模块代码会被处理成下面这样:

```js
;(function (exports, require, module, __filename, __dirname) {
  // 执行模块代码
  // 返回 exports 对象
})
```

对 `CommonJS` 而言，一方面它定义了一套完整的模块化代码规范，另一方面 Node.js 为之实现了自动加载模块的 loader，看上去是一个很不错的模块规范，但也存在一些问题:

- 模块加载器由 Node.js 提供，`依赖了 Node.js 本身的功能实现`，比如文件系统，如果 CommonJS 模块直接放到浏览器中是无法执行的。当然, 业界也产生了 browserify 这种打包工具来支持打包 CommonJS 模块，从而顺利在浏览器中执行，相当于社区实现了一个第三方的 loader。
- CommonJS 本身约定以`同步的方式进行模块加载`，这种加载机制放在服务端是没问题的，一来模块都在本地，不需要进行网络 IO，二来只有服务启动时才会加载模块，而服务通常启动后会一直运行，所以对服务的性能并没有太大的影响。但如果这种`加载机制放到浏览器端，会带来明显的性能问题`。它会产生`大量同步的模块请求`，浏览器要等待响应返回后才能继续解析模块。也就是说，模块请求会`造成浏览器 JS 解析过程的阻塞`，导致页面加载速度缓慢。

总之，CommonJS 是一个不太适合在浏览器中运行的模块规范

##### 2.3 AMD 规范

`AMD`全称为`Asynchronous Module Definition`，即异步模块定义规范。模块根据这个规范，在浏览器环境中会被异步加载，而不会像 CommonJS 规范进行同步加载，也就不会产生同步请求导致的浏览器解析过程阻塞的问题了

🌰

```javascript
// main.js
//  引入模块
define(['./print'], function (printModule) {
  printModule.print('main')
})

// print.js
// 导出模块
define(function () {
  return {
    print: function (msg) {
      console.log('print' + msg)
    }
  }
})
```

在 AMD 规范当中，我们可以通过 define 去定义或加载一个模块，比如上面的 main 模块和 print 模块，如果模块需要导出一些成员需要通过在定义模块的函数中 return 出去(参考 print 模块)，如果当前模块依赖了一些其它的模块则可以通过 define 的第一个参数来声明依赖(参考 main 模块)，这样模块的代码执行之前浏览器会先加载依赖模块

由于`没有得到浏览器的原生支持`，AMD 规范需要由第三方的 loader 来实现，最经典的就是 requireJS 库

##### 2.3 ES6 Module 规范 (ESM)

ES6 Module 也被称作 ES Module(或 ESM)， 是由 ECMAScript 官方提出的模块化规范，作为一个官方提出的规范，ES Module 已经得到了现代浏览器的内置支持。在现代浏览器中，如果在 HTML 中加入含有 `type="module"` 属性的 `script` 标签，那么浏览器会按照 ES Module 规范来进行依赖加载和模块解析，这也是 Vite 在开发阶段实现 no-bundle 的原因，由于模块加载的任务交给了浏览器，即使不打包也可以顺利运行模块代码

不仅如此，一直以 CommonJS 作为模块标准的 Node.js 也紧跟 ES Module 的发展步伐，从 12.20 版本开始正式支持原生 ES Module。也就是说，如今 `ES Module 能够同时在浏览器与 Node.js 环境中执行，拥有天然的跨平台能力`

🌰

```javascript
// main.js
import { methodA } from './module-a.js'
methodA()

//module-a.js
export const methodA = () => {
  console.log('a')
}
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/src/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./main.js"></script>
  </body>
</html>
```

如果在 Node.js 环境中，你可以在 package.json 中声明 type: "module"属性

```json
// package.json
{
  "type": "module"
}
```

然后 Node.js 便会默认以 ES Module 规范去解析模块

```bash
node main.js
a // 打印 a
```

在 Node.js 中，即使是在 CommonJS 模块里面，也可以通过 import 方法顺利加载 ES 模块

```js
async function func() {
  // 加载一个 ES 模块
  // 文件名后缀需要是 mjs
  const { a } = await import('./module-a.mjs')
  console.log(a)
}

func()

module.exports = {
  func
}
```
