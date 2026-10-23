const assert=require('node:assert/strict');
const base=process.argv[2]||'http://localhost:3002';
async function get(route,options){return fetch(base+route,{...options,signal:AbortSignal.timeout(15000)});}
async function main(){
 const response=await get('/'),html=await response.text();assert.equal(response.status,200);assert.match(html,/id="reference-site"/);assert.doesNotMatch(html,/scene-assistant|Pause motion|Sound off|UTC\+5/);
 const views=[...html.matchAll(/<main class="page(?: on)?" data-r="([^"]+)"/g)].map(m=>m[1]);assert.deepEqual(views,['home','services','work','process','careers','start']);assert.match(html,/Send project enquiry/);assert.match(html,/id="enquiry-consent"/);for(const name of ['Tablevori','Seluvrane','Drapeviqa'])assert.ok(html.includes(name));
 const redirects=[['/contact','/start'],['/studio','/'],['/services/brand-design','/services/brand-identity']];
 await Promise.all(redirects.map(async([route,destination])=>{const r=await get(route,{redirect:'manual'});assert.equal(r.status,307,route);assert.equal(new URL(r.headers.get('location'),base).pathname,destination,route);}));
 await Promise.all(['/services','/work','/process','/careers','/start','/work/tablevori','/privacy','/site-information','/reference/three.min.js','/reference/lenis.min.js','/reference/runtime.js','/projects/tablevori.png','/projects/seluvrane.webp','/projects/drapeviqa.png'].map(async route=>{const r=await get(route);assert.equal(r.status,200,route);await r.arrayBuffer();}));
 const runtime=await(await get('/reference/runtime.js')).text();assert.ok(runtime.includes("$$('h1,h2').forEach"));assert.ok(runtime.includes('gl_PointSize=clamp('));assert.ok(runtime.includes("if(hashRoute()!=='home')go()"));assert.ok(runtime.includes("fetch('/api/enquiries'"));
 console.log('Passed: six page views, removed controls, enquiry markup, clean public routes and legacy redirects, legal pages, local libraries, project assets and runtime guards.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
