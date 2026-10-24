import { Component,Suspense,useEffect,useMemo,useRef,useState,type ReactNode } from 'react';
import { Canvas,useFrame,useLoader,useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { products,type Product } from '@/lib/products';
import { assetUrl } from '@/lib/router';
function labelTexture(p:Product){
 const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=1024;const c=canvas.getContext('2d')!;
 c.fillStyle=p.color;c.fillRect(0,0,2048,1024);
 const grad=c.createLinearGradient(0,0,2048,0);grad.addColorStop(0,p.color);grad.addColorStop(.25,p.accent);grad.addColorStop(.55,p.accent);grad.addColorStop(1,p.color);c.fillStyle=grad;c.fillRect(0,0,2048,1024);
 // The front is centered at U=.5; the reverse contains an explicitly illustrative label.
 c.strokeStyle='rgba(255,255,255,.18)';c.lineWidth=3;for(let i=0;i<8;i++){c.beginPath();c.moveTo(0,780+i*19);c.bezierCurveTo(650,370+i*19,1250,1100+i*19,2048,570+i*19);c.stroke();}
 c.fillStyle='#29203b';c.font='600 55px Montserrat, Arial, sans-serif';c.fillText('eMCapsulados',690,155);
 c.font='20px Arial';c.letterSpacing='5px';c.fillText('ESSENTIAL COLLECTION',693,211);c.letterSpacing='0px';
 c.font=`500 ${p.short.length>10?66:86}px Montserrat, Arial, sans-serif`;c.fillText(p.short,690,405);c.font='19px Arial';c.fillText('SUPLEMENTO ALIMENTAR',694,457);c.fillText('EM CÁPSULAS',694,487);
 c.font='500 114px Montserrat, Arial';c.fillText(p.number,687,778);c.beginPath();c.moveTo(693,833);c.lineTo(1340,833);c.strokeStyle='rgba(39,25,58,.45)';c.lineWidth=1;c.stroke();c.font='24px Arial';c.fillText(p.capsules+' CÁPSULAS',694,892);c.font='15px Arial';c.fillText('LINHA DEMONSTRATIVA',1093,891);
 c.font='19px Arial';c.fillText('eMCapsulados / '+p.name,60,240);c.font='15px Arial';['EMBALAGEM DEMONSTRATIVA','Composição ilustrativa da coleção.','Não é um medicamento.','Consulte um profissional de saúde.','eMCapsulados Wellness Ltda. | Salvador, BA'].forEach((t,i)=>c.fillText(t,60,300+i*45));
 const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.flipY=true;tex.anisotropy=8;return tex;
}
function Bottle({index,active,reduced}:{index:number;active:boolean;reduced:boolean}){
 const gltf=useLoader(GLTFLoader,assetUrl('/models/essential-bottle.glb'));const group=useRef<THREE.Group>(null);const reveal=useRef(0);const previousActive=useRef(false);const {invalidate}=useThree();
 const texture=useMemo(()=>labelTexture(products[index]),[index]);
 const model=useMemo(()=>{const scene=gltf.scene.clone(true);scene.traverse(o=>{if(o instanceof THREE.Mesh){const material=(o.material as THREE.MeshStandardMaterial).clone();if(o.name==='Label'){material.map=texture;material.needsUpdate=true;}material.transparent=true;o.material=material;}});return scene;},[gltf,texture]);
 useEffect(()=>{invalidate();},[active,invalidate]);
 useEffect(()=>()=>{texture.dispose();model.traverse(o=>{if(o instanceof THREE.Mesh)(o.material as THREE.Material).dispose();});},[texture,model]);
 useFrame((state,rawDelta)=>{const g=group.current;if(!g)return;const delta=Math.min(rawDelta,.045);if(active&&!previousActive.current&&!reduced)reveal.current=.45;previousActive.current=active;reveal.current=reduced?1:THREE.MathUtils.damp(reveal.current,1,5,delta);const r=reveal.current;const t=state.clock.elapsedTime;const h=active&&!reduced;
 const scale=(h?.94:.78)*(.94+.06*r);const angles=[-.12,0,.12];const y=reduced?0:Math.sin(t*.7+index*1.5)*.028+(h?.13:0)-(1-r)*.3;
 g.position.set((index-1)*1.52,y,0);g.scale.setScalar(THREE.MathUtils.damp(g.scale.x,scale,7,delta));g.rotation.x=THREE.MathUtils.damp(g.rotation.x,reduced?0:(h?-.07:.025),5,delta);g.rotation.y=THREE.MathUtils.damp(g.rotation.y,Math.PI+(h?[-.24,.28,-.22][index]:[-.08,0,.08][index])+(1-r)*.4,5,delta);g.rotation.z=THREE.MathUtils.damp(g.rotation.z,reduced?0:(h?angles[index]*.35:angles[index]),6,delta);
 model.traverse(o=>{if(o instanceof THREE.Mesh)(o.material as THREE.MeshStandardMaterial).opacity=reduced?1:Math.min(1,.45+r*.55);});
 });
 return <group ref={group} position={[(index-1)*1.52,0,0]} scale={.78} rotation={[0,Math.PI,[-.12,0,.12][index]]}><primitive object={model}/></group>;
}
function Ready({onReady}:{onReady:()=>void}){useEffect(()=>{onReady();},[onReady]);return null;}
class SceneBoundary extends Component<{children:ReactNode;onFail:()=>void},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}componentDidCatch(){this.props.onFail();}render(){return this.state.failed?null:this.props.children;}}
export default function BottleScene({activeIndex,reduced}:{activeIndex:number|null;reduced:boolean}){
 const [supported,setSupported]=useState(false);const [visible,setVisible]=useState(true);const [ready,setReady]=useState(false);const holder=useRef<HTMLDivElement>(null);const [mobile,setMobile]=useState(false);const setSceneReady=useMemo(()=>()=>setReady(true),[]);
 useEffect(()=>{setMobile(window.matchMedia('(max-width: 640px)').matches);try{const canvas=document.createElement('canvas');const context=canvas.getContext('webgl2');if(context){setSupported(true);context.getExtension('WEBGL_lose_context')?.loseContext();}}catch{}},[]);
 useEffect(()=>{if(!holder.current)return;const el=holder.current;const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:'80px'});observer.observe(el);return()=>observer.disconnect();},[]);
 useEffect(()=>{const parent=holder.current?.parentElement;if(parent)parent.dataset.rendered=ready?'true':'false';return()=>{if(parent)delete parent.dataset.rendered;};},[ready]);
 return <div className="trio-canvas" ref={holder} aria-hidden="true">{supported&&<SceneBoundary onFail={()=>{setReady(false);setSupported(false);}}><Canvas dpr={[1,mobile?1.1:1.5]} camera={{position:[0,.25,6.5],fov:34}} frameloop={visible?(reduced?'demand':'always'):'never'} gl={{antialias:true,alpha:true,powerPreference:'low-power'}} onCreated={({gl})=>{gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.1;}}><ambientLight intensity={1.7}/><directionalLight position={[-3,5,5]} intensity={3.2} color="#fff8f0"/><directionalLight position={[4,2,3]} intensity={2.1} color="#bfccff"/><pointLight position={[0,-2,3]} intensity={9} color="#b09ae8"/><Suspense fallback={null}>{[0,1,2].map(index=><Bottle key={index} index={index} active={activeIndex===index} reduced={reduced}/>)}<Ready onReady={setSceneReady}/></Suspense></Canvas></SceneBoundary>}</div>;
}
