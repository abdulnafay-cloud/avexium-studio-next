'use client';
import Link from 'next/link';
import {useEffect,useRef} from 'react';
import {usePathname} from 'next/navigation';
import ScrambleText from './ScrambleText';
import {projects} from '@/data/catalog';
import BrandLogo from './BrandLogo';
const links=[['Work','/work'],['Studio','/studio'],['Services','/services'],['Journal','/journal'],['Industries','/industries'],['Contact','/contact']];
export default function Navigation(){
 const dialog=useRef<HTMLDialogElement>(null),path=usePathname();
 useEffect(()=>{dialog.current?.close();},[path]);
 const close=()=>dialog.current?.close();
 return <>
  <header className="site-nav">
   <Link href="/" className="wordmark" aria-label="Avexium Digital home"><BrandLogo/></Link>
   <nav aria-label="Primary"><div>{links.slice(0,3).map(([label,url])=><Link key={url} aria-current={path===url?'page':undefined} href={url}><ScrambleText text={label}/></Link>)}</div><div>{links.slice(3).map(([label,url])=><Link key={url} aria-current={path===url?'page':undefined} href={url}><ScrambleText text={label}/></Link>)}</div></nav>
   <button aria-label="Open menu" aria-haspopup="dialog" onClick={()=>dialog.current?.showModal()} className="menu-button"><span/><span/></button>
  </header>
  <dialog className="menu" aria-label="Avexium menu" ref={dialog}>
   <div className="menu-head"><span>NAVIGATION</span><button aria-label="Close menu" onClick={close}>×</button></div>
   <nav aria-label="Expanded navigation">{[['Home','/'],['Work','/work'],['Services','/services'],['Industries','/industries'],['Studio','/studio'],['Journal','/journal'],['Process','/process'],['Contact','/contact']].map(([label,url])=><Link key={url} href={url} aria-current={path===url?'page':undefined} onClick={close}>{label}</Link>)}</nav>
   <div className="menu-extra"><span>Independent projects</span><div>{projects.map(p=><Link key={p.slug} href={`/work/${p.slug}`} onClick={close}>{p.title} <span className="menu-category">[{p.category}]</span></Link>)}</div><span>Start a conversation</span><a href="mailto:avexiumdigital@gmail.com">avexiumdigital@gmail.com ↗</a></div>
  </dialog>
 </>;
}
