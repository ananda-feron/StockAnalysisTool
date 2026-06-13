const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("hawkReports", {
  list: () => ipcRenderer.invoke("reports:list"),
  save: (payload) => ipcRenderer.invoke("reports:save", payload),
  open: (reportPath) => ipcRenderer.invoke("reports:open", reportPath),
  reveal: (reportPath) => ipcRenderer.invoke("reports:reveal", reportPath)
});