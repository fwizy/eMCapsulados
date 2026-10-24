import Link from '@/lib/router';
import { getProduct } from '@/lib/products';
import { ProductDetail } from '@/components/store/product-detail';
import NotFound from '@/app/not-found';
export default function Produto({slug}:{slug:string}){const p=getProduct(slug);if(!p)return <NotFound/>;return <main id="conteudo" className="inner-page detail-page container"><div className="breadcrumbs"><Link href="/">Início</Link><span>/</span><Link href="/produtos">Produtos</Link><span>/</span><span>{p.name}</span></div><ProductDetail product={p}/></main>;}
