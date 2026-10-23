'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {scrollProgress} from '@/lib/scroll-progress';
export default function MotionRuntime(){const path=usePathname();useEffect(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),elements=Array.from(new Set(document.querySelectorAll<HTMLElement>('[data-reveal],.intro-copy p,.service-entry,.industry-directory>a,.studio-directory>div,.case-specs>div,.article-layout section,.detail-row')));
 const reveal=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('is-visible');reveal.unobserve(e.target);}},{threshold:.12});elements.forEach(e=>{e.classList.add('reveal-ready');reveal.observe(e);});
 const scenes=Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-scene]')),media=Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-media],.case-cover,.service-scope-media,.journal-banner,.intro-preview')),parallax=Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));let frame=0;
 const update=()=>{frame=0;document.documentElement.dataset.scrolled=scrollY>100?'true':'false';if(document.documentElement.dataset.motion==='pause')return;const still=reduced.matches;
  scenes.forEach(e=>{const stage=e.querySelector<HTMLElement>(':scope > .scene-hero,:scope > .project-film-stage,:scope > .floating-stage'),p=scrollProgress(e,stage&&getComputedStyle(stage).position==='sticky'?stage:null);e.style.setProperty('--progress',still?'0':p.toFixed(4));e.style.setProperty('--title-exit',still?'0':Math.max(0,Math.min(1,(p-.08)/.35)).toFixed(4));e.style.setProperty('--screen-wipe',still?'0':Math.max(0,Math.min(1,(p-.84)/.13)).toFixed(4));});
  media.forEach(e=>{const r=e.getBoundingClientRect(),p=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height)));e.style.setProperty('--media-progress',still?'.5':p.toFixed(4));});
  parallax.forEach(e=>{const r=e.getBoundingClientRect(),shift=still?0:(r.top+r.height/2-innerHeight/2)*Number(e.dataset.parallax||.05);e.style.setProperty('--parallax',`${Math.max(-80,Math.min(80,shift))}px`);});
 };const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};const layout=new ResizeObserver(schedule);layout.observe(document.body);update();window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);window.addEventListener('avexium-motion-change',schedule);reduced.addEventListener('change',schedule);
 return()=>{reveal.disconnect();layout.disconnect();cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);window.removeEventListener('avexium-motion-change',schedule);reduced.removeEventListener('change',schedule);};},[path]);return null;}
