/* eslint-disable @next/next/no-html-link-for-pages -- Full document navigation resets the standalone particle runtime. */
'use client';
import {useState} from 'react';
import Script from 'next/script';
export default function ReferenceScripts(){
 const [threeReady,setThreeReady]=useState(false),[scrollReady,setScrollReady]=useState(false),[failed,setFailed]=useState(false);
 const sceneFailed=()=>{setFailed(true);document.body.classList.add('loaded','webgl-fallback');};
 return <>
  <Script src="/reference/enquiry.js" strategy="afterInteractive"/>
  <Script src="/reference/three.min.js" strategy="afterInteractive" onReady={()=>setThreeReady(true)} onError={sceneFailed}/>
  {threeReady&&<Script src="/reference/lenis.min.js" strategy="afterInteractive" onReady={()=>setScrollReady(true)} onError={()=>setScrollReady(true)}/>}
  {scrollReady&&<Script src="/reference/runtime.js" strategy="afterInteractive" onError={sceneFailed}/>}
  {failed&&<div className="reference-load-error" role="alert">The interactive experience could not load. <a href="/">Reload the website</a> or <a href="mailto:avexiumdigital@gmail.com">contact Avexium</a>.</div>}
 </>;
}
