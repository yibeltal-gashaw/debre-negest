import { app, BrowserWindow, ipcMain } from "electron";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx"; // default import works with ESM
import {
  deleteBaby, deleteNwayekdusanItem, deletePriest,
  // NEWAYEKIDUSAN
  getAllNwayekdusanItems, getAllPriest, getAllServants,
  getFathers, getUser, importExcelData, initDatabase, loadMarriage,
  // USERS     
  login, registerNewBaby,
  // MARRIAGE
  saveMarriage, saveNwayekdusanItem,
  // PRIESTS  
  savePriest,
  //SERVANTS
  saveServants, searchInCouples, totalDeacons, totalItems, totalKahinat, totalKomosat, updateBaby, updateNwayekdusanItem, updatePhoto, updatePriestInfo, updatePriestServiceInfo,
  updatePriestSocialStatus, updateProfile, updateServantInfo
} from './src/js/database.js';
// Setup __dirname workaround for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set custom cache directory
const cachePath = path.join(__dirname, "assets/cache");
try {
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath, { recursive: true });
    console.log("Created cache directory:", cachePath);
  }
  app.setPath("cache", cachePath);
  console.log("Cache path set to:", app.getPath("cache"));
} catch (err) {
  console.error("Failed to set up cache directory:", err.message);
}

// Disable Chromium cache
app.commandLine.appendSwitch;

let mainWindow;

function createWindow() {
  console.log("__dirname:", __dirname);
  console.log("process.cwd():", process.cwd());
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true, // Hide the menu bar
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      preload: path.join(__dirname, "src/js/preload.js"), // Use preload script for security
    },
  });
 
  mainWindow.loadFile("src/views/index.html").catch((err) => {
    console.error("Failed to load login.html:", err.message);
  });
  initDatabase();
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
 
