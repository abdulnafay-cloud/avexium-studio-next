const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
const {randomUUID}=require('node:crypto');
const services=require('../src/data/service-pages.json');
async function main(){
 const compiled={exports:{}},saved=[];
 const source=ts.transpileModule(fs.readFileSync('src/app/api/enquiries/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
 vm.runInNewContext(source,{module:compiled,exports:compiled.exports,Request,Response,URL,Buffer,require:name=>{
  if(name==='@/data/service-pages.json')return services;
  if(name==='@/lib/enquiries')return {saveEnquiry:async item=>{saved.push(item);}};
  if(name==='@/lib/operations')return {operationalEvent:async()=>{}};
  throw Error('Unexpected import '+name);
 }});
 const send=(selected,extra={})=>compiled.exports.POST(new Request('https://avexium.example/api/enquiries',{method:'POST',headers:{Origin:'https://avexium.example',Host:'avexium.example','Content-Type':'application/json'},body:JSON.stringify({idempotencyKey:randomUUID(),name:'Catalogue validation',email:randomUUID()+'@example.invalid',message:'Test the expanded catalogue validation without writing to any real database.',services:selected,stage:'Exploring options',consent:true,website:'',...extra})}));
 for(const service of services)assert.equal((await send([service.slug])).status,201,service.slug+' must be accepted');
 assert.equal((await send(services.map(service=>service.slug))).status,201,'A cross-category brief must be accepted');
 assert.equal((await send(['Brand identity'])).status,201,'Earlier title remains valid');
 assert.equal(saved.at(-1).services[0],'Graphic design & logo systems');
 const count=saved.length;
 assert.equal((await send(['made-up-service'])).status,400);
 assert.equal((await send(Array(services.length+1).fill('web-development'))).status,400);
 assert.equal((await send(['legal-contracts-compliance'],{consent:false})).status,400);
 assert.equal(saved.length,count,'Rejected input must never reach storage');
 console.log('Passed: all forty service slugs, cross-category enquiries, earlier titles and invalid-selection rejection. Storage mocked; no real enquiries submitted.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
