// Reserved test origin only. This does not change environment files or publish anything.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
function load(file,env,imports={}){const compiledModule={exports:{}};const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText;vm.runInNewContext(code,{module:compiledModule,exports:compiledModule.exports,require:name=>{if(!(name in imports))throw new Error('Unexpected import');return imports[name];},process:{env},URL});return compiledModule.exports;}
const metadata=load('src/lib/site-metadata.ts',{PUBLIC_SITE_URL:'https://avexium.example',APP_URL:'https://avexium.example'});
assert.equal(metadata.isPublicSite,true);
const imports={'@/lib/site-metadata':metadata,'@/data/service-pages.json':require('../src/data/service-pages.json'),'@/data/career-roles.json':require('../src/data/career-roles.json'),'@/data/catalog':require('../src/data/catalog.ts')};
const sitemap=load('src/app/sitemap.ts',{},imports).default();assert.equal(sitemap.length,25);assert.equal(new Set(sitemap.map(item=>item.url)).size,25);assert.ok(sitemap.every(item=>item.url.startsWith('https://avexium.example/')&&!/\/(admin|api)\//.test(item.url)));
const robots=load('src/app/robots.ts',{},imports).default();assert.equal(robots.sitemap,'https://avexium.example/sitemap.xml');assert.ok(robots.rules.disallow.includes('/admin/'));
assert.equal(load('src/lib/site-metadata.ts',{APP_URL:'http://localhost:3002'}).isPublicSite,false);
console.log('Passed: configured production sitemap has 25 unique public URLs, private routes stay excluded and local indexing remains disabled. No real domain was configured.');
