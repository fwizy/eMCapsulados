import { assetUrl } from '@/lib/router';
import Link from '@/lib/router';
import { motion, useReducedMotion } from 'motion/react';
import { Plus, ArrowUpRight } from 'lucide-react';
import { type Product, money, getCategory } from '@/lib/products';
import { useCart } from './cart-context';
export function ProductCard({product:p}:{product:Product}) {
 const {add}=useCart();const reduced=useReducedMotion();
 return <motion.article layout initial={{opacity:0,y:reduced?0:10}} animate={{opacity:1,y:0}} transition={{duration:reduced?0:.28}} className="product-card"><Link className="packshot" href={'/produtos/'+p.id} aria-label={'Conhecer '+p.name}><img src={assetUrl('/products/'+p.id+'.svg')} alt={'Embalagem demonstrativa de '+p.name} width="400" height="470" loading="lazy"/><span className="packshot-arrow"><ArrowUpRight size={18}/></span></Link><div className="product-meta"><div><p className="product-category">{getCategory(p.category)?.name}</p><Link href={'/produtos/'+p.id} className="product-name">{p.name}</Link><p className="product-price">{money(p.price)}</p></div><button className="add-circle" onClick={()=>add(p.id)} aria-label={'Adicionar '+p.name+' ao carrinho'}><Plus size={18}/></button></div></motion.article>;
}
