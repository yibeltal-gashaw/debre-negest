const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  printDocument: (html) => ipcRenderer.invoke('print-section', html),
  printCertificate: () => ipcRenderer.send('print-certificate'),
  // users
  updateProfile: (id, photo) => ipcRenderer.invoke("update-profile", id, photo),
  login: (username, password) =>
    ipcRenderer.invoke("login", username, password),
  getUser: (username) => ipcRenderer.invoke("getUser", username),

  // Nwaye Kidusan
  saveNwayekdusanItem: (itemData) => 
    ipcRenderer.invoke("save-nwayekdusan-item", itemData),
  getAllNwayekdusanItems: () => ipcRenderer.invoke("get-all-nwayekdusan-items"),
  updateNwayekdusanItem: (itemData) =>
    ipcRenderer.invoke("update-nwayekdusan-item", itemData),
  deleteNwayekdusanItem: (id) =>
    ipcRenderer.invoke("delete-nwayekdusan-item", id),
  savePriest: (priestData) => ipcRenderer.invoke("save-priest", priestData),
  totalItems: (tab) => ipcRenderer.invoke("total-items",tab),

  // priests
  getAllPriest: () => ipcRenderer.invoke("get-priest"),
  deletePriest: (id) => ipcRenderer.invoke("delete-priest", id),
  updatePriest: (id) => ipcRenderer.invoke("update-priest", id),
  updatePhoto: (id, photo) => ipcRenderer.invoke("update-photo", id, photo),
  updatePriestInfo: (data) => ipcRenderer.invoke("update-priest-info", data),
  updatePriestServiceInfo: (data) =>
    ipcRenderer.invoke("update-priest-service-info", data),
  updatePriestSocialStatus: (data) =>
    ipcRenderer.invoke("update-priest-social-status", data),
  getFathers: () => ipcRenderer.invoke("get-fathers"),
  totalKahinat: () => ipcRenderer.invoke("total-kahinat"),
  totalDeacons: () => ipcRenderer.invoke("total-deacons"),
  totalKomosat: () => ipcRenderer.invoke("total-komosat"),
  searchInPriests: (q) => ipcRenderer.invoke("search-priests",q),

  // Servants
  saveServants: (data) => ipcRenderer.invoke("save-servants", data),
  getAllServants: () => ipcRenderer.invoke("get-all-servants"),
  updateServantInfo: (sdata) =>
    ipcRenderer.invoke("update-servant-info", sdata),

  // MARRIAGE
  saveMarriage: (data) => ipcRenderer.invoke("save-marriage", data),
  loadMarriage: () => ipcRenderer.invoke("load-marriage"),
  searchInCouples: (data) => ipcRenderer.invoke("search-marriage",data),
  importExcel: (file) => ipcRenderer.invoke("import-excel",file),

  savePdf: (file) => ipcRenderer.invoke('save-pdf', file),
    processPdfInput,
    registerNewBaby: (babyData) => ipcRenderer.invoke('register-new-baby', babyData),
    updateBaby: (id, babyData) => ipcRenderer.invoke('update-baby', id, babyData),
    deleteBaby: (id) => ipcRenderer.invoke('delete-baby', id),
});


async function processPdfInput(inputId) {
  
  const fileInput = document.getElementById(inputId);
  const file = fileInput?.files[0];
  if (!file) return null;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await ipcRenderer.invoke("save-pdf", {
    name: file.name,
    buffer: buffer
  });

  console.log(`Result from ${inputId}:`, result);
  return result;
}
