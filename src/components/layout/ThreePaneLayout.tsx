import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Panel, PanelGroup, type ImperativePanelHandle } from 'react-resizable-panels'
import { cn } from '@/lib/utils'
import { ResizeHandle } from '@/components/layout/ResizeHandle'

type ThreePaneLayoutProps = {
  left: ReactNode
  center: ReactNode
  right: ReactNode
  defaultLeftCollapsed?: boolean
  defaultRightCollapsed?: boolean
  chrome?: 'default' | 'none'
}

export function ThreePaneLayout({
  left,
  center,
  right,
  defaultLeftCollapsed,
  defaultRightCollapsed,
  chrome = 'default',
}: ThreePaneLayoutProps) {
  const leftRef = useRef<ImperativePanelHandle>(null)
  const rightRef = useRef<ImperativePanelHandle>(null)

  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)

  const shortcuts = useMemo(
    () => ({
      toggleLeft() {
        const panel = leftRef.current
        if (!panel) return
        if (panel.isCollapsed()) panel.expand()
        else panel.collapse()
      },
      toggleRight() {
        const panel = rightRef.current
        if (!panel) return
        if (panel.isCollapsed()) panel.expand()
        else panel.collapse()
      },
    }),
    [],
  )

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isMac = navigator.platform.toLowerCase().includes('mac')
      const mod = isMac ? e.metaKey : e.ctrlKey
      if (!mod) return

      // Ctrl/Cmd + B: toggle left
      if (e.key.toLowerCase() === 'b') {
        e.preventDefault()
        shortcuts.toggleLeft()
      }

      // Ctrl/Cmd + ]: toggle right
      if (e.key === ']') {
        e.preventDefault()
        shortcuts.toggleRight()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [shortcuts])

  useEffect(() => {
    if (defaultLeftCollapsed) leftRef.current?.collapse()
    if (defaultRightCollapsed) rightRef.current?.collapse()
  }, [defaultLeftCollapsed, defaultRightCollapsed])

  if (chrome === 'none') {
    return (
      <div className="relative h-screen w-screen">
        <PanelGroup direction="horizontal" className="h-full w-full">
          <Panel
            ref={leftRef}
            defaultSize={20}
            minSize={12}
            collapsedSize={4}
            collapsible
            onCollapse={() => setLeftCollapsed(true)}
            onExpand={() => setLeftCollapsed(false)}
            className="bg-muted"
          >
            <div className={cn('h-full border-r border-border', leftCollapsed && 'px-1')}>{left}</div>
          </Panel>

          <ResizeHandle />

          <Panel defaultSize={60} minSize={40} className="bg-background">
            <div className="h-full">{center}</div>
          </Panel>

          <ResizeHandle />

          <Panel
            ref={rightRef}
            defaultSize={20}
            minSize={14}
            collapsedSize={0}
            collapsible
            onCollapse={() => setRightCollapsed(true)}
            onExpand={() => setRightCollapsed(false)}
            className="bg-muted"
          >
            <div className="h-full border-l border-border">{right}</div>
          </Panel>
        </PanelGroup>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-screen">
      <PanelGroup direction="horizontal" className="h-full w-full">
        <Panel
          ref={leftRef}
          defaultSize={20}
          minSize={12}
          collapsedSize={4}
          collapsible
          onCollapse={() => setLeftCollapsed(true)}
          onExpand={() => setLeftCollapsed(false)}
          className="bg-card/40"
        >
          <div className="h-full border-r border-border">
            <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
              <div className={cn('text-xs font-semibold tracking-wide text-muted-foreground', leftCollapsed && 'sr-only')}>
                会话
              </div>
              <button
                type="button"
                className="rounded-md border border-border bg-background/40 px-2 py-1 text-xs text-foreground/90 hover:bg-accent"
                onClick={() => shortcuts.toggleLeft()}
                aria-label="切换会话面板 (Ctrl/Cmd+B)"
                title="切换会话面板 (Ctrl/Cmd+B)"
              >
                {leftCollapsed ? '»' : '«'}
              </button>
            </div>
            <div className={cn('h-[calc(100%-40px)]', leftCollapsed && 'px-1')}>{left}</div>
          </div>
        </Panel>

        <ResizeHandle />

        <Panel defaultSize={60} minSize={40} className="bg-background/20">
          <div className="h-full">{center}</div>
        </Panel>

        <ResizeHandle />

        <Panel
          ref={rightRef}
          defaultSize={20}
          minSize={14}
          collapsedSize={0}
          collapsible
          onCollapse={() => setRightCollapsed(true)}
          onExpand={() => setRightCollapsed(false)}
          className="bg-card/40"
        >
          <div className="h-full border-l border-border">
            <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
              <div className={cn('text-xs font-semibold tracking-wide text-muted-foreground', rightCollapsed && 'sr-only')}>
                工作区
              </div>
              <button
                type="button"
                className="rounded-md border border-border bg-background/40 px-2 py-1 text-xs text-foreground/90 hover:bg-accent"
                onClick={() => shortcuts.toggleRight()}
                aria-label="切换工作区面板 (Ctrl/Cmd+])"
                title="切换工作区面板 (Ctrl/Cmd+])"
              >
                {rightCollapsed ? '«' : '»'}
              </button>
            </div>
            <div className="h-[calc(100%-40px)]">{right}</div>
          </div>
        </Panel>
      </PanelGroup>

      {rightCollapsed ? (
        <button
          type="button"
          className="absolute bottom-4 right-4 rounded-full border border-border bg-card/80 px-3 py-2 text-xs text-foreground/90 shadow-lg backdrop-blur hover:bg-accent"
          onClick={() => shortcuts.toggleRight()}
          aria-label="显示工作区面板"
          title="显示工作区面板"
        >
          工作区
        </button>
      ) : null}
    </div>
  )
}
