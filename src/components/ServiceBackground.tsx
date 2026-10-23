'use client';

import {useEffect,useRef,type CSSProperties} from 'react';
import {vertexShader,fragmentShader} from '@/data/service-particle-shaders';

export default function ServiceBackground({accent}:{accent:string}){
 const canvasRef=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=canvasRef.current;
  if(!canvas)return;
  let cancelled=false,cleanup:undefined|(()=>void);
  import('three').then(THREE=>{
   if(cancelled)return;
   let renderer:InstanceType<typeof THREE.WebGLRenderer>;
   try{renderer=new THREE.WebGLRenderer({canvas,alpha:false,antialias:false});}catch{return;}
   const reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobile=innerWidth<760;
   const count=mobile?26000:62000,positions=new Float32Array(count*3),sphere=new Float32Array(count*3),helix=new Float32Array(count*3),rows=new Float32Array(count*3),random=new Float32Array(count),kind=new Float32Array(count),brightness=new Float32Array(count);
   // Same 56-row wave surface as the Services overview; deterministic positions
   // keep the brand background consistent when moving between detail pages.
   let seed=7219;
   const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
   for(let i=0;i<count;i++){
    const x=(rand()-.5)*11,y=-3.2+6.4*(i%56)/55,k=i*3;
    positions.set([x,.3,y],k);rows.set([x,y,0],k);
    const sy=1-2*(i+.5)/count,angle=i*2.399963229728653,radius=Math.sqrt(1-sy*sy),theta=i/count*Math.PI*22;
    sphere.set([2.15*radius*Math.cos(angle),2.15*sy,2.15*radius*Math.sin(angle)],k);
    helix.set([1.5*Math.cos(theta),sy*3,1.5*Math.sin(theta)],k);
    random[i]=rand();kind[i]=0;
    const q=rand();brightness[i]=q<.34?.8:q<.46?1.6:q<.58?1.4:q<.88?.4+1.8*Math.pow(1-Math.pow(rand(),2.2),2):.5+rand()*.5;
   }
   const geometry=new THREE.BufferGeometry();
   geometry.setAttribute('position',new THREE.BufferAttribute(sphere,3));
   for(let i=1;i<6;i++)geometry.setAttribute('p'+i,new THREE.BufferAttribute(positions,3));
   geometry.setAttribute('p1',new THREE.BufferAttribute(helix,3));
   geometry.setAttribute('p6',new THREE.BufferAttribute(rows,3));
   geometry.setAttribute('aR',new THREE.BufferAttribute(random,1));
   geometry.setAttribute('aK',new THREE.BufferAttribute(kind,1));
   geometry.setAttribute('aB',new THREE.BufferAttribute(brightness,1));
   const color=new THREE.Color(accent),light=color.clone().lerp(new THREE.Color('white'),.5);
   // Match the reference's direct RGB service palette, rather than applying an
   // additional colour-space conversion to its supplied service swatches.
   const rgb=accent.replace('#',''),r=parseInt(rgb.slice(0,2),16)/255,g=parseInt(rgb.slice(2,4),16)/255,b=parseInt(rgb.slice(4,6),16)/255;
   color.setRGB(r,g,b);light.setRGB(r+(1-r)*.5,g+(1-g)*.5,b+(1-b)*.5);
   const uniforms={uS:{value:1},uM:{value:2},uT:{value:0},uI:{value:1},uPR:{value:1},uAsp:{value:1},uMouse:{value:new THREE.Vector2(9,9)},uPulse:{value:0},uCalm:{value:0},uVel:{value:0},uC1:{value:new THREE.Vector3(color.r,color.g,color.b)},uC2:{value:new THREE.Vector3(light.r,light.g,light.b)}};
   const material=new THREE.ShaderMaterial({uniforms,vertexShader,fragmentShader,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
   const points=new THREE.Points(geometry,material),scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,1,.1,50);
   points.frustumCulled=false;points.rotation.set(.5,-.32,0);scene.add(points);camera.position.z=7;
   renderer.setClearColor(0x06070a,1);
   renderer.autoClear=false;
   const trailScene=new THREE.Scene(),trailGeometry=new THREE.PlaneGeometry(2,2),trailMaterial=new THREE.ShaderMaterial({uniforms:{fade:{value:.24}},transparent:true,depthTest:false,depthWrite:false,vertexShader:'void main(){gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:'uniform float fade;void main(){gl_FragColor=vec4(.0235,.0275,.0392,fade);}'});
   const trail=new THREE.Mesh(trailGeometry,trailMaterial);trail.frustumCulled=false;trailScene.add(trail);
   let frame=0,last=0,previousScroll=scrollY,velocity=0,mouseX=0,mouseY=0,targetX=0,targetY=0;
   const draw=(now:number)=>{
    frame=0;
    if(cancelled||document.hidden)return;
    const dt=Math.min((now-last)/1000,.05);
    if(!reduced.matches&&now-last<1000/(mobile?30:45)){frame=requestAnimationFrame(draw);return;}
    last=now;
    const max=Math.max(document.documentElement.scrollHeight-innerHeight,1),progress=reduced.matches?0:Math.min(Math.max(scrollY/max,0),1);
    velocity+=(Math.max(-1.2,Math.min(1.2,(scrollY-previousScroll)*.012))-velocity)*.12;previousScroll=scrollY;
    if(!reduced.matches)uniforms.uT.value+=dt;
    uniforms.uVel.value=reduced.matches?0:velocity;
    const narrow=innerWidth<860,eased=progress*progress*(3-2*progress),heroProgress=reduced.matches?0:Math.min(scrollY/Math.max(innerHeight*.85,1),1);
    uniforms.uS.value=heroProgress;uniforms.uM.value=heroProgress*.8;
    mouseX+=(targetX-mouseX)*.06;mouseY+=(targetY-mouseY)*.06;
    points.rotation.y=-.32+mouseX*.12+eased*.3+(1-heroProgress)*uniforms.uT.value*.06;points.rotation.x=.5*heroProgress+mouseY*.06-eased*.12;
    points.scale.setScalar(.75*(narrow?.62:1)*(1+eased*.25)*1.3);
    points.position.y=narrow?.9:0;points.position.x=narrow?0:(1-heroProgress)*1.9;
    trailMaterial.uniforms.fade.value=Math.max(.1,Math.min(.3,.24-Math.abs(velocity)*.08));
    // The overview accumulates particles over a translucent fade quad. Preserve
    // that same luminous depth instead of clearing the wave on every frame.
    for(let pass=0;pass<(reduced.matches?4:1);pass++){renderer.render(trailScene,camera);renderer.render(scene,camera);}
    if(!reduced.matches)frame=requestAnimationFrame(draw);
   };
   const schedule=()=>{if(!frame&&!document.hidden)frame=requestAnimationFrame(draw);};
   const resize=()=>{
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight,false);renderer.clear();
    camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();uniforms.uAsp.value=camera.aspect;uniforms.uPR.value=renderer.getPixelRatio();schedule();
   };
   const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else{last=performance.now();schedule();}};
   const pointer=(event:PointerEvent)=>{targetX=event.clientX/innerWidth*2-1;targetY=event.clientY/innerHeight*2-1;uniforms.uMouse.value.set(targetX,-targetY);};
   const leave=()=>{targetX=0;targetY=0;uniforms.uMouse.value.set(9,9);};
   const motion=()=>{cancelAnimationFrame(frame);frame=0;schedule();};
   addEventListener('resize',resize);addEventListener('scroll',schedule,{passive:true});addEventListener('pointermove',pointer,{passive:true});document.addEventListener('pointerleave',leave);document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',motion);
   resize();
   cleanup=()=>{cancelAnimationFrame(frame);removeEventListener('resize',resize);removeEventListener('scroll',schedule);removeEventListener('pointermove',pointer);document.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',motion);geometry.dispose();material.dispose();trailGeometry.dispose();trailMaterial.dispose();renderer.dispose();};
  }).catch(()=>{/* The CSS aurora remains visible when WebGL cannot load. */});
  return ()=>{cancelled=true;cleanup?.();};
 },[accent]);
 const rgb=[1,3,5].map(offset=>parseInt(accent.slice(offset,offset+2),16)).join(',');
 return <div className="detail-background" aria-hidden="true" style={{'--ac':rgb} as CSSProperties}><canvas ref={canvasRef}/><div className="detail-aurora aur"><i className="b b1"/><i className="b b2"/><i className="b b3"/></div><div className="detail-vignette"/></div>;
}
