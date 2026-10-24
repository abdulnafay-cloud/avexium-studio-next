/* eslint-disable @next/next/no-html-link-for-pages -- Full navigation resets the standalone home animation runtime. */
import type {CSSProperties} from 'react';
import type {Metadata} from 'next';
import {pageMetadata} from '@/lib/site-metadata';
import {notFound} from 'next/navigation';
import servicePages from '@/data/service-pages.json';
import {serviceVisuals} from '@/data/service-visuals';
import ServiceBackground from '@/components/ServiceBackground';
import ServicePageMotion from '@/components/ServicePageMotion';
import ServiceShowcase from '@/components/ServiceShowcase';
import '../service-pages.css';

export const dynamicParams=false;
export function generateStaticParams(){return servicePages.map(({slug})=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params,service=servicePages.find(item=>item.slug===slug);
 if(!service)return {title:'Service not found — Avexium Digital'};
 const description=service.summary;
 return pageMetadata('/services/'+slug,service.title,description);
}
const sections=[['overview','The right fit'],['implementation','What we do'],['technology','Technology'],['handover','What you receive'],['process','How we work'],['questions','Questions']] as const;
export default async function ServiceDetail({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params,index=servicePages.findIndex(item=>item.slug===slug),service=servicePages[index];
 if(!service)notFound();
 const enquiry=`/start?service=${encodeURIComponent(service.slug)}`,references='references' in service?service.references:undefined;
 return <div className="service-detail" style={{'--detail-accent':service.color} as CSSProperties}>
  <ServiceBackground accent={service.color}/>
  <ServicePageMotion/>
  <a className="detail-skip" href="#service-content">Skip to service details</a>
  <header className="detail-header"><a className="detail-brand" href="/">AVEXIUM</a><div className="detail-header-links" role="navigation" aria-label="Main navigation"><a href="/services" aria-current="page">Services</a><a href="/work">Work</a><a href="/about">About</a><a href="/process">Process</a><a href="/careers">Careers</a></div><a href={enquiry} className="detail-button detail-header-cta">Start a project <span aria-hidden="true">↗</span></a><details className="detail-mobile-menu"><summary>Menu</summary><div><a href="/">Home</a><a href="/services">Services</a><a href="/work">Work</a><a href="/about">About</a><a href="/process">Process</a><a href="/careers">Careers</a><a href={enquiry}>Start a project</a></div></details></header>
  <main id="service-content" tabIndex={-1}>
   <section className="detail-hero detail-container">
    <div className="detail-breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/services">Services</a><span aria-hidden="true">/</span><span>{service.title}</span></div>
    <div className="detail-hero-grid"><div><p className="detail-eyebrow"><span aria-hidden="true"/>{service.focus}</p><h1>{service.title}</h1><p className="detail-lead">{service.summary}</p><div className="detail-actions"><a className="detail-button" href={enquiry}>Discuss this service <span aria-hidden="true">↗</span></a><a className="detail-text-link" href="#implementation">Explore the details <span aria-hidden="true">↓</span></a></div></div>
     <ServiceShowcase title={service.title} slug={service.slug} visual={serviceVisuals[service.slug]} labels={service.technology.map(item=>item.name)}/>
    </div>
   </section>
   <div className="detail-container detail-body-grid">
    <aside className="detail-contents"><p>IN THIS SERVICE</p><div role="navigation" aria-label="On this page">{sections.map(([id,label])=><a key={id} href={`#${id}`}>{label}<span aria-hidden="true">↗</span></a>)}</div><a className="detail-text-link" href="/services">← All services</a></aside>
    <div className="detail-sections">
     <section id="overview" className="detail-section"><p className="detail-eyebrow">Use cases</p><h2>Where this service fits.</h2><ul className="detail-fit-list">{service.useCases.map(text=><li key={text}>{text}</li>)}</ul></section>
     <section id="implementation" className="detail-section"><p className="detail-eyebrow">Service scope</p><h2>Scope of work.</h2><p className="detail-section-intro">Your project scope defines the workstreams, deliverables, dependencies and acceptance criteria. The areas below explain how this service is organised.</p><div>{service.work.map((item,i)=><article className="detail-work" key={item.title}><span className="detail-work-number">{String(i+1).padStart(2,'0')}</span><div><h3>{item.title}</h3><p>{item.detail}</p><div className="detail-check"><span>Acceptance checks</span><p>{item.check}</p></div></div></article>)}</div></section>
     <section id="technology" className="detail-section"><p className="detail-eyebrow">Implementation approach</p><h2>Technology and implementation.</h2><p className="detail-section-intro">Technology is selected around your requirements, existing systems and operating responsibilities. The options below explain where each approach is useful.</p><div className="detail-technology">{service.technology.map(item=><article key={item.name}><h3>{item.name}</h3><p>{item.detail}</p></article>)}</div>{references&&<div className="detail-references"><span>Technical references</span>{references.map(([label,url])=><a key={url} href={url} target="_blank" rel="noopener noreferrer">{label} ↗</a>)}</div>}</section>
     <section id="handover" className="detail-section"><p className="detail-eyebrow">Project outputs</p><h2>Deliverables and handover.</h2><ul className="detail-deliverables">{service.deliverables.map(text=><li key={text}><span aria-hidden="true">↗</span>{text}</li>)}</ul><div className="detail-inputs"><h3>What we need from you.</h3><p>Clear inputs and available reviewers help the work move forward.</p><ul>{service.inputs.map(text=><li key={text}>{text}</li>)}</ul></div></section>
     <section id="process" className="detail-section"><p className="detail-eyebrow">Delivery stages</p><h2>Delivery process.</h2><ol className="detail-process">{service.process.map(([title,text],i)=><li key={title}><span>{String(i+1).padStart(2,'0')}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol></section>
     <section id="questions" className="detail-section"><p className="detail-eyebrow">Service questions</p><h2>Common questions.</h2><div className="detail-faq">{service.faq.map(([question,answer])=><details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>
    </div>
   </div>
   <section className="detail-container detail-related"><p className="detail-eyebrow">Connected capabilities</p><h2>Related services.</h2><div>{service.related.map(relatedSlug=>{const item=servicePages.find(s=>s.slug===relatedSlug);return item?<a key={item.slug} href={`/services/${item.slug}`}><span>{item.focus}</span><h3>{item.title}</h3><span aria-hidden="true">↗</span></a>:null;})}</div></section>
   <section className="detail-container detail-cta"><p className="detail-eyebrow">Start with the problem</p><h2>Discuss your requirements.</h2><p>Share what you are building, what exists today and the outcome you need. We will use that context to define a practical scope.</p><a className="detail-button" href={enquiry}>Discuss {service.title.toLowerCase()} <span aria-hidden="true">↗</span></a></section>
  </main>
  <footer className="detail-footer detail-container"><a className="detail-brand" href="/">AVEXIUM DIGITAL</a><div><a href="/services">All services</a><a href="/privacy">Privacy</a><a href="/site-information">Site information</a><a href="mailto:avexiumdigital@gmail.com">Email the studio ↗</a></div></footer>
 </div>;
}
