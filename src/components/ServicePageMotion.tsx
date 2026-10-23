'use client';

import {useEffect} from 'react';

export default function ServicePageMotion(){
 useEffect(()=>{
  const root=document.querySelector<HTMLElement>('.service-detail');
  if(!root)return;
  const sections=Array.from(root.querySelectorAll<HTMLElement>('.detail-section,.detail-related,.detail-cta'));
  const links=Array.from(root.querySelectorAll<HTMLAnchorElement>('.detail-contents a[href^="#"]'));
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});
  },{rootMargin:'0px 0px -35px 0px',threshold:0});
  sections.forEach(section=>observer.observe(section));
  root.classList.add('detail-motion-ready');
  let frame=0;
  const update=()=>{
   frame=0;
   const max=Math.max(document.documentElement.scrollHeight-innerHeight,1);
   root.style.setProperty('--detail-progress',String(Math.min(1,Math.max(0,scrollY/max))));
   let active=links[0]?.hash;
   sections.forEach(section=>{if(section.id&&section.getBoundingClientRect().top<innerHeight*.4)active='#'+section.id;});
   links.forEach(link=>{if(link.hash===active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);update();
  return ()=>{observer.disconnect();cancelAnimationFrame(frame);removeEventListener('scroll',schedule);removeEventListener('resize',schedule);root.classList.remove('detail-motion-ready');};
 },[]);
 return <div className="detail-scroll-progress" aria-hidden="true"/>;
}
