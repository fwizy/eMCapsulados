import { useEffect,useRef,type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence,motion,useReducedMotion } from 'motion/react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
export function MotionLayout({children}:{children:ReactNode}){const location=useLocation();const reduced=useReducedMotion();const lenis=useRef<Lenis|null>(null);
 useEffect(()=>{if(reduced)return;const instance=new Lenis({autoRaf:true,duration:1.05,smoothWheel:true,syncTouch:false,prevent:node=>!!node.closest('dialog, [data-lenis-prevent]')});lenis.current=instance;const onModal=()=>{document.querySelector('dialog[open]')?instance.stop():instance.start();};const observer=new MutationObserver(onModal);observer.observe(document.body,{attributes:true,attributeFilter:['open'],subtree:true});return()=>{observer.disconnect();instance.destroy();lenis.current=null;};},[reduced]);
 const scrollToSection=()=>{const section=new URLSearchParams(location.search).get('secao')||location.hash.slice(1);if(section){const element=document.getElementById(section);if(element){lenis.current?lenis.current.scrollTo(element,{offset:-88,immediate:!!reduced}):element.scrollIntoView({behavior:reduced?'instant':'smooth'});}}};
 useEffect(()=>{const section=new URLSearchParams(location.search).get('secao')||location.hash.slice(1);const handle=requestAnimationFrame(()=>{if(section)scrollToSection();else{lenis.current?.scrollTo(0,{immediate:true});window.scrollTo({top:0,behavior:'instant'});}});return()=>cancelAnimationFrame(handle);},[location.pathname,location.hash,new URLSearchParams(location.search).get('secao'),reduced]);

 return <AnimatePresence mode="wait" initial={false}><motion.div key={location.pathname} className="route-view" initial={reduced?{opacity:1}:{opacity:0,y:9}} animate={{opacity:1,y:0}} onAnimationComplete={scrollToSection} exit={{opacity:0}} transition={{duration:reduced?0:.18,ease:'easeOut'}}>{children}</motion.div></AnimatePresence>;
}
