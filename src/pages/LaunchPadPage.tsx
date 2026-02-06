import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/theme-provider'

type ProviderId = 'claude' | 'codex' | 'gemini' | 'custom'

const PROVIDERS: Array<{ id: ProviderId; label: string; hint: string }> = [
  { id: 'claude', label: 'Claude Code', hint: 'CLI' },
  { id: 'codex', label: 'Codex', hint: 'CLI' },
  { id: 'gemini', label: 'Gemini', hint: 'CLI' },
  { id: 'custom', label: 'Custom API', hint: 'OpenAI-compatible' },
]

export function LaunchPadPage() {
  const navigate = useNavigate()
  const [provider, setProvider] = useState<ProviderId>('codex')
  const [workspacePath, setWorkspacePath] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()

  const providerMeta = useMemo(() => PROVIDERS.find((p) => p.id === provider), [provider])

  async function pickFolder() {
    if (!window.api) {
      alert('This action requires running inside Electron.')
      return
    }
    const path = await window.api.pickWorkspaceDirectory()
    if (path) setWorkspacePath(path)
  }

  async function pickFile() {
    if (!window.api) {
      alert('This action requires running inside Electron.')
      return
    }
    const path = await window.api.pickWorkspaceFile()
    if (path) setWorkspacePath(path)
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <TopNav
          right={
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md border border-border bg-card px-3 py-2 font-mono text-xs text-foreground/90 hover:bg-accent"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                title="Toggle theme"
              >
                主题：{theme === 'dark' ? '深色' : theme === 'light' ? '浅色' : '系统'}
              </button>
              <button
                type="button"
                className="rounded-md border border-border bg-card px-3 py-2 font-mono text-xs text-foreground/90 hover:bg-accent"
                onClick={() => navigate('/settings')}
              >
                设置
              </button>
            </div>
          }
        />

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <section className="lg:col-span-7">
            <div className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">EVERSOAI</div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              让 CLI AI 变成你的同事
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
              将 Gemini CLI、Claude Code、Codex 与自定义 OpenAI-Compatible API 统一到一个桌面工作台。
              快速切换、会话保存、本地优先。
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/chat')}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-95"
              >
                进入对话
              </button>
              <button
                type="button"
                onClick={() => navigate('/settings')}
                className="rounded-lg border border-border bg-background/40 px-4 py-2 text-sm font-semibold text-foreground/90 hover:bg-accent"
              >
                快速设置
              </button>
            </div>

              <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge>本地优先</Badge>
                <Badge>Windows / macOS / Linux</Badge>
                <Badge>SQLite 会话</Badge>
                <Badge>工作区预览</Badge>
              </div>

            <div className="mt-10">
              <div className="text-sm font-semibold">Essential capabilities</div>
              <p className="mt-2 text-xs text-muted-foreground">
                作为“多智能体桌面工作台”的关键能力。
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FeatureCard title="统一入口" desc="一个入口切换多个 Provider/模型。" />
                <FeatureCard title="本地优先" desc="工作区与会话数据默认落盘在本机。" />
                <FeatureCard title="会话管理" desc="保存、检索、回看上文与固定上下文。" />
                <FeatureCard title="可视化工作流" desc="文件预览与上下文注入可控可追踪。" />
              </div>
            </div>
          </section>

          <section className="lg:col-span-5">
            <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur">
              <div className="flex items-baseline justify-between gap-4">
                <div className="text-sm font-semibold">快速开始</div>
                <div className="font-mono text-[11px] text-muted-foreground">3 步</div>
              </div>

              <div className="mt-4 space-y-3">
                <StepCard
                  n={1}
                  title="选择 Provider"
                  body={
                    <div className="mt-3 flex flex-wrap gap-2">
                      {PROVIDERS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setProvider(p.id)}
                          className={cn(
                            'rounded-md border px-3 py-2 text-sm font-medium transition',
                            provider === p.id
                              ? 'border-ring bg-accent text-foreground'
                              : 'border-border bg-background/40 text-muted-foreground hover:bg-accent hover:text-foreground',
                          )}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  }
                  footer={
                    <div className="mt-3 font-mono text-[11px] text-muted-foreground">
                      当前：{providerMeta?.label}（{providerMeta?.hint}）
                    </div>
                  }
                />

                <StepCard
                  n={2}
                  title="选择工作区（可选）"
                  body={
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={pickFolder}
                        className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-95"
                      >
                        选择文件夹
                      </button>
                      <button
                        type="button"
                        onClick={pickFile}
                        className="rounded-md border border-border bg-background/40 px-3 py-2 text-sm font-semibold text-foreground/90 hover:bg-accent"
                      >
                        选择文件
                      </button>
                      <button
                        type="button"
                        onClick={() => setWorkspacePath(null)}
                        className="rounded-md border border-border bg-transparent px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        清除
                      </button>
                    </div>
                  }
                  footer={
                    <div className="mt-3 rounded-lg border border-border bg-background/30 px-3 py-2 font-mono text-[11px] text-muted-foreground">
                      {workspacePath ?? '— 空工作区'}
                    </div>
                  }
                />

                <StepCard
                  n={3}
                  title="进入对话"
                  body={
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="text-xs text-muted-foreground">Provider → 工作区 → 对话</div>
                      <button
                        type="button"
                        onClick={() => navigate('/chat')}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-95"
                      >
                        进入对话
                      </button>
                    </div>
                  }
                />
              </div>

              <div className="mt-5 rounded-xl border border-border bg-background/30 px-4 py-3 text-xs text-muted-foreground">
                近期工作区（pin & reopen）会在这里显示。
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function TopNav({ right }: { right: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="rounded-md border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground/90">
          E
        </div>
        <div className="text-sm font-semibold tracking-tight">EversoAI</div>
        <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
          <span className="rounded border border-border bg-background/40 px-2 py-1">启动</span>
          <span className="rounded border border-transparent px-2 py-1">对话</span>
          <span className="rounded border border-transparent px-2 py-1">设置</span>
        </div>
      </div>
      {right}
    </div>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-background/30 px-2.5 py-1 font-mono text-[11px]">
      {children}
    </span>
  )
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-4">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{desc}</div>
      <div className="mt-3 font-mono text-[11px] text-muted-foreground">Learn more →</div>
    </div>
  )
}

function StepCard({
  n,
  title,
  body,
  footer,
}: {
  n: number
  title: string
  body: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-background/30 p-4">
      <div className="flex items-baseline justify-between gap-4">
        <div className="text-sm font-semibold">{title}</div>
        <div className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">{n}</div>
      </div>
      {body}
      {footer}
    </div>
  )
}
