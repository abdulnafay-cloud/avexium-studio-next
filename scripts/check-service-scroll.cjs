const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const runtime=fs.readFileSync('public/reference/runtime.js','utf8');
const css=fs.readFileSync('src/app/reference.css','utf8');
const markup=JSON.parse(fs.readFileSync('src/data/reference-markup.ts','utf8').match(/referenceMarkup=(.*);/)[1]);
const services=markup.match(/<main class="page" data-r="services">[\s\S]*?<\/main>/)[0];
assert.ok(runtime.includes("AI=$$('.cd')"),'Deck controller must select all cards');
assert.equal((services.match(/<article class="cd/g)||[]).length,10);
assert.equal((services.match(/service-detail-trigger/g)||[]).length,10);
assert.equal((services.match(/class="service-tech"/g)||[]).length,10);
assert.ok(!/class="idx"|id="scur"|\bweeks?\b/i.test(services));
assert.ok(services.includes('services-outro'));
assert.ok(css.includes('.services-outro{min-height:100vh;min-height:100svh'));
function at(scrollY,reduce=false){
 const cards=Array.from({length:10},(_,i)=>({offsetHeight:500,style:{},dataset:{c:i===0?'0,0,0':'1,1,1'},classList:{toggle(){}},setAttribute(){},removeAttribute(){}}));
 const deck={offsetHeight:5600,getBoundingClientRect:()=>({top:800-scrollY})};
 const context=vm.createContext({route:'services',vh:800,scrollY,reduce,AI:cards,
  $:()=>deck,getComputedStyle:node=>node===deck?{rowGap:'60'}:{top:'82'},
  clamp:(n,a,b)=>Math.min(b,Math.max(a,n)),spi:{style:{}},
  RB:cards.map(()=>({classList:{toggle(){}},setAttribute(){},removeAttribute(){}}))});
 const from=runtime.indexOf("if(route==='services'){\n var deck=");
 assert.ok(from>=0);let depth=0,end=from;
 for(let i=runtime.indexOf('{',from);i<runtime.length;i++){
  if(runtime[i]==='{')depth++;
  if(runtime[i]==='}'&&--depth===0){end=i+1;break;}
 }
 vm.runInContext(runtime.slice(from,end),context);
 return {cards,tint:Array.from(context.tint)};
}
const early=at(700),middle=at(860),late=at(1050);
assert.ok(early.tint[0]<middle.tint[0]&&middle.tint[0]<late.tint[0]);
assert.deepEqual(at(700).tint,early.tint,'Reversing scroll must restore the same colour');
assert.ok(at(0).cards[0].style.opacity<at(300).cards[0].style.opacity);
assert.ok(at(1050).cards[0].style.transform.includes('scale('));
assert.equal(at(1050,true).cards[0].style.transform,'none');
console.log('Passed: ten technical cards without numbering or week claims; scroll-driven stacking, reversible colour and reduced motion.');
