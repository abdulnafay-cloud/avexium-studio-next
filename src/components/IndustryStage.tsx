'use client';
import {useEffect,useRef,useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {industries} from '@/data/editorial';
export default function IndustryStage(){
 const [active,setActive]=useState(0),root=useRef<HTMLElement>(null),interacting=useRef(false);
 useEffect(()=>{const reduced=matchMedia('(prefers-reduced-motion: reduce)');const timer=window.setInterval(()=>{if(!reduced.matches&&!interacting.current&&document.documentElement.dataset.motion!=='pause'){const r=root.current?.getBoundingClientRect();if(r&&r.top<innerHeight&&r.bottom>0&&!document.hidden)setActive(v=>(v+1)%industries.length);}},5500);return()=>clearInterval(timer);},[]);
 const item=industries[active];
 return <section className="industry-stage" ref={root} onPointerEnter={()=>{interacting.current=true;}} onPointerLeave={()=>{interacting.current=false;}} onFocusCapture={()=>{interacting.current=true;}} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))interacting.current=false;}} aria-label="Explore focus areas"><div className="industry-stage-images" aria-hidden="true">{industries.map((i,n)=><div className={n===active?'is-active':''} key={i.slug}><Image src={i.image} alt="" fill sizes="100vw"/></div>)}</div><div className="industry-stage-top"><div className="industry-active-label"><small>0{active+1} / 06</small><Link href={`/industries/${item.slug}`}>{item.title} <span aria-hidden="true">↗</span></Link></div><nav aria-label="Choose focus area">{industries.map((i,n)=><button key={i.slug} aria-pressed={n===active} onPointerEnter={()=>setActive(n)} onFocus={()=>setActive(n)} onClick={()=>setActive(n)}>{i.title}</button>)}</nav></div><div className="industry-stage-bottom"><div><span className="section-label">FOCUS AREAS</span><h2>Every business<br/>convinces a different way.</h2></div><div><p>Orders, commerce, internal systems and digital products. The experience is shaped around what your business needs to prove—and to whom.</p><Link className="outline-link" href="/industries">Explore all focus areas <span aria-hidden="true">↗</span></Link></div></div></section>;
}
