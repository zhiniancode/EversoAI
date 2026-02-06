import { BrowserWindow, dialog, ipcMain } from 'electron'

function getDialogWindow() {
  // Use focused window when available; fallback to any window.
  return BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0]
}

export function registerWorkspaceIpc() {
  ipcMain.handle('workspace:pick-directory', async () => {
    const win = getDialogWindow()
    const result = win
      ? await dialog.showOpenDialog(win, { properties: ['openDirectory'] })
      : await dialog.showOpenDialog({ properties: ['openDirectory'] })
 
    if (result.canceled) return null
    return result.filePaths[0] ?? null
  })

  ipcMain.handle('workspace:pick-file', async () => {
    const win = getDialogWindow()
    const result = win
      ? await dialog.showOpenDialog(win, { properties: ['openFile'] })
      : await dialog.showOpenDialog({ properties: ['openFile'] })

    if (result.canceled) return null
    return result.filePaths[0] ?? null
  })
}
