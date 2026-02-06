import { PanelResizeHandle } from 'react-resizable-panels'
import { cn } from '@/lib/utils'

export function ResizeHandle({ className }: { className?: string }) {
  return (
    <PanelResizeHandle
      className={cn(
        'relative w-1 bg-transparent',
        'after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-border',
        'hover:after:bg-ring/60',
        className,
      )}
    />
  )
}

