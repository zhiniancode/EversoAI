/// <reference types="vite/client" />

declare global {
  interface Window {
    api?: {
      pickWorkspaceDirectory: () => Promise<string | null>
      pickWorkspaceFile: () => Promise<string | null>
    }
  }
}

export {}
