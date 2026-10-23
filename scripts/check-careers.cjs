const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const roles=require('../src/data/career-roles.json');
const origin=process.argv[2]||'http://127.0.0.1:3002';
async function main(){
 const home=await(await fetch(origin)).text();
 assert.equal(roles.length,4);
 for(const role of roles){
  assert.ok(home.includes('/careers/'+role.slug));
  const response=await fetch(origin+'/careers/'+role.slug);assert.equal(response.status,200);
  const html=await response.text();assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
  for(const text of [role.title,'What you bring.','Show us how you think.','Submit application','does not confirm an active vacancy'])assert.ok(html.includes(text),role.slug+': '+text);
  assert.ok(html.includes('href="#apply"'));
  assert.equal(role.responsibilities.length,4);assert.equal(role.skills.length,4);
 }
 assert.equal((await fetch(origin+'/careers/unknown-role')).status,404);
 const runtime=fs.readFileSync('public/reference/runtime.js','utf8');
 assert.ok(runtime.includes('careers:[0,4]')&&runtime.includes('Math.floor(cp*3)'));
 assert.ok(runtime.includes("reduce||i===ci?'false':'true'"));
 const anchors={'#career-story':1200,'#career-roles':4000,'.careers-invite':6000};
 const color={setRGB(){}},ctx={scrollPosition:0,reduce:false,innerWidth:1280,clamp:(n,a,b)=>Math.max(a,Math.min(b,n)),U:{uT:{value:1}},renderer:{getPixelRatio:()=>1},careerUniforms:{progress:{value:0},time:{value:0},pixelRatio:{value:1},colorA:{value:color},colorB:{value:color}},careerPoints:{scale:{setScalar(){}},position:{set(){}}},fq:{material:{uniforms:{uF:{value:0}}}}};
 ctx.careerPoints.rotation={};
 ctx.careerVeil={scale:{setScalar(){}},position:{set(){}},rotation:{set(){}}};
 ctx.document={querySelector:selector=>({getBoundingClientRect:()=>({top:anchors[selector]-ctx.scrollPosition})})};
 const scene=vm.createContext(ctx);vm.runInContext(runtime.match(/function updateCareerScene\(y\)\{[\s\S]*?\n\}/)[0],scene);
 const at=y=>{ctx.scrollPosition=y;for(let i=0;i<180;i++)vm.runInContext('updateCareerScene(scrollPosition)',scene);return ctx.careerUniforms.progress.value;};
 assert.ok(Math.abs(at(1200)-1)<.001);assert.ok(Math.abs(at(4000)-2)<.001);assert.ok(Math.abs(at(6000)-3)<.001);assert.ok(Math.abs(at(2600)-1.5)<.001,'Reversing scroll must restore the matching form');ctx.reduce=true;assert.ok(at(6000)<.001,'Reduced motion should hold the initial form');
 console.log('Passed: four role pages, overview links, role-specific content, direct application forms, unknown-role 404, scroll chapters and reduced-motion visibility.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
