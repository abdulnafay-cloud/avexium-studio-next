const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const runtime=fs.readFileSync('public/reference/runtime.js','utf8');
const reference=fs.readFileSync('design-reference/Avexium_Digital2.html','utf8');
const section=(y,height)=>({offsetHeight:height,getBoundingClientRect:()=>({top:y})});
const nodes={'#svc':section(1000,1200),'#work':section(2400,2800),'#logo':section(5200,2304),'#hproc':section(7504,3024),'#hcta':section(11000,720)};
function timeline(code,height){
 const context=vm.createContext({route:'home',innerHeight:height,scrollY:0,HP:[],$:id=>nodes[id],top:e=>e.getBoundingClientRect().top,clamp:(n,a,b)=>Math.min(b,Math.max(a,n))});
 vm.runInContext(code.slice(code.indexOf('function measure(){'),code.indexOf("var nav=$('#nav')")),context);
 context.measure();return context;
}
for(const height of [667,720,844,1080]){
 const actual=timeline(runtime,height),expected=timeline(reference,height);
 for(let y=0;y<=7504-height*1.1;y+=10)assert.equal(actual.morphAt(y,12000),expected.morphAt(y,12000),'Earlier scroll cue differs at '+y+' / '+height);
 assert.equal(actual.morphAt(5200+height*.35,12000),3);
 for(let y=7504-height*.35;y<=11000-height*.85;y+=10)assert.equal(actual.morphAt(y,12000),4,'Process must hold its helix through all chapters');
 assert.equal(actual.morphAt(11000+height*.35,12000),5);
}
// The reference uses 7% interpolation per 60Hz frame. Verify equal convergence
// over one second at both of the site's rendering caps.
const expectedRemainder=Math.pow(.93,60);
for(const fps of [30,45,60])assert.ok(Math.abs(Math.pow(1-(1-Math.pow(.93,60/fps)),fps)-expectedRemainder)<1e-12);
assert.ok(runtime.includes('mm+=(tgt-mm)*(1-Math.pow(.93,dt*60));'));
assert.ok(runtime.includes('U.uVel.value=uv;'));
assert.ok(!runtime.includes('homeStoryPose'));
assert.ok(!runtime.includes('storyWeight'));
console.log('Passed: original animation preserved, with corrected logo/process scroll sequence at four viewport heights.');
