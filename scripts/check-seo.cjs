const assert=require('node:assert/strict');
const origin=process.argv[2]||'http://127.0.0.1:3002';
const services=require('../src/data/service-pages.json'),roles=require('../src/data/career-roles.json');
async function main(){
 const titles=new Set();
 for(const section of ['home','services','work','process','careers','start']){
  const path=section==='home'?'/':'/'+section,response=await fetch(origin+path,{redirect:'manual'});assert.equal(response.status,200,path);const html=await response.text();
  assert.ok(html.includes(`<main class="page on" data-r="${section}"`),path+' must render its own overview');assert.equal((html.match(/<main class="page on"/g)||[]).length,1);
  const title=html.match(/<title>(.*?)<\/title>/)?.[1];assert.ok(title);assert.ok(!titles.has(title),'Unique titles');titles.add(title);
  const canonical=html.match(/rel="canonical" href="([^"]+)"/)?.[1];assert.equal(new URL(canonical).href,new URL(path,'http://localhost:3002').href,path+' canonical');
  assert.ok(html.includes('name="robots" content="noindex, nofollow"'));assert.ok(html.includes('property="og:image"'));
 }
 for(const path of [...services.map(item=>'/services/'+item.slug),...roles.map(item=>'/careers/'+item.slug),...['tablevori','seluvrane','drapeviqa'].map(slug=>'/work/'+slug)]){
  const response=await fetch(origin+path,{redirect:'manual'});assert.equal(response.status,200,path);const html=await response.text();assert.ok(html.includes('rel="canonical" href="http://localhost:3002'+path+'"'));assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
 }
 assert.ok((await(await fetch(origin+'/robots.txt')).text()).includes('Disallow: /'));
 assert.ok(!(await(await fetch(origin+'/sitemap.xml')).text()).includes('<loc>'),'Local preview sitemap must not publish localhost links');
 for(const [path,type] of [['/icon.svg','image/svg+xml'],['/opengraph-image','image/png']]){const response=await fetch(origin+path);assert.equal(response.status,200);assert.ok(response.headers.get('content-type').startsWith(type));assert.ok((await response.arrayBuffer()).byteLength>1000);}
 const response=await fetch(origin+'/contact',{redirect:'manual'});assert.ok(response.headers.get('location').endsWith('/start'));
 console.log('Passed: distinct server-rendered overview routes, canonical metadata, 17 detail routes, social image, favicon, local indexing protection and contact redirect.');
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
