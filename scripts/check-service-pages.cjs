const assert=require('node:assert/strict');
const services=require('../src/data/service-pages.json');
const base=process.argv[2];
const slugs=new Set(services.map(service=>service.slug));
const specimens={'website-design':'v2','web-development':'v9','app-development':'v10','brand-identity':'v1','ui-ux-product-design':'v3','custom-software':'v11','e-commerce':'v6','motion-3d':'v4','seo-digital-marketing':'v5','ai-automation':'v8'};
assert.equal(services.length,10);assert.equal(slugs.size,10);
for(const service of services){
 assert.ok(service.work.length>=3&&service.technology.length>=3&&service.deliverables.length>=6&&service.inputs.length>=3&&service.faq.length>=2,service.slug+' lacks practical detail');
 assert.ok(JSON.stringify(service).split(/\s+/).length>=400,service.slug+' needs substantial content');
 for(const related of service.related)assert.ok(slugs.has(related)&&related!==service.slug,'Invalid related service');
 assert.doesNotMatch(JSON.stringify(service),/[$£€]\s*\d|\bbudget\b/i);
}
async function main(){
 if(!base){console.log('Passed: ten unique services, detailed scope and technology content, valid related links and no pricing.');return;}
 const get=(path,options={})=>fetch(base+path,{signal:AbortSignal.timeout(30000),...options});
 // Sequential requests keep the check usable on the local preview machine.
 for(const service of services){
  const response=await get('/services/'+service.slug,{redirect:'manual'});assert.equal(response.status,200,service.slug);
  const html=await response.text();assert.equal((html.match(/<h1[ >]/g)||[]).length,1,service.slug);
  assert.ok(html.includes(service.title)&&html.includes('Technology and implementation.')&&html.includes('What we need from you.')&&html.includes('Acceptance checks'),service.slug);
  assert.ok(html.includes('?service='+service.slug+'#/start'),service.slug+' enquiry context');
  assert.ok(html.includes('class="service-showcase"')&&html.includes('class="showcase-window"'),service.slug+' needs a dimensional service showcase');
  if(service.slug==='website-design')assert.ok(html.includes('class="showcase-site"')&&html.includes('class="showcase-sculpture"'),'Website design needs its animated interface composition');
  else assert.ok(html.includes('class="showcase-specimen detail-scene open"')&&html.includes('class="vis tilt '+specimens[service.slug]+'"'),service.slug+' must reuse its overview animation');
  assert.ok(html.includes('class="detail-background"')&&html.includes('<canvas')&&html.includes('class="detail-mobile-menu"'),service.slug+' must share the animated website shell');
  if(service.slug==='ai-automation'){const dots=html.match(/class="vis tilt v8"[^>]*>([\s\S]*?)<\/div>/)?.[1]||'';assert.equal((dots.match(/<i /g)||[]).length,35);}
  assert.doesNotMatch(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''),/[$£€]\s*\d|\bBudget\b/);
  assert.ok(!html.includes('id="reference-site"'),'Detail routes must not mount the standalone animation');
 }
 const root=await(await get('/')).text();assert.doesNotMatch(root.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''),/[$£€]\s*\d|\bBudget\b/);assert.ok(root.includes('Project stage'));
 assert.equal((root.match(/class="lk service-detail-trigger"/g)||[]).length,10,'Every animated service panel needs a visible details button');
 for(const service of services)assert.ok(root.includes('href="/services/'+service.slug+'"'),service.slug+' missing overview link');
 for(const [from,to] of [['brand-design','brand-identity'],['mobile-development','app-development'],['ecommerce','e-commerce']]){const r=await get('/services/'+from,{redirect:'manual'});assert.equal(r.status,307);assert.equal(r.headers.get('location'),'/services/'+to);}
 assert.equal((await get('/services/not-a-service',{redirect:'manual'})).status,404);
 console.log('Passed: ten complete public service pages, direct overview links, contextual enquiries, legacy redirects, unknown-service 404 and no pricing.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
