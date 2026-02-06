# Multi-Agent 桌面客户端技术规格（Tech Spec）

## 1. 技术栈

- Electron + React + TypeScript
- 构建：electron-vite
- 样式：Tailwind CSS v4
- 状态：Zustand + React Query
- 终端：node-pty + xterm.js
- 存储：SQLite（推荐）
- 安全：keytar（密钥）、zod（输入校验）

---

## 2. 目录建议

```txt
src/
  main/
    ipc/
    services/
      providers/
      session/
      workspace/
      security/
  renderer/
    pages/
      launch/
      chat/
      settings/
    components/
    stores/
    hooks/
  shared/
    types/
    contracts/
    schemas/
```

---

## 3. Provider 适配层

## 3.1 统一接口

```ts
interface ProviderAdapter {
  validateConfig(config: ProviderConfig): Promise<void>;
  listModels(config: ProviderConfig): Promise<string[]>;
  sendMessage(input: SendMessageInput): Promise<SendMessageResult>;
  streamMessage(input: StreamMessageInput, onEvent: (event: StreamEvent) => void): Promise<void>;
  cancel(requestId: string): Promise<void>;
}
```

## 3.2 Provider 实现

- `ClaudeCodeAdapter`
- `CodexAdapter`
- `GeminiCliAdapter`
- `OpenAICompatibleAdapter`

## 3.3 统一流式事件

- `message:start`
- `message:delta`
- `tool:call`
- `tool:result`
- `message:done`
- `message:error`

---

## 4. IPC 协议（核心）

## 4.1 会话相关

- `session:create`
- `session:list`
- `session:get`
- `session:update`
- `session:delete`
- `session:archive`
- `session:search`

## 4.2 消息相关

- `message:send`
- `message:stream:start`
- `message:stream:cancel`
- `message:list`（分页）
- `message:pin`
- `message:unpin`

## 4.3 设置相关

- `settings:get`
- `settings:update`
- `provider:validate`
- `provider:list-models`

---

## 5. 数据库模型（SQLite）

## 5.1 tables

### `workspaces`

- id (pk)
- name
- root_path
- created_at
- updated_at

### `sessions`

- id (pk)
- workspace_id (fk)
- provider
- title
- pinned (0/1)
- archived (0/1)
- created_at
- updated_at

### `messages`

- id (pk)
- session_id (fk)
- role (`user`/`assistant`/`system`/`tool`)
- content (text)
- tool_calls (json)
- token_usage (json)
- created_at

### `context_pins`

- id (pk)
- session_id (fk)
- message_id (fk)
- note
- created_at

### `app_settings`

- key (pk)
- value (json)
- updated_at

---

## 6. 会话保存策略（重点）

## 6.1 写入时机

1. 用户发送消息：立即插入 `messages`
2. 助手流式回复：内存聚合 + 节流落盘（建议 500ms）
3. 助手完成：覆盖最终 content，并更新 tokenUsage

## 6.2 一致性策略

- 每轮消息带 `requestId`
- 同一 `requestId` 的流式写入使用 upsert
- 崩溃恢复时按 `requestId` 合并残留片段

## 6.3 恢复策略

- 启动时读取 `last_active_session_id`
- 恢复当前会话与滚动锚点
- 若存在损坏消息，回滚到最近一次完整 `message:done`

---

## 7. 上文回看与上下文构建

## 7.1 历史加载

- 中栏消息按分页加载：`pageSize=50`
- 向上滚动触发“加载更早消息”
- 保持滚动锚点，避免加载后跳动

## 7.2 会话检索

- 会话标题检索
- 消息正文全文检索（SQLite FTS5 可选）
- 命中片段高亮返回

## 7.3 上下文打包规则

Prompt 构建顺序建议：

1. 系统提示词
2. 固定消息（pins）
3. 最近 N 轮消息
4. 附加文件片段

超预算策略：

- 先裁剪“最旧未固定消息”
- 再裁剪大文件片段
- 保留固定消息优先级最高

---

## 8. 设置项结构

```ts
type AppSettings = {
  ui: {
    panelSizes: [number, number, number];
    leftCollapsed: boolean;
    rightCollapsed: boolean;
    theme: 'dark' | 'light' | 'system';
  };
  terminal: {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    cursorStyle: 'block' | 'bar' | 'underline';
    colorPreset: 'dark' | 'light' | 'custom';
    customColors?: Record<string, string>;
  };
  customApi: {
    baseUrl: string;
    model: string;
    temperature?: number;
    topP?: number;
    maxTokens?: number;
    headers?: Record<string, string>;
  };
  persistence: {
    autoSave: boolean;
    autoSaveIntervalMs: number;
    restoreLastSession: boolean;
    retentionDays?: number;
  };
};
```

---

## 9. 安全与日志

- API Key 仅保存在 keytar，不写入普通配置文件
- 日志默认脱敏：key/token/cookie/header
- Provider 调用错误分级：网络、鉴权、配额、解析错误
- CLI 子进程生命周期托管：超时、取消、退出码追踪

---

## 10. 性能指标（MVP）

- 首屏可交互时间（TTI）< 2.5s
- 会话列表 1,000 条以内滚动流畅
- 单会话 5,000 消息可分页稳定加载
- 流式渲染首字延迟 < 1s（本地 CLI 场景）

---

## 11. 实施优先级

P0：

1. 启动页 + 三栏布局
2. 四 Provider 基础对话链路
3. 会话自动保存 + 恢复

P1：

1. 上文回看分页 + 搜索
2. 固定上下文 + token 预算条
3. 导出会话

P2：

1. 会话版本快照
2. 多工作区联动
3. 同步与备份

