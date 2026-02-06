# AI Workbench

跨平台多 Agent 桌面客户端（Windows / macOS / Linux）。

## 当前阶段

- 产品规划：`plan.md`
- UI 规格：`ui-spec.md`
- 技术规格：`tech-spec.md`

## 目标能力

- 集成 `Claude Code`、`Codex`、`Gemini`、`Custom API`
- 三栏布局（1:3:1）：会话列表 / 对话区 / 工作区预览
- 会话自动保存、历史回看、上下文管理

## 下一步

1. 初始化 Electron + React + TypeScript 脚手架
2. 先实现启动页与三栏静态 UI
3. 接入 ProviderAdapter 与会话持久化
