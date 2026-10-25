/* eslint-disable @next/next/no-html-link-for-pages -- Full navigation resets the standalone particle runtime. */
import type {CSSProperties} from 'react';
import type {Metadata} from 'next';
import {pageMetadata} from '@/lib/site-metadata';
import {notFound} from 'next/navigation';
import roles from '@/data/career-roles.json';
import CareerApplicationForm from '@/components/CareerApplicationForm';
import ServiceBackground from '@/components/ServiceBackground';
import ServicePageMotion from '@/components/ServicePageMotion';
import '../../services/service-pages.css';
import '../careers.css';

export const dynamicParams=false;
export function generateStaticParams(){return roles.map(({slug})=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params,role=roles.find(item=>item.slug===slug);
 return role?pageMetadata('/careers/'+slug,role.title+' — Careers',role.intro):{title:'Role not found'};
}
export default async function CareerRole({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params,role=roles.find(item=>item.slug===slug);if(!role)notFound();
 const application='#apply';
 return <div className="service-detail career-detail" style={{'--detail-accent':role.color} as CSSProperties}><ServiceBackground accent={role.color}/><ServicePageMotion/>
  <a className="detail-skip" href="#role-content">Skip to role details</a>
  <header className="detail-header"><a className="detail-brand" href="/">AVEXIUM</a><div className="career-detail-nav" role="navigation" aria-label="Main navigation"><a href="/careers">All opportunities ↗</a><a href="/services">Services</a></div></header>
  <main id="role-content"><section className="detail-container career-role-hero"><a className="detail-text-link" href="/careers">← Careers & collaboration</a><p className="detail-eyebrow">{role.discipline}</p><h1>{role.title}</h1><p className="career-role-lead">{role.intro}</p><div className="career-role-meta"><span>Portfolio enquiries</span><span>Project collaboration</span></div><a className="detail-button" href={application}>Apply for this role <span aria-hidden="true">↗</span></a><p className="career-listing-note">This is a portfolio call for future project collaborations, rather than a confirmed vacancy. If a suitable project becomes available, we’ll discuss the responsibilities, availability and engagement terms with you.</p></section>
   <div className="detail-container career-role-body"><aside><p className="detail-eyebrow">The work</p>{role.work.map(item=><p key={item}>{item}</p>)}<a className="detail-text-link" href={application}>Share your portfolio ↗</a></aside><div>
    <section className="detail-section"><p className="detail-eyebrow">Your contribution</p><h2>What you could work on.</h2><ul className="career-detail-list">{role.responsibilities.map(item=><li key={item}>{item}</li>)}</ul></section>
    <section className="detail-section"><p className="detail-eyebrow">Skills & approach</p><h2>Skills we look for.</h2><ul className="career-detail-list">{role.skills.map(item=><li key={item}>{item}</li>)}</ul></section>
    <section className="detail-section"><p className="detail-eyebrow">Portfolio guidance</p><h2>What to include in your portfolio.</h2><p>{role.portfolio}</p><p className="career-portfolio-note">Only share work you have permission to disclose. Links and a short explanation of your contribution are enough for an introduction.</p></section>
    <section className="detail-section"><p className="detail-eyebrow">The next step</p><h2>How introductions are reviewed.</h2><ol className="career-application-steps"><li><strong>Share your work.</strong><p>Submit your portfolio, skills and availability using the form below.</p></li><li><strong>Discuss the fit.</strong><p>If a relevant collaboration is available, we can discuss the work, responsibilities and your approach.</p></li><li><strong>Agree the engagement.</strong><p>Scope, timing, commercial terms and ownership are agreed before any project work begins.</p></li></ol></section>
    <CareerApplicationForm slug={role.slug} title={role.title}/>
   </div></div>
   <section className="detail-container detail-related"><p className="detail-eyebrow">Other disciplines</p><h2>Other collaboration profiles.</h2><div>{roles.filter(item=>item.slug!==slug).map(item=><a key={item.slug} href={`/careers/${item.slug}`}><span>{item.discipline}</span><h3>{item.title}</h3><span aria-hidden="true">↗</span></a>)}</div></section>
  </main><footer className="detail-container detail-footer"><a className="detail-brand" href="/">AVEXIUM</a><a href="/careers">Back to careers ↗</a><a href="/privacy">Privacy</a></footer>
 </div>;
}
