import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ThreePaneLayout } from '@/components/layout/ThreePaneLayout'
import { cn } from '@/lib/utils'

type ProviderId = 'claude' | 'codex' | 'gemini' | 'custom'

const PROVIDERS: Array<{ id: ProviderId; label: string }> = [
  { id: 'claude', label: 'Claude Code' },
  { id: 'codex', label: 'Codex' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'custom', label: 'Custom API' },
]

export function ChatPage() {
  const navigate = useNavigate()
  const [provider, setProvider] = useState<ProviderId>('codex')

  return (
    <ThreePaneLayout
      chrome="none"
      left={
        <div className="h-full overflow-auto px-3 py-3">
          <div className="flex items-center gap-3 pb-2">
            <div className="grid size-9 place-items-center rounded-xl bg-foreground text-background shadow-sm">
              <span className="font-mono text-xs">E</span>
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">EversoAI</div>
            </div>
          </div>

          <button
            type="button"
            className="mt-2 flex w-full items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-2 text-sm font-semibold text-foreground/90 hover:bg-accent"
          >
            <span className="grid size-7 place-items-center rounded-lg bg-background/50 text-sm">+</span>
            新对话
          </button>

          <div className="mt-5 text-[11px] font-semibold tracking-wide text-muted-foreground">更早</div>
          <div className="mt-2 space-y-2">
            <SessionItem title="这是我现在的脚本，我的网..." meta="今天" />
            <SessionItem title="2|farm-bot | [19:50]..." meta="今天" />
          </div>
        </div>
      }
      center={
        <div className="relative h-full">
          <div className="absolute left-1/2 top-4 -translate-x-1/2">
            <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground/90 shadow-sm">
              <span className="grid size-5 place-items-center rounded-full bg-emerald-500/15 text-emerald-700">
                ✓
              </span>
              已进入多智能体模式
            </div>
          </div>

          <div className="flex h-full flex-col items-center justify-center px-6">
            <div className="w-full max-w-3xl">
              <h1 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
                Hi，今天有什么安排？
              </h1>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <IconButton title="智能体">
                  <SparkleIcon />
                </IconButton>
                <AgentSwitcher value={provider} onChange={setProvider} />
                <IconButton title="更多">
                  <DotsIcon />
                </IconButton>
                <IconButton title="置顶">
                  <PinIcon />
                </IconButton>
                <IconButton title="设置" onClick={() => navigate('/settings')}>
                  <GearIcon />
                </IconButton>
              </div>

              <div className="mt-6 rounded-3xl border border-border bg-card px-5 py-4 shadow-sm">
                <textarea
                  className="h-24 w-full resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="发消息、上传文件或打开文件夹..."
                />
                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    className="grid size-9 place-items-center rounded-full border border-border bg-background/40 text-sm text-foreground/80 hover:bg-accent"
                    title="添加"
                    disabled={!window.api}
                    onClick={async () => {
                      if (!window.api) return
                      await window.api.pickWorkspaceFile()
                    }}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="grid size-9 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95"
                    title="发送"
                  >
                    ↑
                  </button>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <Pill>UI/UX 专业设计师</Pill>
                <Pill>协作</Pill>
                <Pill>创建助手</Pill>
              </div>
            </div>
          </div>
        </div>
      }
      right={
        <div className="h-full overflow-auto p-3">
          <div className="rounded-xl border border-border bg-card/50 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold">工作区</div>
                <div className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
                  {window.api ? '选择文件夹或文件以加载' : '需要在 Electron 内运行'}
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-95"
                onClick={async () => {
                  if (!window.api) return
                  await window.api.pickWorkspaceDirectory()
                }}
              >
                选择文件夹
              </button>
              <button
                type="button"
                className="rounded-md border border-border bg-background/40 px-3 py-2 text-xs font-semibold text-foreground/90 hover:bg-accent"
                onClick={async () => {
                  if (!window.api) return
                  await window.api.pickWorkspaceFile()
                }}
              >
                选择文件
              </button>
            </div>

            <div className="mt-3 rounded-xl border border-border bg-background/30 p-2">
              <div className="flex items-center gap-2 px-2 py-1 text-xs">
                <span className="text-muted-foreground">▾</span>
                <span className="truncate font-mono">— 未选择</span>
              </div>
              <div className="mt-1 space-y-1 pl-6">
                <div className="px-2 py-1 text-xs text-muted-foreground">选择工作区后显示文件树（此处为占位示例）</div>
                <TreeItem label="src/" />
                <TreeItem label="docs/" />
                <TreeItem label="README.md" file />
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-border bg-card/50 p-3">
            <div className="text-xs font-semibold">预览</div>
            <div className="mt-2 space-y-2 font-mono text-[11px] text-muted-foreground">
              <div>— 选择文件后展示预览</div>
              <div>— 超大文件仅预览前 N 行</div>
              <div>— 可加入上下文</div>
            </div>
          </div>
        </div>
      }
    />
  )
}

