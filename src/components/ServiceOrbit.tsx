'use client';
import {useEffect,useRef} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ScrambleText from './ScrambleText';
import {scrollProgress} from '@/lib/scroll-progress';
const cards=[
 {title:'UI/UX & product design',copy:'Complete journeys. Responsive interfaces. Every state considered.',href:'/services/ui-ux-design'},
 {image:'/projects/seluvrane.webp',alt:'Independent skincare storefront exploration',href:'/work/seluvrane'},
 {title:'Web development',copy:'Content models, interfaces and integrations—with a practical release plan.',href:'/services/web-development'},
 {image:'/projects/drapeviqa.png',alt:'Independent fashion storefront exploration',href:'/work/drapeviqa'},
 {title:'3D & motion',copy:'Real-time scenes that make an experience distinctive, without obscuring the task.',href:'/services/3d-motion'},
 {image:'/projects/tablevori.png',alt:'Independent restaurant operations exploration',href:'/work/tablevori'},
 {title:'Brand & creative',copy:'Positioning and identity translated into a usable design system.',href:'/services/brand-design'},
 {title:'Automation & applied AI',copy:'Connected workflows. Evaluated outputs. Clear human review.',href:'/services/automation-ai'},
];
export default function ServiceOrbit(){
 const root=useRef<HTMLElement>(null);
 useEffect(()=>{
  const section=root.current;if(!section)return;
  const items=Array.from(section.querySelectorAll<HTMLElement>('.orbit-card')),reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0;
  const stage=section.querySelector<HTMLElement>('.orbit-stage');if(!stage)return;
  const paint=()=>{frame=0;if(reduced.matches||document.documentElement.dataset.motion==='pause')return;const p=scrollProgress(section,stage),width=stage.clientWidth,height=stage.clientHeight,mobile=width<=750;section.dataset.phase=p.toFixed(2);items.forEach((el,i)=>{const angle=i*Math.PI*2/items.length+p*Math.PI*2.15-1.2,depth=(Math.sin(angle)+1)/2,scale=.3+depth*.68,radiusX=Math.max(0,Math.min(width*(mobile?.43:.34),width/2-el.offsetWidth*.54-16)),radiusY=Math.max(0,Math.min(height*.34,height/2-el.offsetHeight*.54-32)),x=Math.cos(angle)*radiusX,y=Math.sin(angle)*radiusY;el.style.transform=`translate(-50%,-50%) translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${scale.toFixed(3)}) rotate(${(Math.cos(angle)*4).toFixed(2)}deg)`;el.style.opacity=(.12+depth*.88).toFixed(3);el.style.zIndex=depth>.72?'4':'1';});};
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(paint);};const layout=new ResizeObserver(schedule);layout.observe(document.body);layout.observe(stage);paint();window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);window.addEventListener('avexium-motion-change',schedule);reduced.addEventListener('change',schedule);
  return()=>{layout.disconnect();cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);window.removeEventListener('avexium-motion-change',schedule);reduced.removeEventListener('change',schedule);};
 },[]);
 return <section className="service-orbit" ref={root} aria-label="Our services"><div className="orbit-stage"><div className="orbit-title"><h2><ScrambleText text="Our services."/></h2><Link className="outline-link" href="/services">Discover all services <span aria-hidden="true">↗</span></Link></div><div className="orbit-items">{cards.map((card,i)=><Link className={`orbit-card ${'image' in card?'orbit-image':'orbit-note'}`} href={card.href} key={card.href} style={{'--card-index':i} as React.CSSProperties}>{'image' in card?<Image src={card.image!} alt={card.alt!} fill sizes="(max-width:750px) 45vw, 20vw"/>:<><small>0{i+1}</small><h3>{card.title}</h3><p>{card.copy}</p></>}</Link>)}</div></div></section>;
}
