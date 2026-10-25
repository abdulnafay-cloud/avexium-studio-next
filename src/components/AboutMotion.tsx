'use client';
import {useEffect} from 'react';

export default function AboutMotion(){
 useEffect(()=>{
  const root=document.querySelector<HTMLElement>('.about-page');if(!root)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=(v:number)=>Math.max(0,Math.min(1,v));
  const reveals=Array.from(root.querySelectorAll<HTMLElement>('[data-about-reveal]'));
  const images=Array.from(root.querySelectorAll<HTMLElement>('[data-about-image]'));
  const band=root.querySelector<HTMLElement>('[data-about-marquee]');
  const statement=root.querySelector<HTMLElement>('[data-about-words]');
  const original=statement?.innerHTML;
  if(statement){const walker=document.createTreeWalker(statement,NodeFilter.SHOW_TEXT),nodes:Text[]=[];while(walker.nextNode())nodes.push(walker.currentNode as Text);for(const node of nodes){const fragment=document.createDocumentFragment();for(const word of node.textContent?.split(/(\s+)/)||[]){if(!word)continue;if(/^\s+$/.test(word))fragment.append(word);else{const span=document.createElement('span');span.className='av-word';span.textContent=word;fragment.append(span);}}node.replaceWith(fragment);}}
  const words=Array.from(statement?.querySelectorAll<HTMLElement>('.av-word')||[]);
  let frame=0,disposed=false;
  const update=()=>{frame=0;if(disposed)return;const vh=innerHeight;root.style.setProperty('--about-scroll',String(clamp(scrollY/Math.max(document.documentElement.scrollHeight-vh,1))));
   if(reduced.matches){root.classList.remove('av-about-ready');return;}
   for(const element of reveals){const p=clamp((vh*.94-element.getBoundingClientRect().top)/(vh*.58));element.style.setProperty('--reveal',String(p*p*(3-2*p)));}
   if(statement){const p=clamp((vh*.85-statement.getBoundingClientRect().top)/(vh*.65));words.forEach((word,i)=>word.style.setProperty('--word',String(clamp(p*(words.length+2)-i))));}
   if(band){const rect=band.parentElement!.getBoundingClientRect();band.style.setProperty('--band-x',`${-100-clamp((vh-rect.top)/(vh+rect.height))*300}px`);}
   for(const image of images){const rect=image.getBoundingClientRect(),p=clamp((vh-rect.top)/(vh+rect.height));image.style.setProperty('--image-y',`${-50+p*50}px`);}
   root.classList.add('av-about-ready');
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  const observer=new ResizeObserver(schedule);observer.observe(root);
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduced.addEventListener('change',schedule);schedule();
  return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();removeEventListener('scroll',schedule);removeEventListener('resize',schedule);reduced.removeEventListener('change',schedule);root.classList.remove('av-about-ready');if(statement&&original!==undefined)statement.innerHTML=original;};
 },[]);
 return <div className="av-scroll-progress" aria-hidden="true"/>;
}
