import { useNavigate } from 'react-router-dom'

export function SettingsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <header className="flex items-start justify-between gap-6">
          <div>
            <div className="text-sm font-medium text-muted-foreground">EversoAI</div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">设置</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              UI（字体/颜色）与 Provider 配置会在这里完善。
            </p>
          </div>

          <button
            type="button"
            className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground/90 hover:bg-accent"
            onClick={() => navigate(-1)}
          >
            返回
          </button>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <section className="rounded-xl border border-border bg-card/50 p-5">
            <h2 className="text-sm font-semibold">CLI 外观</h2>
            <div className="mt-4 grid gap-3">
              <label className="grid gap-1 text-xs text-muted-foreground">
                字体族
                <input
                  className="rounded-md border border-input bg-background/40 px-3 py-2 font-mono text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
                  placeholder="例如：Cascadia Mono"
                  disabled
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-1 text-xs text-muted-foreground">
                  字号
                  <input
                    className="rounded-md border border-input bg-background/40 px-3 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
                    placeholder="14"
                    disabled
                  />
                </label>
                <label className="grid gap-1 text-xs text-muted-foreground">
                  行高
                  <input
                    className="rounded-md border border-input bg-background/40 px-3 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
                    placeholder="1.5"
                    disabled
                  />
                </label>
              </div>
              <div className="text-xs text-muted-foreground">
                存储与即时预览会在 IPC + 设置存储落地后接入。
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card/50 p-5">
            <h2 className="text-sm font-semibold">Custom API</h2>
            <div className="mt-4 grid gap-3">
              <label className="grid gap-1 text-xs text-muted-foreground">
                Base URL
                <input
                  className="rounded-md border border-input bg-background/40 px-3 py-2 font-mono text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
                  placeholder="https://api.example.com/v1"
                  disabled
                />
              </label>
              <label className="grid gap-1 text-xs text-muted-foreground">
                Model
                <input
                  className="rounded-md border border-input bg-background/40 px-3 py-2 font-mono text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
                  placeholder="gpt-4.1-mini"
                  disabled
                />
              </label>
              <label className="grid gap-1 text-xs text-muted-foreground">
                API Key
                <input
                  className="rounded-md border border-input bg-background/40 px-3 py-2 font-mono text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
                  placeholder="••••••••"
                  disabled
                />
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
