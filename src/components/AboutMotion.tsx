'use client';

import {useEffect} from 'react';

export default function AboutMotion(){
 useEffect(()=>{
  const root=document.querySelector<HTMLElement>('.about-page');
  if(!root)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=(value:number)=>Math.max(0,Math.min(1,value));
  const ease=(value:number)=>{const p=clamp(value);return p*p*(3-2*p);};
  const absoluteTop=(element:HTMLElement)=>{let top=0,node:HTMLElement|null=element;while(node){top+=node.offsetTop;node=node.offsetParent as HTMLElement|null;}return top;};
  const reveals=Array.from(root.querySelectorAll<HTMLElement>('[data-about-reveal]'));
  const cards=Array.from(root.querySelectorAll<HTMLElement>('.about-focus-list article'));
  const chapters=Array.from(root.querySelectorAll<HTMLElement>('[data-about-chapter]'));
  const links=Array.from(root.querySelectorAll<HTMLAnchorElement>('.about-chapter-nav a'));
  const statement=root.querySelector<HTMLElement>('[data-about-words]');
  const originalStatement=statement?.innerHTML;
  if(statement){
   const walker=document.createTreeWalker(statement,NodeFilter.SHOW_TEXT),nodes:Text[]=[];
   while(walker.nextNode())nodes.push(walker.currentNode as Text);
   nodes.forEach(node=>{const fragment=document.createDocumentFragment();node.textContent?.split(/(\s+)/).forEach(word=>{if(!word)return;if(/^\s+$/.test(word)){fragment.append(document.createTextNode(word));return;}const span=document.createElement('span');span.className='about-word';span.textContent=word;fragment.append(span);});node.replaceWith(fragment);});
  }
  const words=Array.from(statement?.querySelectorAll<HTMLElement>('.about-word')||[]);
  const gallery=root.querySelector<HTMLElement>('.about-evidence');
  const track=root.querySelector<HTMLElement>('.about-project-grid');
  let frame=0,disposed=false;
  let positions=new Map<HTMLElement,number>();
  const measure=()=>{positions=new Map([...reveals,...cards,...chapters,...(statement?[statement]:[]),...(gallery?[gallery]:[])].map(element=>[element,absoluteTop(element)]));schedule();};
  const update=()=>{
   frame=0;if(disposed)return;
   const vh=innerHeight,y=scrollY,narrow=innerWidth<861;
   root.style.setProperty('--about-scroll',String(clamp(y/Math.max(document.documentElement.scrollHeight-vh,1))));
   if(reduced.matches){root.classList.remove('about-motion-ready');return;}
   reveals.forEach(element=>{const progress=ease((y+vh*.92-(positions.get(element)||0))/(vh*.62));element.style.setProperty('--reveal',progress.toFixed(4));});
   cards.forEach((card,index)=>{const top=positions.get(cards[index+1]);const stack=narrow||top===undefined?0:ease((y+155+index*22-top)/(vh*.55));card.style.setProperty('--stack',stack.toFixed(4));});
   if(statement){const progress=clamp((y+vh*.8-(positions.get(statement)||0))/(vh*.7));words.forEach((word,index)=>word.style.setProperty('--word',String(clamp(progress*(words.length+3)-index))));}
   if(gallery&&track){const range=Math.max(gallery.offsetHeight-vh,1),progress=clamp((y-(positions.get(gallery)||0))/range);track.style.setProperty('--gallery-x',narrow?'0px':`${-progress*Math.max(track.scrollWidth-track.clientWidth,0)}px`);}
   let active=chapters[0]?.id;
   chapters.forEach(chapter=>{if((positions.get(chapter)||0)<y+vh*.45)active=chapter.id;});
   links.forEach(link=>{if(link.hash==='#'+active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
   root.classList.add('about-motion-ready');
  };
  function schedule(){if(!frame)frame=requestAnimationFrame(update);}
  const focus=(event:FocusEvent)=>{if(event.target instanceof Element){
   const target=event.target.closest<HTMLElement>('[data-about-reveal]');target?.style.setProperty('--reveal','1');
   const project=event.target.closest<HTMLElement>('.about-project-grid>a');
   if(project&&gallery&&track&&!reduced.matches&&innerWidth>=861){
    const travel=Math.max(track.scrollWidth-track.clientWidth,1),progress=clamp(project.offsetLeft/travel);
    window.scrollTo({top:(positions.get(gallery)||0)+progress*Math.max(gallery.offsetHeight-innerHeight,0),behavior:'instant'});
    if(track.parentElement)track.parentElement.scrollLeft=0;
    schedule();
   }
  }};
  const observer=new ResizeObserver(measure);observer.observe(root);
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure);reduced.addEventListener('change',measure);root.addEventListener('focusin',focus);
  measure();document.fonts.ready.then(()=>{if(!disposed)measure();});
  return ()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();removeEventListener('scroll',schedule);removeEventListener('resize',measure);reduced.removeEventListener('change',measure);root.removeEventListener('focusin',focus);root.classList.remove('about-motion-ready');if(statement&&originalStatement!==undefined)statement.innerHTML=originalStatement;};
 },[]);
 return <div className="about-chapter-nav" role="navigation" aria-label="About page chapters"><a href="#studio-introduction">Studio</a><a href="#about-focus">Focus</a><a href="#about-approach">Approach</a><a href="#about-studies">Studies</a><a href="#about-delivery">Delivery</a><span aria-hidden="true"/></div>;
}