function SessionItem({ title, meta, active }: { title: string; meta: string; active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        'w-full rounded-lg border px-3 py-2 text-left transition',
        active
          ? 'border-ring bg-accent text-foreground'
          : 'border-border bg-background/30 text-foreground/90 hover:bg-accent',
      )}
    >
      <div className="truncate text-sm font-medium">{title}</div>
      <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{meta}</div>
    </button>
  )
}

function TreeItem({ label, file }: { label: string; file?: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-md px-2 py-1 text-xs text-foreground/80 hover:bg-accent">
      <span className="text-muted-foreground">{file ? '•' : '▸'}</span>
      <span className={cn('truncate', file && 'font-mono')}>{label}</span>
    </div>
  )
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="rounded-full border border-border bg-background/40 px-4 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
    >
      {children}
    </button>
  )
}

function IconButton({
  children,
  title,
  onClick,
}: {
  children: React.ReactNode
  title: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      className="grid size-9 place-items-center rounded-full border border-border bg-card text-xs text-foreground/80 shadow-sm hover:bg-accent"
      title={title}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function SparkleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2l1.2 6.1L19.3 9.3l-6.1 1.2L12 16.6l-1.2-6.1L4.7 9.3l6.1-1.2L12 2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M19.4 13.1v-2.2l-2-1.2-.2-.6.8-2.1-1.6-1.6-2.1.8-.6-.2-1.2-2H10.9l-1.2 2-.6.2-2.1-.8-1.6 1.6.8 2.1-.2.6-2 1.2v2.2l2 1.2.2.6-.8 2.1 1.6 1.6 2.1-.8.6.2 1.2 2h2.2l1.2-2 .6-.2 2.1.8 1.6-1.6-.8-2.1.2-.6 2-1.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DotsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 12h.01M12 12h.01M18 12h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 17v5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6 4h12l-2 6v4H8v-4L6 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function AgentSwitcher({
  value,
  onChange,
}: {
  value: ProviderId
  onChange: (next: ProviderId) => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onDocDown(e: MouseEvent) {
      if (!open) return
      const el = rootRef.current
      if (!el) return
      if (e.target instanceof Node && el.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDocDown)
    return () => document.removeEventListener('mousedown', onDocDown)
  }, [open])

  const active = PROVIDERS.find((p) => p.id === value)
  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground/90 shadow-sm hover:bg-accent"
        onClick={() => setOpen((v) => !v)}
        title="切换智能体"
      >
        <span className="inline-block size-2.5 rounded-full bg-primary" aria-hidden="true" />
        <span>{active?.label}</span>
        <span className="text-muted-foreground">▾</span>
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+8px)] z-10 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={cn(
                'flex w-full items-center justify-between px-3 py-2 text-left text-xs hover:bg-accent',
                p.id === value && 'bg-accent',
              )}
              onClick={() => {
                onChange(p.id)
                setOpen(false)
              }}
            >
              <span className="font-semibold text-foreground/90">{p.label}</span>
              <span className="font-mono text-[11px] text-muted-foreground">{p.id}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
