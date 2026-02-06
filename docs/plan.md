# Multi-Agent 桌面客户端计划（Plan）

## 1. 产品目标

构建一个跨平台（Windows / macOS / Linux）的桌面 AI 工作台，统一接入：

- Claude Code
- Codex
- Gemini CLI
- Custom API（OpenAI-Compatible）

核心价值：

1. 一个入口切换多个 Agent/模型
2. 工作区上下文（文件/文件夹）驱动的对话体验
3. 美观且高效率的三栏 GUI（1:3:1）
4. 会话可保存、可检索、可回看上文

---

## 2. 已确认的核心需求

### 2.1 启动页（Launch Pad）

- 顶部 Tab：`Claude Code` / `Codex` / `Gemini` / `Custom API`
- 支持选择文件或文件夹作为工作区上下文
- 点击 `进入对话` 跳转至主对话页

### 2.2 主对话页（三栏）

- 左栏（1）：会话列表，带展开/折叠按钮
- 中栏（3）：对话主区
- 右栏（1）：工作区文件预览，带展开/隐藏二合一按钮

### 2.3 设置

- CLI 字体设置：字体、字号、行高
- CLI 颜色设置：主题色/自定义色
- Custom API 设置：`Base URL`、`API Key`、`Model`

---

## 3. 本轮完善（新增）

### 3.1 会话保存（Conversation Persistence）

- 自动保存：发送消息、收到流式增量、结束回复时自动落盘
- 手动保存：支持 `Ctrl/Cmd + S` 快捷保存当前会话快照
- 恢复机制：应用重启后恢复上次打开会话与滚动位置
- 会话管理：重命名、删除、归档、置顶、复制会话
- 导出能力：支持导出 `Markdown/JSON`

### 3.2 上文回看（History & Context Recall）

- 消息时间线支持无限滚动查看历史
- 顶部“加载更早消息”分页加载
- 一键跳转到“上一轮提问/上一轮工具调用”
- 支持“固定消息为上下文”（Pinned Context）
- 会话内全文检索（关键词高亮）

### 3.3 上下文控制（防止上下文过载）

- 可视化展示上下文占用（token 预算条）
- 支持选择“最近 N 轮 + 固定消息 + 文件上下文”
- 超预算时提示并提供自动裁剪策略

---

## 4. 信息架构

1. 启动页
2. 对话页（三栏工作台）
3. 设置页

对话页结构：

- 左：会话列表（搜索、分组、归档）
- 中：消息流（流式输出、工具调用块、重试/继续）
- 右：工作区文件树 + 文件预览 + 添加到上下文

---

## 5. 技术方案（建议）

- 桌面：`Electron + electron-vite`
- 前端：`React + TypeScript + Tailwind v4`
- 状态：`Zustand + React Query`
- 终端：`node-pty + xterm.js`
- 本地数据：`SQLite（推荐）` 或 `IndexedDB`
- 密钥：`keytar`（系统安全存储）

---

## 6. 数据模型（MVP）

- `Workspace`: id, name, rootPath
- `Session`: id, workspaceId, provider, title, pinned, archived, createdAt, updatedAt
- `Message`: id, sessionId, role, content, toolCalls, tokenUsage, createdAt
- `ContextPin`: id, sessionId, messageId, note
- `ProviderConfig`: provider, baseUrl, encryptedKey, model, options
- `UiState`: panelSizes, leftCollapsed, rightCollapsed, activeSessionId

---

## 7. 里程碑（4 周）

### Week 1

- 启动页 + 主页面三栏静态布局（1:3:1）
- 左右栏折叠/恢复 + 宽度拖拽

### Week 2

- 四 Provider 适配层打通
- 中栏流式消息与停止生成

### Week 3

- 会话自动保存/恢复
- 会话搜索、历史分页回看、固定上下文
- 右栏文件预览与上下文注入

### Week 4

- 设置页完善（CLI 外观 + Custom API 全参数）
- 导出、稳定性、跨平台打包验收

---

## 8. 验收标准（DoD）

1. 用户可在 10 秒内完成：选 Provider → 选路径 → 进入对话
2. 三栏布局默认 1:3:1，折叠/恢复稳定无闪烁
3. 会话内容可自动保存，重启后可恢复
4. 用户可查看上文并检索历史消息
5. 三平台构建可运行并完成至少 1 轮完整对话

---

## 9. 下一步

1. 基于 `ui-spec.md` 出低保真线框
2. 基于 `tech-spec.md` 实现数据层与 Provider Adapter
3. 先打通会话保存链路，再接入完整上下文策略

