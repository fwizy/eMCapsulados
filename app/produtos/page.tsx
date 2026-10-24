import { Suspense } from 'react';
import { Catalog } from '@/components/store/catalog';
export const metadata={title:'Produtos',description:'Explore 15 suplementos demonstrativos. Filtre por categoria, pesquise e encontre seu essencial.'};
export default function Produtos(){return <main id="conteudo" className="inner-page container"><div className="page-intro"><p className="eyebrow dark-eyebrow">ENCONTRE SEU ESSENCIAL</p><h1>Cuidado em cada <em>escolha.</em></h1><p>Vitaminas, minerais e novos rituais para a sua rotina.</p></div><Suspense fallback={<p>Preparando a coleção…</p>}><Catalog/></Suspense></main>;}
