# vite-study

#### 1. 构建一个 vite 项目

##### 1.1 `环境前提`: node 和 pnpm 安装

##### 1.2 项目初始化

```bash
pnpm create vite
```

之后根据提示依次往下执行

```shell
  vite-study git:(0920_vite_program) pnpm create vite
Library/pnpm/store/v3/tmp/dlx-37384      |   +1 +
Packages are hard linked from the content-addressable store to the virtual store.
  Content-addressable store is at: /Users/wangguoxuan/Library/pnpm/store/v3
  Virtual store is at:             Library/pnpm/store/v3/tmp/dlx-37384/node_modules/.pnpm
Library/pnpm/store/v3/tmp/dlx-37384      | Progress: resolved 1, reused 0, downloaded 1, added 1, done
✔ Project name: … vite-study
✔ Select a framework: › React
✔ Select a variant: › TypeScript

```

```bash
// 进入项目目录
cd vite-study

// 安装依赖
pnpm install

// 启动项目
pnpm dev
```

至此，我们成功搭建起了一个 React 前端项目

#### 2. 初识配置文件

在使用 Vite 的过程，我们需要对 Vite 做一些配置，以满足日常开发的需要。你可以通过两种方式来对 Vite 进行配置，一是通过命令行参数，如 vite --port=8888，二是通过配置文件，一般情况下，大多数的配置都通过`配置文件`的方式来声明

Vite 当中支持多种配置文件类型，包括.js、.ts、.mjs 三种后缀的文件，实际项目中一般使用 `vite.config.ts` 作为配置文件

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()]
})
```

配置文件中默认在 plugins 数组中配置了官方的 react 插件，来提供 React 项目编译和热更新的功能

###### 可以通过 root 参数配置项目根目录的位置

当手动指定 root 参数之后，Vite 会自动从这个路径下寻找 index.html 文件，也就是说当我直接访问 localhost:5173 的时候，Vite 从 src 目录下读取入口文件

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // 可以通过 root 参数配置项目根目录的位置
  root: path.join(__dirname, 'src'),
  plugins: [react()]
})
```
