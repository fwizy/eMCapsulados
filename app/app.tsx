import { Component,type ReactNode,useEffect } from 'react';
import { HashRouter,Routes,Route,useLocation,useParams } from 'react-router-dom';
import { StoreShell } from '@/components/store/shell';
import { ThemeProvider } from '@/lib/theme';
import { MotionLayout } from '@/components/store/motion-layout';
import Home from './page';
import Produtos from './produtos/page';
import Categorias from './categorias/page';
import Carrinho from './carrinho/page';
import FAQ from './faq/page';
import Politicas from './politicas/page';
import Feedback from './feedback/page';
import Contato from './contato/page';
import NotFound from './not-found';
import Produto from './produtos/[slug]/page';
import { getProduct } from '@/lib/products';
function PageMetadata(){const {pathname}=useLocation();useEffect(()=>{const titles:Record<string,string>={'/':'Seu bem-estar, em outra dimensão','/produtos':'Produtos','/categorias':'Categorias','/carrinho':'Seu carrinho','/faq':'Perguntas frequentes','/politicas':'Políticas e transparência','/feedback':'Experiências','/contato':'Contato'};const title=titles[pathname]||getProduct(pathname.split('/').pop()||'')?.name||'Página não encontrada';document.title=title+' | eMCapsulados';},[pathname]);return null;}
function ProductRoute(){const {slug=''}=useParams();return <Produto slug={slug}/>;}
class AppErrorBoundary extends Component<{children:ReactNode},{error:boolean}>{state={error:false};static getDerivedStateFromError(){return {error:true};}render(){if(this.state.error)return <main className="inner-page container"><div className="empty-state"><h1>Uma pausa inesperada.</h1><p>Não foi possível carregar esta página.</p><button className="button primary" onClick={()=>window.location.reload()}>Tentar novamente</button></div></main>;return this.props.children;}}
export default function App(){const location=useLocation();return <ThemeProvider><PageMetadata/><AppErrorBoundary><StoreShell><MotionLayout><Routes location={location}><Route path="/" element={<Home/>}/><Route path="/produtos" element={<Produtos/>}/><Route path="/produtos/:slug" element={<ProductRoute/>}/><Route path="/categorias" element={<Categorias/>}/><Route path="/carrinho" element={<Carrinho/>}/><Route path="/faq" element={<FAQ/>}/><Route path="/politicas" element={<Politicas/>}/><Route path="/feedback" element={<Feedback/>}/><Route path="/contato" element={<Contato/>}/><Route path="*" element={<NotFound/>}/></Routes></MotionLayout></StoreShell></AppErrorBoundary></ThemeProvider>;}
