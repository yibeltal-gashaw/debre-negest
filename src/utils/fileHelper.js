async function processPdfInput(inputId) {
    const input = document.getElementById(inputId);
    const file = input?.files[0];
    if (!file) return null;
  
    // Instead of file.path (not available in renderer),
    // we send the File object to main via preload (ipcRenderer)
    return await window.api.savePdf(file, file.name);
  }
  
  