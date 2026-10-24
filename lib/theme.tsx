import { createContext,useContext,useEffect,useState,type ReactNode } from 'react';
export type ThemeMode='light'|'dark'|'auto';
const ThemeContext=createContext<{mode:ThemeMode;resolved:'light'|'dark';setMode:(m:ThemeMode)=>void}>({mode:'auto',resolved:'light',setMode:()=>{}});
export function ThemeProvider({children}:{children:ReactNode}){
 const [mode,setMode]=useState<ThemeMode>(()=>{try{const saved=localStorage.getItem('emcapsulados.theme');return saved==='dark'||saved==='light'?saved:'auto';}catch{return 'auto';}});
 const [systemDark,setSystemDark]=useState(()=>window.matchMedia('(prefers-color-scheme: dark)').matches);
 const resolved=mode==='auto'?(systemDark?'dark':'light'):mode;
 useEffect(()=>{const media=window.matchMedia('(prefers-color-scheme: dark)');const change=()=>setSystemDark(media.matches);media.addEventListener('change',change);return()=>media.removeEventListener('change',change);},[]);
 useEffect(()=>{document.documentElement.dataset.theme=resolved;document.documentElement.style.colorScheme=resolved;try{localStorage.setItem('emcapsulados.theme',mode);}catch{}},[mode,resolved]);
 return <ThemeContext.Provider value={{mode,resolved,setMode}}>{children}</ThemeContext.Provider>;
}
export const useTheme=()=>useContext(ThemeContext);
