// A separate morphing particle field, rendered by the site's existing WebGL canvas.
module.exports=`
var careerCount=innerWidth<760?28000:82000,careerShapes=[0,1,2,3].map(function(){return new Float32Array(careerCount*3)}),careerRandom=new Float32Array(careerCount),careerSeed=14221;
function careerRand(){careerSeed=(careerSeed*1664525+1013904223)>>>0;return careerSeed/4294967296;}
(function(){for(var ci=0;ci<careerCount;ci++){
 var cr=careerRand(),ct=careerRand()*Math.PI*2,cy=careerRand()*2-1,ck=ci*3,arm=ci%3,rad=.3+Math.pow(cr,.65)*5.8,angle=(ci%4)*Math.PI*.5+rad*1.12+(careerRand()-.5)*.45;
 careerShapes[0].set([Math.cos(angle)*rad,Math.sin(angle)*rad*.6,(careerRand()-.5)*(.4+rad*.23)],ck);
 var rx=(careerRand()-.5)*13,lane=ci%4-1.5,ry=Math.sin(rx*.65+lane*.8)*1.15+lane*.75;
 careerShapes[1].set([rx,ry+(careerRand()-.5)*.46,Math.cos(rx*.48+lane)*1.8+(careerRand()-.5)*.45],ck);
 var hy=cy*3.7,ha=hy*1.5+(ci%3)*Math.PI*2/3,hr=1.5+careerRand()*.48;
 careerShapes[2].set([Math.cos(ha)*hr+1.6,hy,Math.sin(ha)*hr],ck);
 var oa=ct,orr=2.15+careerRand()*.7,tilt=arm*Math.PI/3;
 careerShapes[3].set([Math.cos(oa)*orr*1.5,Math.sin(oa)*orr*Math.cos(tilt),Math.sin(oa)*orr*Math.sin(tilt)],ck);
 careerRandom[ci]=careerRand();
}})();
var careerGeometry=new THREE.BufferGeometry();careerGeometry.setAttribute('position',new THREE.BufferAttribute(careerShapes[0],3));for(var cs=1;cs<4;cs++)careerGeometry.setAttribute('c'+cs,new THREE.BufferAttribute(careerShapes[cs],3));careerGeometry.setAttribute('aR',new THREE.BufferAttribute(careerRandom,1));
var careerUniforms={time:{value:0},progress:{value:0},pixelRatio:{value:renderer.getPixelRatio()},colorA:{value:new THREE.Color('#f33724')},colorB:{value:new THREE.Color('#f2eee6')}};
var careerMaterial=new THREE.ShaderMaterial({uniforms:careerUniforms,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
vertexShader:'attribute vec3 c1,c2,c3;attribute float aR;uniform float time,progress,pixelRatio;uniform vec3 colorA,colorB;varying vec3 vC;varying float vA;float ease(float x){x=clamp(x,0.,1.);return x*x*(3.-2.*x);}void main(){vec3 p=position;float d=aR*.18;p=mix(p,c1,ease(progress*1.18-d));p=mix(p,c2,ease((progress-1.)*1.18-d));p=mix(p,c3,ease((progress-2.)*1.18-d));p.y+=.16*sin(p.x*.8+time*.4+aR*6.);p.z+=.22*sin(p.y*1.2+time*.3+aR*4.);float a=.1*sin(time*.12);p.xz=mat2(cos(a),-sin(a),sin(a),cos(a))*p.xz;float beam=pow(.5+.5*sin(p.x*1.2+p.y*.7-time*.75),12.);vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp((.9+aR*1.9+beam*.6)*pixelRatio*6./max(-mv.z,.3),.7,5.*pixelRatio);vC=mix(colorA,colorB,.5+.5*sin(p.x*.5+p.y*.6+aR*3.));vC=mix(vC,vec3(.9,.96,1.),beam*.55);vA=(.3+.85*aR)*(.85+.15*sin(time*.65+aR*50.))*(1.+beam*.5);}',
fragmentShader:'precision highp float;varying vec3 vC;varying float vA;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,.05,d);gl_FragColor=vec4(vC,a*a*vA);}' });
var careerPoints=new THREE.Points(careerGeometry,careerMaterial);careerPoints.frustumCulled=false;careerPoints.visible=false;scene.add(careerPoints);
var careerVeil=new THREE.Points(careerGeometry,careerMaterial);careerVeil.frustumCulled=false;careerVeil.visible=false;scene.add(careerVeil);
function updateCareerScene(y){
 var story=document.querySelector('#career-story'),roles=document.querySelector('#career-roles'),invite=document.querySelector('.careers-invite');if(!story||!roles||!invite)return;
 var anchors=[0,story.getBoundingClientRect().top+y,roles.getBoundingClientRect().top+y,invite.getBoundingClientRect().top+y],target=3;
 for(var i=0;i<3;i++){if(y<anchors[i+1]){target=i+clamp((y-anchors[i])/Math.max(anchors[i+1]-anchors[i],1),0,1);break;}}
 if(reduce)target=0;
 careerUniforms.progress.value+=(target-careerUniforms.progress.value)*.09;careerUniforms.time.value=U.uT.value;careerUniforms.pixelRatio.value=renderer.getPixelRatio();
 var phase=careerUniforms.progress.value/3;
 careerUniforms.colorA.value.setRGB(.95,.18+phase*.1,.11+phase*.06);careerUniforms.colorB.value.setRGB(1,.75+phase*.12,.6+phase*.15);
 careerPoints.scale.setScalar(innerWidth<760?.59:.88);careerPoints.position.set(0,innerWidth<760?-.35:0,0);
 careerPoints.rotation.z=Math.sin(phase*Math.PI)*.13;careerPoints.rotation.y=phase*.24;
 careerVeil.visible=careerPoints.visible;careerVeil.scale.setScalar(innerWidth<760?.8:1.18);careerVeil.position.set(0,.3,-2.8);careerVeil.rotation.set(.3,-.35,-.18+phase*.3);
 fq.material.uniforms.uF.value=.24;
}
`;
