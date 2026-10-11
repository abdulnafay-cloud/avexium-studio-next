'use client';
import {useRef,useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {services,projects} from '@/data/catalog';
import {serviceSpecifications} from '@/data/service-specifications';
export const serviceProject:Record<string,number>={'digital-marketing':1,'seo-content':1,'brand-design':2,'ui-ux-design':0,'web-development':2,'mobile-development':0,ecommerce:1,'automation-ai':0,'cloud-devops':0,'3d-motion':2};
export default function ServiceExplorer(){
 const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLButtonElement|null>(null);const [selected,setSelected]=useState(0);const [slug,title]=services[selected],spec=serviceSpecifications[slug],project=projects[serviceProject[slug]];
 const select=(i:number)=>{setSelected((i+services.length)%services.length);if(dialog.current){dialog.current.scrollTop=0;if(!dialog.current.open)dialog.current.showModal();}};
 return <><div className="list-heading"><span>SERVICES / 10</span><span>SELECT A SERVICE TO OPEN THE DETAILS</span></div><div className="service-index">{services.map(([key,name],i)=><button key={key} className="service-entry" onClick={e=>{trigger.current=e.currentTarget;select(i);}} aria-haspopup="dialog"><small>{String(i+1).padStart(2,'0')}</small><span className="service-entry-title">{name}</span><span className="service-entry-summary">{serviceSpecifications[key].summary}</span><span aria-hidden="true">↗</span></button>)}</div>
 <dialog ref={dialog} className="service-drawer" aria-labelledby="service-title" onClose={()=>trigger.current?.focus()} onClick={e=>{if(e.target===dialog.current){const r=dialog.current.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right)dialog.current.close();}}}>
 <button className="drawer-close" autoFocus aria-label="Close service details" onClick={()=>dialog.current?.close()}>×</button>
 <div className="drawer-media"><Image src={project.image} alt={`${project.title} — illustrative independent project, not a client result`} fill sizes="(max-width:750px) 100vw, 58vw"/><span>INDEPENDENT EXPLORATION / {project.title.toUpperCase()}</span></div>
 <div className="drawer-content"><span className="section-label">{String(selected+1).padStart(2,'0')} / 10</span><h2 id="service-title">{title}</h2><p className="lead">{spec.summary}</p><div className="drawer-approach"><div><h3>OUR APPROACH</h3><p>{spec.setup}</p></div><div><h3>WHAT YOU RECEIVE</h3><ul>{spec.handover.map(([name])=><li key={name}>{name}</li>)}</ul></div></div><h3>IMPLEMENTATION</h3>{spec.work.map(([name,implementation])=><article key={name}><h4>{name}</h4><p>{implementation}</p></article>)}<Link className="outline-link" href={`/services/${slug}`} onClick={()=>dialog.current?.close()}>Full technical scope ↗</Link><Link className="outline-link dark-button" href="/contact" onClick={()=>dialog.current?.close()}>Discuss this service ↗</Link></div>
 <nav className="drawer-pagination" aria-label="Previous or next service"><button onClick={()=>select(selected-1)}><small>← PREVIOUS</small><span>{services[(selected-1+services.length)%services.length][1]}</span></button><button onClick={()=>select(selected+1)}><small>NEXT →</small><span>{services[(selected+1)%services.length][1]}</span></button></nav></dialog></>;
}
