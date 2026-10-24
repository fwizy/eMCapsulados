import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { getProduct } from '@/lib/products';
export type CartItem = { id:string; quantity:number };
type CartState = { items:CartItem[]; count:number; total:number; open:boolean; setOpen:(v:boolean)=>void; add:(id:string,quantity?:number)=>void; update:(id:string,quantity:number)=>void; remove:(id:string)=>void; loaded:boolean; persistent:boolean };
const CartContext=createContext<CartState|null>(null);
const KEY='emcapsulados.cart.v1';
export function CartProvider({children}:{children:ReactNode}) {
 const [items,setItems]=useState<CartItem[]>([]);const [open,setOpen]=useState(false);const [loaded,setLoaded]=useState(false);const [persistent,setPersistent]=useState(true);
 useEffect(()=>{try {const raw=JSON.parse(localStorage.getItem(KEY)||'[]'); if(Array.isArray(raw)){const clean=new Map<string,number>();raw.forEach(i=>{if(i&&typeof i.id==='string'&&getProduct(i.id)&&Number.isInteger(i.quantity)&&i.quantity>0)clean.set(i.id,Math.min(99,(clean.get(i.id)||0)+i.quantity));});setItems(Array.from(clean,([id,quantity])=>({id,quantity})));}}catch{setPersistent(false);}setLoaded(true);},[]);
 useEffect(()=>{if(loaded)try{localStorage.setItem(KEY,JSON.stringify(items));setPersistent(true);}catch{setPersistent(false);}},[items,loaded]);
 const add=useCallback((id:string,quantity=1)=>{if(!getProduct(id))return;quantity=Math.max(1,Math.min(99,Math.floor(quantity)||1));setItems(prev=>prev.some(i=>i.id===id)?prev.map(i=>i.id===id?{...i,quantity:Math.min(99,i.quantity+quantity)}:i):[...prev,{id,quantity}]);setOpen(true);},[]);
 const update=useCallback((id:string,quantity:number)=>{quantity=Math.floor(quantity);if(!Number.isFinite(quantity))return;setItems(prev=>quantity<=0?prev.filter(i=>i.id!==id):prev.map(i=>i.id===id?{...i,quantity:Math.min(99,quantity)}:i));},[]);
 const remove=useCallback((id:string)=>setItems(prev=>prev.filter(i=>i.id!==id)),[]);
 const count=items.reduce((s,i)=>s+i.quantity,0);const total=items.reduce((s,i)=>s+Math.round(getProduct(i.id)!.price*100)*i.quantity,0)/100;
 return <CartContext.Provider value={{items,count,total,open,setOpen,add,update,remove,loaded,persistent}}>{children}</CartContext.Provider>;
}
export const useCart=()=>{const c=useContext(CartContext);if(!c)throw Error('CartProvider missing');return c;};
