import { contextBridge } from 'electron';
import login from './auth.js'

contextBridge.exposeInMainWorld('authAPI', {
  login
});