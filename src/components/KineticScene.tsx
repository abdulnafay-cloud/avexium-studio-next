'use client';
import {useEffect,useRef} from 'react';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';

// Original Avexium artwork. All geometry, screen choreography and atmosphere live here.
export default function KineticScene({variant='assistant'}:{variant?:'assistant'|'identity'|'atmosphere'}){
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const el=host.current;if(!el)return;let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;el.appendChild(renderer.domElement);el.dataset.ready='true';
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.08,60);
  const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;room.dispose();pmrem.dispose();
  scene.add(new THREE.AmbientLight('#8d99a5',.32));
  for(const [color,intensity,x,y,z] of [['#e4e6e9',28,-5,5,4],['#ff240e',110,4,2,2],['#ef1706',90,-3,-2,-3],['#b9c6d5',16,-1,5,-2]] as const){const light=new THREE.PointLight(color,intensity);light.position.set(x,y,z);scene.add(light);}
  const black=new THREE.MeshPhysicalMaterial({color:'#080a0c',metalness:.75,roughness:.32,clearcoat:.35}),red=new THREE.MeshPhysicalMaterial({color:'#6b0905',metalness:.88,roughness:.24,clearcoat:.55}),silver=new THREE.MeshPhysicalMaterial({color:'#686b71',metalness:1,roughness:.28,clearcoat:.3}),glass=new THREE.MeshPhysicalMaterial({color:'#020409',metalness:.25,roughness:.12,clearcoat:1}),darkMetal=new THREE.MeshStandardMaterial({color:'#131416',metalness:.9,roughness:.48});
  const model=new THREE.Group(),head=new THREE.Group(),rotor=new THREE.Group(),identities:THREE.Group[]=[];scene.add(model);
  const box=(w:number,h:number,d:number,material:THREE.Material,x:number,y:number,z:number,parent=model)=>{const mesh=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,4,Math.min(.12,w*.18,h*.18,d*.18)),material);mesh.position.set(x,y,z);parent.add(mesh);return mesh;};
  let display:THREE.CanvasTexture|undefined,drawScreen:((time:number,progress:number)=>void)|undefined;
  if(variant==='assistant'){
   // A machined enclosure, not a stack of floating primitives.
   box(2.62,2.35,1.95,black,0,-.9,-.25);box(2.7,.15,2.04,red,0,.33,-.25);box(2.63,.09,1.96,darkMetal,0,-2.08,-.25);
   box(.035,2.02,1.69,darkMetal,-1.323,-.88,-.27);box(.035,2.02,1.69,darkMetal,1.323,-.88,-.27);
   box(.055,1.88,1.76,red,-1.338,-.82,-.25);box(.055,1.88,1.76,red,1.338,-.82,-.25);
   box(2.28,1.48,.035,darkMetal,0,-.44,.744);
   const neck=new THREE.Mesh(new THREE.CylinderGeometry(.25,.41,.34,48),silver);neck.position.set(0,.56,-.25);model.add(neck);
   const foot=new THREE.Mesh(new THREE.CylinderGeometry(.52,.57,.12,64),red);foot.position.set(0,.4,-.25);model.add(foot);
   head.position.set(0,1.45,-.2);model.add(head);
   const housing=(w:number,h:number,depth:number,material:THREE.Material,z:number)=>{const shape=new THREE.Shape();shape.moveTo(-w*.43,h*.47);shape.lineTo(w*.38,h*.47);shape.lineTo(w*.49,h*.26);shape.lineTo(w*.46,-h*.33);shape.quadraticCurveTo(w*.42,-h*.48,w*.33,-h*.48);shape.lineTo(-w*.36,-h*.48);shape.quadraticCurveTo(-w*.49,-h*.4,-w*.49,-h*.24);shape.lineTo(-w*.49,h*.25);shape.closePath();const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:.035,bevelThickness:.035,bevelSegments:4,steps:1}),material);mesh.position.z=z;head.add(mesh);};
   housing(3.02,1.88,1.5,silver,-1.04);housing(3.06,1.92,.07,red,.49);housing(2.9,1.76,.055,black,.56);housing(2.71,1.58,.025,glass,.62);
   box(2.8,.06,1.37,red,0,.89,-.24,head);box(.035,.91,1.11,black,-1.48,-.01,-.24,head);box(.035,.91,1.11,black,1.48,-.01,-.24,head);
   for(let i=0;i<12;i++){box(.055,.022,.52,black,-1.11+i*.2,.93,-.22,head);box(.018,.52,.065,black,-1.502,-.03,-.78+i*.095,head);box(.018,.52,.065,black,1.502,-.03,-.78+i*.095,head);}
   const displayCanvas=document.createElement('canvas');displayCanvas.width=1024;displayCanvas.height=640;const ctx=displayCanvas.getContext('2d');
   if(ctx){display=new THREE.CanvasTexture(displayCanvas);display.colorSpace=THREE.SRGBColorSpace;display.minFilter=THREE.LinearFilter;
    const screenOutline=new THREE.Shape();screenOutline.moveTo(-1.07,.6);screenOutline.lineTo(.95,.6);screenOutline.lineTo(1.205,.37);screenOutline.lineTo(1.13,-.45);screenOutline.quadraticCurveTo(1.07,-.63,.9,-.63);screenOutline.lineTo(-.9,-.63);screenOutline.quadraticCurveTo(-1.2,-.55,-1.2,-.33);screenOutline.lineTo(-1.2,.34);screenOutline.closePath();
    const screenGeometry=new THREE.ShapeGeometry(screenOutline,20),screenPositions=screenGeometry.attributes.position,screenUvs=new Float32Array(screenPositions.count*2);for(let i=0;i<screenPositions.count;i++){screenUvs[i*2]=(screenPositions.getX(i)+1.225)/2.45;screenUvs[i*2+1]=(screenPositions.getY(i)+.655)/1.31;}screenGeometry.setAttribute('uv',new THREE.BufferAttribute(screenUvs,2));
    const screen=new THREE.Mesh(screenGeometry,new THREE.MeshBasicMaterial({map:display,toneMapped:false}));screen.position.set(0,-.025,.714);head.add(screen);let lastTick=-1;
    drawScreen=(time,progress)=>{const tick=Math.floor(time*12)+Math.floor(progress*120)*1000;if(tick===lastTick)return;lastTick=tick;const white=THREE.MathUtils.smoothstep(progress,.42,.72);ctx.fillStyle=`rgb(${Math.round(4+white*241)},${Math.round(6+white*239)},${Math.round(8+white*236)})`;ctx.fillRect(0,0,1024,640);ctx.textAlign='left';ctx.fillStyle=white>.5?'#303030':'#b5bec7';ctx.font='19px monospace';ctx.fillText('AVEXIUM / DIGITAL STUDIO',65,66);ctx.fillStyle='#db3320';ctx.fillRect(65,88,55,3);
     if(white<.5){const cycle=time%18,lines=cycle<6?['Hello. We are Avexium.','What can we make better?']:cycle<12?['01  Identity & product design','02  Websites & digital systems','03  Real-time 3D & motion','04  Connected operations']:['Understand the task.','Design the complete journey.','Build. Review. Improve.'];const available=Math.floor((cycle%6)*26);let offset=0;ctx.fillStyle='#e3e8eb';ctx.font='23px monospace';lines.forEach((line,i)=>{const length=Math.max(0,available-offset);ctx.fillText(line.slice(0,length),65,185+i*47);offset+=line.length;});ctx.fillStyle='#717b86';ctx.font='16px monospace';ctx.fillText('DESIGN + ENGINEERING',65,573);ctx.textAlign='right';ctx.fillStyle='#e33725';ctx.fillText('SYSTEM READY',960,573);ctx.textAlign='left';}
     else{ctx.font='48px Arial';ctx.fillStyle='#121212';ctx.fillText('A clear idea.',65,230);ctx.fillText('A connected experience.',65,290);ctx.font='21px Arial';ctx.fillStyle='#686868';ctx.fillText('Independent design, engineering and original work.',65,380);ctx.strokeStyle='#c9c9c6';ctx.beginPath();ctx.moveTo(65,470);ctx.lineTo(959,470);ctx.stroke();ctx.font='22px Arial';ctx.fillStyle='#171717';['Tablevori','Seluvrane','Drapeviqa'].forEach((name,i)=>ctx.fillText(name,65+i*310,535));}
     // Fine screen scan lines, not a flickering overlay across the page.
     ctx.fillStyle=white>.5?'rgba(0,0,0,.018)':'rgba(255,255,255,.022)';for(let y=0;y<640;y+=4)ctx.fillRect(0,y,1024,1);display!.needsUpdate=true;};drawScreen(1,0);
   }
   const well=new THREE.Mesh(new THREE.CylinderGeometry(.73,.73,.05,64),glass);well.rotation.x=Math.PI/2;well.position.set(0,-.45,.78);model.add(well);
   const ring=new THREE.Mesh(new THREE.TorusGeometry(.72,.027,12,80),silver);ring.position.set(0,-.45,.805);model.add(ring);rotor.position.set(0,-.45,.81);model.add(rotor);
   const bladeShape=new THREE.Shape();bladeShape.moveTo(.1,.07);bladeShape.quadraticCurveTo(.47,.08,.55,.37);bladeShape.quadraticCurveTo(.3,.63,.13,.57);bladeShape.quadraticCurveTo(.29,.32,.1,.07);const bladeGeometry=new THREE.ExtrudeGeometry(bladeShape,{depth:.025,bevelEnabled:true,bevelSize:.012,bevelThickness:.009,bevelSegments:2,steps:1});
   for(let i=0;i<7;i++){const blade=new THREE.Mesh(bladeGeometry,red);blade.rotation.z=i*Math.PI*2/7;rotor.add(blade);}const hub=new THREE.Mesh(new THREE.SphereGeometry(.18,32,20),darkMetal);hub.scale.z=.45;hub.position.z=.045;rotor.add(hub);
   const ventGeometry=new THREE.CircleGeometry(.029,12),ventMaterial=new THREE.MeshBasicMaterial({color:'#010101'}),vents=new THREE.InstancedMesh(ventGeometry,ventMaterial,52),matrix=new THREE.Matrix4();for(let i=0;i<52;i++){matrix.makeTranslation(-1.08+(i%13)*.18,-1.45-Math.floor(i/13)*.12,.749);vents.setMatrixAt(i,matrix);}model.add(vents);
   for(const x of [-1.07,1.07])for(const y of [.1,-1.19]){const screw=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.024,12),silver);screw.rotation.x=Math.PI/2;screw.position.set(x,y,.777);model.add(screw);box(.043,.006,.01,black,x,y,.798);}
   for(const x of [-.95,.95])box(.38,.14,1.45,black,x,-2.21,-.25);
   box(.4,.045,.025,new THREE.MeshBasicMaterial({color:'#f45b19'}),.9,-1.94,.756);
  }else if(variant==='identity'){
   // Brand-specific inflated A / V / E / X, with varying seams rather than identical ripples.
   const foil=new THREE.MeshPhysicalMaterial({color:'#580608',metalness:1,roughness:.16,clearcoat:1,clearcoatRoughness:.12});
   const letters=[[[[-.85,-.8,0],[-.42,.5,0],[0,1,0],[.42,.5,0],[.85,-.8,0]],[[-.56,-.1,0],[0,-.12,0],[.56,-.1,0]]],[[[-.85,.9,0],[-.4,-.25,0],[0,-.8,0],[.4,-.25,0],[.85,.9,0]]],[[[.7,.85,0],[-.55,.85,0],[-.72,.65,0],[-.72,-.65,0],[-.55,-.85,0],[.7,-.85,0]],[[-.67,0,0],[.45,0,0]]],[[[-.75,.8,0],[.75,-.8,0]],[[-.75,-.8,0],[.75,.8,0]]]];
   letters.forEach((paths,i)=>{const mark=new THREE.Group();paths.forEach(points=>{const curve=new THREE.CatmullRomCurve3(points.map(([x,y,z])=>new THREE.Vector3(x,y,z))),geo=new THREE.TubeGeometry(curve,90,.24,24,false),positions=geo.attributes.position;for(let n=0;n<positions.count;n++){const x=positions.getX(n),y=positions.getY(n),z=positions.getZ(n),wrinkle=.022*Math.sin(y*39+x*17)*Math.cos(x*9-y*3);positions.setXYZ(n,x,y,z*(1+wrinkle));}geo.computeVertexNormals();mark.add(new THREE.Mesh(geo,foil));for(const end of [curve.getPoint(0),curve.getPoint(1)]){const cap=new THREE.Mesh(new THREE.SphereGeometry(.239,24,16),foil);cap.position.copy(end);mark.add(cap);}});const placements=[[-2.85,1.9,-.5,.45],[.1,2.85,-1,-.3],[3,-1.3,.3,.5],[-2.85,-1.35,.3,-.5]];const [x,y,z,angle]=placements[i];mark.position.set(x,y,z);mark.rotation.set(i*.35,angle,angle);mark.scale.setScalar(i===0?1.2:1);model.add(mark);identities.push(mark);});
  }
  const backgroundScene=new THREE.Scene(),backgroundCamera=new THREE.Camera();
  const mist=new THREE.ShaderMaterial({depthWrite:false,depthTest:false,uniforms:{time:{value:0},aspect:{value:1},pointer:{value:new THREE.Vector2()},monochrome:{value:variant==='atmosphere'?1:0},strength:{value:variant==='identity'?.12:1}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:`varying vec2 vUv;uniform float time;uniform float aspect;uniform vec2 pointer;uniform float monochrome;uniform float strength;
   float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}float fbm(vec2 p){float n=0.,a=.5;for(int i=0;i<5;i++){n+=a*noise(p);p=p*2.02+vec2(4.8,2.1);a*=.5;}return n;}
   void main(){vec2 uv=vUv+vec2(-pointer.x,pointer.y)*.028;vec2 p=uv*vec2(aspect,1.);float t=time*.045;vec2 q=vec2(fbm(p*2.4+vec2(t,-t*.6)),fbm(p*2.3+vec2(-t*.45,t)+3.));float cloud=fbm(p*4.2+q*3.2+vec2(-t,t*.2)+vec2(-pointer.x,pointer.y)*.055);float wisps=pow(smoothstep(.27,.77,cloud),1.5);float surround=.5+.5*smoothstep(.15,.6,length(uv-vec2(.5,.5)));float plume=exp(-pow((uv.x-.95+.16*sin(uv.y*4.+t))*3.,2.))+exp(-pow((uv.y-.05-q.x*.2)*4.,2.))*.7;float density=wisps*mix(surround,plume,monochrome)*strength;vec3 color=mix(vec3(.52,.015,.005),vec3(.55),monochrome);float dots=1.-smoothstep(.15,.4,length(fract(gl_FragCoord.xy/4.)-.5));float grain=(hash(gl_FragCoord.xy)-.5)*.006;gl_FragColor=vec4(vec3(.001)+color*density*(1.-monochrome*.25+monochrome*dots*.25)+grain,1.);}`});
  backgroundScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),mist));renderer.autoClear=false;
  let frame=0,visible=true,last=0,time=0,progress=0;const pointer=new THREE.Vector2(),pointerTarget=new THREE.Vector2(),reduced=matchMedia('(prefers-reduced-motion: reduce)'),journey=el.closest<HTMLElement>('.hero-journey');
  const resize=()=>{const w=el.clientWidth,h=el.clientHeight;if(w&&h){renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();mist.uniforms.aspect.value=w/h;}};resize();const sizing=new ResizeObserver(resize);sizing.observe(el);const visibility=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});visibility.observe(el);
  // Independent head tracking: the monitor follows the visitor, not the entire enclosure.
  // Normalise to the visible scene, smooth in the render loop and ignore touch scrolling.
  const resetPointer=()=>pointerTarget.set(0,0);
  const onPointer=(e:PointerEvent)=>{if(e.pointerType==='touch'||document.documentElement.dataset.motion==='pause'||reduced.matches)return;const r=el.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom){resetPointer();return;}pointerTarget.set(THREE.MathUtils.clamp((e.clientX-r.left)/r.width*2-1,-1,1),THREE.MathUtils.clamp((e.clientY-r.top)/r.height*2-1,-1,1));};
  const onPointerOut=(e:PointerEvent)=>{if(!e.relatedTarget)resetPointer();};
  window.addEventListener('pointermove',onPointer,{passive:true});window.addEventListener('pointerout',onPointerOut,{passive:true});window.addEventListener('blur',resetPointer);
  const render=(now:number)=>{frame=requestAnimationFrame(render);const dt=Math.min((now-last)/1000,.045);last=now;if(!visible||document.hidden)return;const stopped=document.documentElement.dataset.motion==='pause'||reduced.matches;if(!stopped)time+=dt;const target=journey?THREE.MathUtils.clamp(-journey.getBoundingClientRect().top/Math.max(1,journey.offsetHeight),0,1):0;progress=THREE.MathUtils.lerp(progress,reduced.matches?0:stopped?progress:target,1-Math.exp(-dt*9));const mobile=el.clientWidth<700;
   if(reduced.matches)pointer.set(0,0);else if(!stopped)pointer.lerp(pointerTarget,1-Math.exp(-dt*7));
   if(variant==='assistant'){
    const approach=THREE.MathUtils.smoothstep(progress,.12,.8),settle=1-THREE.MathUtils.smoothstep(progress,0,.48),x=mobile?0:1.34,y=mobile?-.82:-.85;
    model.position.set(x,y+Math.sin(time*.55)*.025*settle,0);model.scale.setScalar(mobile?.93:1.1);model.rotation.set((-.025+pointer.y*.018)*settle,(.42+Math.sin(time*.32)*.04+pointer.x*.035)*settle,0);head.rotation.set((pointer.y*.2+Math.sin(time*.29)*.012)*settle,(pointer.x*.56+Math.sin(time*.38)*.035)*settle,-pointer.x*.025*settle);rotor.rotation.z=-time*2.2;
    const focusY=y+1.45*(mobile?.93:1.1);camera.position.set(THREE.MathUtils.lerp(0,x,approach),THREE.MathUtils.lerp(mobile?.75:.1,focusY,approach),THREE.MathUtils.lerp(mobile?12.5:10.1,mobile?2.4:2.6,approach));camera.lookAt(THREE.MathUtils.lerp(0,x,approach),THREE.MathUtils.lerp(mobile?.2:.1,focusY,approach),0);drawScreen?.(time,progress);
   }else{
    model.position.set(0,0,0);model.rotation.set(0,0,0);model.scale.setScalar(mobile?.82:1);const mobileX=[-1.6,.3,1.6,-1.5],desktopX=[-2.85,.1,3,-2.85];identities.forEach((mark,i)=>{mark.position.x=(mobile?mobileX:desktopX)[i];mark.rotation.y=Math.sin(time*.26+i)*.45+pointer.x*.12;mark.rotation.x=Math.cos(time*.22+i)*.3+pointer.y*.08;});camera.position.set(0,mobile?.1:.35,mobile?11.7:10.6);camera.lookAt(0,0,0);
   }
   mist.uniforms.time.value=time;mist.uniforms.pointer.value.copy(pointer);
   // Freeze simulation, not presentation. Repaint the same pose while visible so
   // browser compositing/resizing never replaces a paused WebGL scene with black.
   renderer.clear();renderer.render(backgroundScene,backgroundCamera);renderer.clearDepth();if(variant!=='atmosphere')renderer.render(scene,camera);
  };frame=requestAnimationFrame(render);
  return()=>{cancelAnimationFrame(frame);sizing.disconnect();visibility.disconnect();window.removeEventListener('pointermove',onPointer);window.removeEventListener('pointerout',onPointerOut);window.removeEventListener('blur',resetPointer);const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();for(const root of [scene,backgroundScene])root.traverse(o=>{if(o instanceof THREE.Mesh){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());for(const material of [black,red,silver,glass,darkMetal])material.dispose();display?.dispose();environment.dispose();renderer.dispose();renderer.domElement.remove();delete el.dataset.ready;};
 },[variant]);
 return <div className={`kinetic-scene scene-${variant}`} ref={host} aria-hidden="true"><div className="scene-fallback"/></div>;
}
