import { ipcRenderer, contextBridge } from 'electron'

// Expose a narrow, typed API surface (avoid exposing raw ipcRenderer).
contextBridge.exposeInMainWorld('api', {
  pickWorkspaceDirectory: () => ipcRenderer.invoke('workspace:pick-directory') as Promise<string | null>,
  pickWorkspaceFile: () => ipcRenderer.invoke('workspace:pick-file') as Promise<string | null>,
})
