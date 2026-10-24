import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath,URL } from 'node:url';
import { sites } from './scripts/vite/sites-vite-plugin';
export default defineConfig({base:process.env.VITE_BASE_PATH||'./',plugins:[react(),...(process.env.SITES_MANAGED_LINUX_CONTAINER==='1'?[sites({mockAuth:false})]:[])],resolve:{alias:{'@':fileURLToPath(new URL('.',import.meta.url))}},server:{host:'0.0.0.0',allowedHosts:['terminal.local']},build:{outDir:'dist',emptyOutDir:true,chunkSizeWarningLimit:650}});
