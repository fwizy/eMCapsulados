import { CartPage } from '@/components/store/cart-page';
export const metadata={title:'Seu carrinho'};
export default function Carrinho(){return <main id="conteudo" className="inner-page container"><div className="page-intro"><p className="eyebrow dark-eyebrow">UM NOVO RITUAL COMEÇA AQUI</p><h1>Seu <em>carrinho.</em></h1><p>Cada escolha, um pouco mais de cuidado.</p></div><CartPage/></main>;}
