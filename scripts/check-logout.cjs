const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
async function main(){
 let calls=0;const compiled={exports:{}};
 const source=ts.transpileModule(fs.readFileSync('src/app/api/admin/logout/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 vm.runInNewContext(source,{module:compiled,exports:compiled.exports,Request,Response,URL,process:{env:{APP_URL:'https://avexium.example'}},require:name=>{assert.equal(name,'@/lib/admin-auth');return {getAuth:()=>({signOut:async()=>{calls++;}})};}});
 const send=origin=>compiled.exports.POST(new Request('http://internal-proxy/api/admin/logout',{method:'POST',headers:origin?{Origin:origin,Host:'internal-proxy'}:{}}));
 for(const origin of [null,'null','https://other.example','http://avexium.example'])assert.equal((await send(origin)).status,403);
 assert.equal(calls,0);
 const result=await send('https://avexium.example');assert.equal(result.status,303);assert.equal(result.headers.get('location'),'https://avexium.example/');assert.equal(calls,1);
 for(const file of ['src/app/admin/applications/route.ts','src/app/admin/enquiries/route.ts'])assert.ok(fs.readFileSync(file,'utf8').includes("'Referrer-Policy':'same-origin'"),'Dashboard form posts must preserve their same-origin Origin header');
 console.log('Passed: logout rejects foreign/null origins, supports a proxy host, signs out once and redirects to the configured homepage. Both dashboards preserve same-origin form metadata.');
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
