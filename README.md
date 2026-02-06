# EversoAI

跨平台多 Agent 桌面客户端（Windows / macOS / Linux）。

## 当前阶段

- 产品规划：`docs/plan.md`
- UI 规格：`docs/ui-spec.md`
- 技术规格：`docs/tech-spec.md`

## 目标能力

- 集成 `Claude Code`、`Codex`、`Gemini`、`Custom API`
- 三栏布局（1:3:1）：会话列表 / 对话区 / 工作区预览
- 会话自动保存、历史回看、上下文管理

## 下一步

1. 初始化 Electron + React + TypeScript 脚手架
2. 先实现启动页与三栏静态 UI
3. 接入 ProviderAdapter 与会话持久化

## 开发

```bash
npm install
npm run dev
```

当前已包含：
- Electron (main/preload) + Vite (renderer) 基础集成
- Tailwind CSS v4（使用 `@tailwindcss/vite` 插件）+ 语义化颜色 tokens（`@theme inline`）
- 基础页面：Launch Pad / Chat（三栏 1:3:1 + 可折叠/拖拽）/ Settings

## 常见问题

### Electron failed to install correctly

如果运行 `npm run dev` 报：
`Electron failed to install correctly, please delete node_modules/electron and try installing again`

通常是 Electron 二进制下载失败（网络/代理/镜像问题）。本仓库在 `postinstall` 已做一次自动重试；你也可以手动：

```bash
# PowerShell
$env:ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
npm install
```