ipcMain.handle('print-section', async (event, sectionHtml) => {
  const previewWin = new BrowserWindow({ show: false });
  // Wrap section in full HTML document
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Print Section</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
      </style>
    </head>
    <body>
      ${sectionHtml}
    </body>
    </html>
  `;
  console.log(html);
  
  await previewWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);

  await new Promise(resolve => previewWin.webContents.once('did-finish-load', resolve));

  const pdfData = await previewWin.webContents.printToPDF({
    printBackground: true,
    pageSize: 'A4'
  });

  previewWin.close();

  return pdfData.toString('base64');
});

// MARRIAGE
ipcMain.handle("load-marriage", async () => {
  try {
    const result = await loadMarriage();
    return result; // { success: true, data: [...] }
  } catch (err) {
    console.error("IPC load-certificates error:", err);
    return {
      success: false,
      error: err.error || "Failed to load certificates",
    };
  }
});

ipcMain.handle("save-marriage", async (event, data) => {
  try {
    const result = await saveMarriage(data);
    return result; // { success: true, data: [...] }
  } catch (err) {
    console.error("IPC load-certificates error:", err);
    return {
      success: false,
      error: err.error || "Failed to load certificates",
    };
  }
});
ipcMain.handle("search-marriage", async (_, data) => {
  try {
    const result = await searchInCouples(data);
    return result; // { success: true, data: [...] }
  } catch (err) {
    console.error("IPC searchInCouples error:", err);
    return {
      success: false,
      error: err.error || "Failed to load certificates",
    };
  }
});
// USERS
ipcMain.handle("login", async (event, username, password) => {
  return new Promise((resolve) => {
    login(username, password, (success, role) => {
      resolve({ success, role });
    });
  });
});

ipcMain.handle('register-new-baby', async (event, babyData) => {
  return new Promise((resolve) => {
    registerNewBaby(babyData, (err, id) => {
      resolve({ success: !err, id, error: err?.message });
    });
  });
});

ipcMain.handle('update-baby', async (event, id, babyData) => {
  return new Promise((resolve) => {
    updateBaby(id, babyData, (err) => {
      resolve({ success: !err, error: err?.message });
    });
  });
});

ipcMain.handle('delete-baby', async (event, id) => {
  return new Promise((resolve) => {
    deleteBaby(id, (err) => {
      resolve({ success: !err, error: err?.message });
    });
  });
});

ipcMain.handle("getUser", async (event, username = "admin") => {
  return new Promise((resolve) => {
    getUser((success, user) => {
      if (success) {
        resolve({ success: true, user });
      } else {
        resolve({ success: false, user: null });
      }
    }, username);
  });
});
ipcMain.handle("update-profile", async (event, id, photo) => {
  return new Promise((resolve) => {
    updateProfile(id, photo, (success, error) => {
      if (success) resolve({ success: true });
      else resolve({ success: false, error });
    });
  });
});

//NWAYEKIDUSAN
ipcMain.handle("save-nwayekdusan-item", async (event, itemData) => {
  return new Promise((resolve) => {
    saveNwayekdusanItem(itemData, (success, result) => {
      if (success) {
        resolve({ success: true, id: result });
      } else {
        resolve({ success: false, error: result });
      }
    });
  });
});

ipcMain.handle("get-all-nwayekdusan-items", async (event) => {
  return new Promise((resolve) => {
    getAllNwayekdusanItems((success, items) => {
      if (success) {
        resolve({ success: true, items });
      } else {
        resolve({ success: false, error: items });
      }
    });
  });
});

ipcMain.handle("update-nwayekdusan-item", async (event, itemData) => {
  return new Promise((resolve) => {
    updateNwayekdusanItem(itemData, (success, error) => {
      if (success) resolve({ success: true });
      else resolve({ success: false, error });
    });
  });
});

ipcMain.handle("delete-nwayekdusan-item", async (event, id) => {
  return new Promise((resolve) => {
    deleteNwayekdusanItem(id, (success, error) => {
      if (success) resolve({ success: true });
      else resolve({ success: false, error });
    });
  });
});

ipcMain.handle("total-items", async (_,tab) => {
  try {
    const result = totalItems(tab);
    return result;
  } catch (error) {
    return{
      success: false,
      error: error.message | "Unable to count total value"
    }
  }
});

// PRIESTS
ipcMain.handle("save-priest", async (event, data) => {
  return new Promise((resolve) => {
    savePriest(data, (success, result) => {
      if (success) resolve({ success: true, id: result });
      else resolve({ success: false, error: result });
    });
  });
});

ipcMain.handle("get-priest", async (event) => {
  return new Promise((resolve) => {
    getAllPriest((success, data) => {
      if (success) {
        resolve({ success: true, data });
      } else {
        resolve({ success: false, error: data });
      }
    });
  });
});

ipcMain.handle("delete-priest", async (event, id) => {
  return new Promise((resolve) => {
    deletePriest(id, (success, error) => {
      if (success) resolve({ success: true });
      else resolve({ success: false, error });
    });
  });
});

ipcMain.handle("update-photo", async (event, id, photo) => {
  return new Promise((resolve) => {
    updatePhoto(id, photo, (success, error) => {
      if (success) resolve({ success: true });
      else resolve({ success: false, error });
    });
  });
});

ipcMain.handle("get-fathers", async () => {
  return new Promise((resolve) => {
    getFathers((success, dataOrError) => {
      if (success) {
        resolve({ success: true, data: dataOrError });
      } else {
        resolve({ success: false, error: dataOrError });
      }
    });
  });
});

ipcMain.handle("update-priest-info", async (_, data) => {
  return new Promise((resolve) => {
    updatePriestInfo(data, (success, msg) => {
      if (success) {
        resolve({ success: true, message: msg });
      } else {
        resolve({ success: false, error: msg });
      }
    });
  });
});

ipcMain.handle("update-priest-service-info", async (_, data) => {
  return new Promise((resolve) => {
    updatePriestServiceInfo(data, (success, msg) => {
      if (success) {
        resolve({ success: true, message: msg });
      } else {
        resolve({ success: false, error: msg });
      }
    });
  });
});

ipcMain.handle("update-priest-social-status", async (_, data) => {
  return new Promise((resolve) => {
    updatePriestSocialStatus(data, (success, msg) => {
      if (success) {
        resolve({ success: true, message: msg });
      } else {
        resolve({ success: false, error: msg });
      }
    });
  });
});

ipcMain.handle("total-kahinat", async () => {
  return new Promise((resolve) => {
    totalKahinat((success, dataOrError) => {
      if (success) resolve({ success: true, priests: dataOrError });
      else resolve({ success: false, error: dataOrError });
    });
  });
});

ipcMain.handle("search-priests", async (_, t, c, q) => {
  try {
    const result = await searchInPriests(t, c, q);
    return result; // { success: true, data: [...] }
  } catch (err) {
    console.error("IPC searchInPriests error:", err);
    return {
      success: false,
      error: err.error || "Failed to searchInPriests",
    };
  }
});

//

ipcMain.handle("total-deacons", async (event) => {
  return new Promise((resolve) => {
    totalDeacons((success, dataOrError) => {
      if (success) resolve({ success: true, deacons: dataOrError });
      else resolve({ success: false, error: dataOrError });
    });
  });
});

ipcMain.handle("total-komosat", async (event) => {
  return new Promise((resolve) => {
    totalKomosat((success, dataOrError) => {
      if (success) resolve({ success: true, komosat: dataOrError });
      else resolve({ success: false, error: dataOrError });
    });
  });
});

// SERVANT
ipcMain.handle("save-servants", async (_, data) => {
  return new Promise((resolve) => {
    saveServants(data, (success, error) => {
      if (success) resolve({ success: true });
      else resolve({ success: false, error });
    });
  });
});
ipcMain.handle("get-all-servants", async () => {
  try {
    const data = await getAllServants();
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
});

ipcMain.handle("update-servant-info", async (_, sdata) => {
  return new Promise((resolve) => {
    updateServantInfo(sdata, (success, msg) => {
      if (success) {
        resolve({ success: true, message: msg });
      } else {
        resolve({ success: false, error: msg });
      }
    });
  });
});
  
ipcMain.handle("import-excel", async (_, filePath) => {
  try {
    const datafile = new Uint8Array(filePath);
    const workbook = XLSX.read(datafile, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName]; 

    const excelData = XLSX.utils.sheet_to_json(sheet); // Convert to JSON
    const data = excelData.forEach(arg => importExcelData(arg))
    return { success: true, data:'Data inserted Successfully.' };
  } catch (err) { 
    console.error(err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle("save-pdf", async (_, { name, buffer }) => {
  try {
    const saveDir = path.join(__dirname, "uploads");
    fs.mkdirSync(saveDir, { recursive: true });

    // Make file name unique by appending timestamp
    const timestamp = Date.now();
    const ext = path.extname(name); // ".pdf"
    const baseName = path.basename(name, ext);
    const uniqueName = `${baseName}_${timestamp}${ext}`;
    const savePath = path.join(saveDir, uniqueName);

    fs.writeFileSync(savePath, buffer);

    // Return a file:// URL so renderer can embed
    return { success: true, url: `file://${savePath}`, path: savePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});