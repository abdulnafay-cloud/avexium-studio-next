// A contained, lit sculpture for the home introduction. Other scroll chapters
// continue to use the original particle geometry and timeline.
module.exports=`
var homeSculpture=new THREE.Group();scene.add(homeSculpture);
var homeGrainCanvas=document.createElement('canvas');homeGrainCanvas.width=homeGrainCanvas.height=128;
var homeGrainContext=homeGrainCanvas.getContext('2d'),homeGrainData=homeGrainContext.createImageData(128,128),homeSeed=21371;
for(var hg=0;hg<homeGrainData.data.length;hg+=4){homeSeed=(homeSeed*1664525+1013904223)>>>0;var hgv=228+(homeSeed/4294967296)*17;homeGrainData.data[hg]=homeGrainData.data[hg+1]=homeGrainData.data[hg+2]=hgv;homeGrainData.data[hg+3]=255;}
homeGrainContext.putImageData(homeGrainData,0,0);
var homeGrain=new THREE.CanvasTexture(homeGrainCanvas);homeGrain.wrapS=homeGrain.wrapT=THREE.RepeatWrapping;homeGrain.repeat.set(5,3);
var homeStudioCanvas=document.createElement('canvas');homeStudioCanvas.width=512;homeStudioCanvas.height=256;
var homeStudioContext=homeStudioCanvas.getContext('2d');homeStudioContext.fillStyle='#151519';homeStudioContext.fillRect(0,0,512,256);
function homeSoftbox(x,y,w,h,color){var grad=homeStudioContext.createRadialGradient(x,y,0,x,y,w);grad.addColorStop(0,color);grad.addColorStop(.35,color);grad.addColorStop(1,'#151519');homeStudioContext.save();homeStudioContext.translate(x,y);homeStudioContext.scale(1,h/w);homeStudioContext.translate(-x,-y);homeStudioContext.fillStyle=grad;homeStudioContext.fillRect(x-w,y-w,w*2,w*2);homeStudioContext.restore();}
homeSoftbox(160,80,65,100,'#eee8dc');homeSoftbox(405,120,45,120,'#a73c25');
var homeStudioTexture=new THREE.CanvasTexture(homeStudioCanvas);homeStudioTexture.mapping=THREE.EquirectangularReflectionMapping;homeStudioTexture.colorSpace=THREE.SRGBColorSpace;
var homePMREM=new THREE.PMREMGenerator(renderer),homeEnvironment=homePMREM.fromEquirectangular(homeStudioTexture);homePMREM.dispose();homeStudioTexture.dispose();
var homeMetal=new THREE.MeshStandardMaterial({color:0x292727,metalness:.78,roughness:.42,roughnessMap:homeGrain,envMap:homeEnvironment.texture,envMapIntensity:1.4,transparent:true});
var homeCopper=new THREE.MeshStandardMaterial({color:0xb5482c,metalness:.78,roughness:.27,transparent:true});
var homeEdge=new THREE.MeshStandardMaterial({color:0x7e4432,metalness:.7,roughness:.35,transparent:true});
homeCopper.envMap=homeEdge.envMap=homeEnvironment.texture;
var homeCore=new THREE.Mesh(new THREE.SphereGeometry(1.05,96,64),homeMetal);homeSculpture.add(homeCore);
var homeOrbit=new THREE.Mesh(new THREE.TorusGeometry(1.44,.035,16,160),homeCopper);homeOrbit.rotation.set(1.04,.27,-.34);homeSculpture.add(homeOrbit);
var homeSeam=new THREE.Mesh(new THREE.TorusGeometry(1.055,.007,8,160),homeEdge);homeSeam.rotation.set(.52,.1,.34);homeSculpture.add(homeSeam);
var homeKey=new THREE.DirectionalLight(0xffe8d2,1.1);homeKey.position.set(-2,4,5);scene.add(homeKey);
var homeRimLight=new THREE.DirectionalLight(0xf33724,2.1);homeRimLight.position.set(4,1,-2);scene.add(homeRimLight);
var homeFill=new THREE.HemisphereLight(0xd6dce7,0x21140f,.95);scene.add(homeFill);
function updateHomeSculpture(y,vh,narrow){
 var hp=route==='home'?1-clamp(y/(vh*.82),0,1):0;hp=hp*hp*(3-2*hp);
 homeSculpture.visible=hp>.001;U.uHeroFade.value=hp;
 homeKey.visible=homeRimLight.visible=homeFill.visible=homeSculpture.visible;
 if(!homeSculpture.visible)return;
 var t=U.uT.value;
 homeSculpture.position.set(narrow?.62:2.4,narrow?.85:.48,0);
 homeSculpture.scale.setScalar(narrow?.72:1.03);
 homeSculpture.rotation.set(.13+(reduce?0:Math.sin(t*.12)*.025),-.22+(reduce?0:t*.035),-.12);
 homeOrbit.rotation.z=-.34+(reduce?0:Math.sin(t*.15)*.09);
 homeMetal.opacity=homeCopper.opacity=homeEdge.opacity=hp;
 fq.material.uniforms.uF.value=.88;
}
`;
