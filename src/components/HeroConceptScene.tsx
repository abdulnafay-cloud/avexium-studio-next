'use client';
import {useEffect,useRef} from 'react';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {scrollProgress} from '@/lib/scroll-progress';

export type HeroConcept='optics'|'fabric'|'orbit';
export default function HeroConceptScene({concept}:{concept:HeroConcept}){
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const el=host.current;if(!el)return;
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});}catch{el.dataset.unavailable='true';return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor('#08090b');renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;el.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.1,50),model=new THREE.Group();scene.add(model);
  const generator=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),environment=generator.fromScene(room,.04);scene.environment=environment.texture;room.dispose();generator.dispose();
  scene.add(new THREE.AmbientLight('#9ba6bd',.35));
  const lights=[['#fff0df',55,-4,5,5],['#ff321b',75,4,1,2],['#8bbaff',40,-2,-3,1]] as const;
  for(const [color,power,x,y,z] of lights){const light=new THREE.PointLight(color,power,0,2);light.position.set(x,y,z);scene.add(light);}
  const chrome=new THREE.MeshPhysicalMaterial({color:'#a6a7aa',metalness:1,roughness:.18,clearcoat:1}),black=new THREE.MeshPhysicalMaterial({color:'#14151a',metalness:.85,roughness:.29,clearcoat:1}),ruby=new THREE.MeshPhysicalMaterial({color:'#9b1b12',metalness:.75,roughness:.24,clearcoat:1});
  const moving:THREE.Object3D[]=[];let cloth:THREE.PlaneGeometry|undefined,original:Float32Array|undefined;
  const mesh=(geometry:THREE.BufferGeometry,material:THREE.Material,parent=model)=>{const item=new THREE.Mesh(geometry,material);parent.add(item);return item;};
  if(concept==='optics'){
   // A deep optical barrel, precision knurling and separate convex glass elements.
   const barrel=mesh(new THREE.CylinderGeometry(1.4,1.25,1.5,96,1,true),black);barrel.rotation.x=Math.PI/2;
   for(let i=0;i<5;i++){const ring=mesh(new THREE.TorusGeometry(1.3+i*.025,.045,12,96),i===3?ruby:chrome);ring.position.z=-.65+i*.29;}
   for(let i=0;i<72;i++){const angle=i*Math.PI*2/72,item=mesh(new THREE.BoxGeometry(.028,.1,.3),black);item.position.set(Math.cos(angle)*1.405,Math.sin(angle)*1.405,.1);item.rotation.z=angle;}
   const lensMaterial=new THREE.MeshPhysicalMaterial({color:'#cbdbe6',metalness:0,roughness:.045,transmission:.92,thickness:.7,ior:1.52,clearcoat:1,attenuationColor:new THREE.Color('#486b87'),attenuationDistance:3});
   for(let i=0;i<3;i++){const assembly=new THREE.Group();model.add(assembly);assembly.position.z=.6+i*.15;mesh(new THREE.TorusGeometry(1.08-i*.08,.055,16,96),i===0?ruby:chrome,assembly);const glass=mesh(new THREE.SphereGeometry(1.03-i*.08,64,32),lensMaterial,assembly);glass.scale.z=.12;moving.push(assembly);}
   const iris=new THREE.Group();iris.position.z=-.3;model.add(iris);for(let i=0;i<9;i++){const blade=mesh(new THREE.BoxGeometry(.55,.34,.025),black,iris);const a=i*Math.PI*2/9;blade.position.set(Math.cos(a)*.54,Math.sin(a)*.54,0);blade.rotation.z=a+.65;}moving.push(iris);
  }else if(concept==='fabric'){
   cloth=new THREE.PlaneGeometry(4.8,4.1,90,76);original=new Float32Array(cloth.attributes.position.array);
   const silk=new THREE.MeshPhysicalMaterial({color:'#881a12',metalness:.88,roughness:.24,clearcoat:.85,side:THREE.DoubleSide});mesh(cloth,silk);
  }else{
   const glass=new THREE.MeshPhysicalMaterial({color:'#c4d7e6',metalness:0,roughness:.045,transmission:.98,thickness:1.2,ior:1.48,iridescence:.65,iridescenceIOR:1.3,clearcoat:1});
   mesh(new THREE.TorusKnotGeometry(1.1,.24,200,32,2,3),glass);
   for(let i=0;i<3;i++){const ring=mesh(new THREE.TorusGeometry(1.9+i*.18,.027,12,128),i===1?ruby:chrome);ring.rotation.set(.6+i*.6,.3+i*.7,i*.5);moving.push(ring);}
   const core=mesh(new THREE.IcosahedronGeometry(.42,3),ruby);moving.push(core);
  }
  // A restrained pool of light makes the objects read as studio-lit sculptures.
  const backdrop=new THREE.Mesh(new THREE.PlaneGeometry(28,18),new THREE.ShaderMaterial({depthWrite:false,uniforms:{tint:{value:new THREE.Color(concept==='fabric'?'#491008':'#251415')}},vertexShader:'varying vec2 uvp;void main(){uvp=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 uvp;uniform vec3 tint;void main(){vec2 p=(uvp-vec2(.62,.48))*vec2(1.5,1.);float light=exp(-dot(p,p)*15.);gl_FragColor=vec4(vec3(.008,.01,.014)+tint*light*.7,1.);}'}));backdrop.position.z=-4;scene.add(backdrop);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),pointer=new THREE.Vector2(),target=new THREE.Vector2();let visible=false,frame=0,last=0,time=0;
  const stage=el.parentElement!,section=stage.parentElement!;
  const resize=()=>{const w=el.clientWidth,h=el.clientHeight;if(w&&h){renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}};resize();const sizing=new ResizeObserver(resize);sizing.observe(el);
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});observer.observe(el);
  const onPointer=(event:PointerEvent)=>{if(event.pointerType==='touch')return;const r=el.getBoundingClientRect();target.set(THREE.MathUtils.clamp((event.clientX-r.left)/r.width*2-1,-1,1),THREE.MathUtils.clamp((event.clientY-r.top)/r.height*2-1,-1,1));};const leave=()=>target.set(0,0);stage.addEventListener('pointermove',onPointer,{passive:true});stage.addEventListener('pointerleave',leave);
  const draw=(now:number)=>{frame=requestAnimationFrame(draw);const dt=Math.min((now-last)/1000,.04);last=now;if(!visible||document.hidden)return;const still=reduced.matches;if(!still)time+=dt;pointer.lerp(still?new THREE.Vector2():target,1-Math.exp(-dt*6));const p=still?0:scrollProgress(section,stage),mobile=el.clientWidth<=750;
   model.scale.setScalar(mobile?(concept==='optics'?.8:.62):1);model.position.set(mobile?0:1.35,mobile?-.85:0,0);model.rotation.set(.12+pointer.y*.1,.25+pointer.x*.18,0);
   if(concept==='optics'){model.rotation.y+=Math.sin(time*.2)*.12+p*.35;moving.slice(0,3).forEach((item,i)=>{item.position.z=.6+i*.15+p*i*.48;});moving[3].rotation.z=time*.12+p*.8;moving[3].children.forEach((blade,i)=>{const angle=i*Math.PI*2/9;blade.position.set(Math.cos(angle)*(.54+p*.18),Math.sin(angle)*(.54+p*.18),0);blade.rotation.z=angle+.65+p*.4;});}
   if(cloth&&original){const positions=cloth.attributes.position;for(let i=0;i<positions.count;i++){const x=original[i*3],y=original[i*3+1],wave=Math.sin(x*2.2+y*1.1-time*.55);positions.setXYZ(i,x+(Math.sin(y*1.4+time*.23)*.18),y,Math.sin(x*1.4-time*.3)*.45+wave*.2+Math.sin(y*1.8+time*.45)*.25+p*Math.sin(x)*.65);}positions.needsUpdate=true;cloth.computeVertexNormals();model.rotation.set(-.1+pointer.y*.08,-.48+pointer.x*.15,-.22+Math.sin(time*.15)*.08);}
   if(concept==='orbit'){model.rotation.y+=time*.085+p*.65;model.rotation.z=Math.sin(time*.17)*.13;moving.slice(0,3).forEach((ring,i)=>{ring.rotation.z=time*(i%2?-.11:.12)+i*.5;});moving[3].rotation.set(time*.1,time*.2,0);}
   const start=mobile?(concept==='fabric'?14:13):10.7;camera.position.set(0,mobile?.6:.3,start-p*(mobile?1:2));camera.lookAt(0,0,0);renderer.render(scene,camera);
  };frame=requestAnimationFrame(draw);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();sizing.disconnect();stage.removeEventListener('pointermove',onPointer);stage.removeEventListener('pointerleave',leave);const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();scene.traverse(o=>{if(o instanceof THREE.Mesh){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());for(const material of [chrome,black,ruby])material.dispose();environment.dispose();renderer.dispose();renderer.domElement.remove();};
 },[concept]);
 return <div className="concept-canvas" ref={host} aria-hidden="true"><span className="concept-fallback">Preparing live 3D…</span><span className="concept-unavailable">This preview needs a WebGL-capable browser.</span></div>;
}
