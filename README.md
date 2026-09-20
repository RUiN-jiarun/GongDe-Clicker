# 功德点击器（GongDe-Clicker）

一个基于 React 的木鱼点击游戏：点击木鱼积累功德，购买生产单位提升每秒功德，触发随机事件并解锁成就。

- 点击时显示浮动功德数字与粒子效果
- 成就从左下角悬浮按钮打开独立窗口查看
- 存档带版本号，会自动迁移旧进度

游戏进度会自动保存在浏览器 `localStorage` 中。点击页面底部的“重置游戏”会清除存档并重新开始。

## 开发

```sh
npm install
npm start
```

## 构建与部署

```sh
npm run build
npm run deploy
```

## 测试

```sh
npm test -- --watchAll=false
```
