import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { Link as RouterLink, useLocation, useSearchParams as useRouterSearchParams } from 'react-router-dom';
export const Link = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement> & {href:string}>(function Link({href,...props},ref){const [path,section]=href.split('#');const target=section?path+(path.includes('?')?'&':'?')+'secao='+encodeURIComponent(section):href;return <RouterLink ref={ref} to={target} {...props}/>;});
export default Link;
export const usePathname=()=>useLocation().pathname;
export const useSearchParams=()=>useRouterSearchParams()[0];
export const assetUrl=(path:string)=>import.meta.env.BASE_URL+path.replace(/^\//,'');
