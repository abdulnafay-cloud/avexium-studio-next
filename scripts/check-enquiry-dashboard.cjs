const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
function loadRenderer(){const file=path.resolve('src/lib/enquiry-dashboard.ts'),compiled=new Module(file,module);compiled.filename=file;compiled.paths=module.paths;compiled._compile(ts.transpileModule(fs.readFileSync(file,'utf8').replace("'./application-dashboard'","'./application-dashboard.ts'"),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,file);return compiled.exports.renderEnquiryDashboard;}
module.exports=loadRenderer;
if(require.main===module){
 const render=loadRenderer(),services=require('../src/data/service-pages.json'),now=new Date().toISOString();
 const fixture={id:'synthetic',createdAt:now,name:'QA <script>unsafe</script>',email:'sample@example.invalid',services:['Web development','Brand identity'],stage:'New project',message:'Project brief <img src=x onerror=alert(1)>',consentAt:now};
 const html=render([fixture],services,'owner@example.invalid',{});
 for(const text of ['Project enquiries','Enquiry inbox','Project brief','Project stage','By primary service','Web development','Brand identity','/admin/applications','action="/admin/enquiries"'])assert.ok(html.includes(text),text);
 assert.ok(!html.includes('<script>unsafe</script>'));assert.ok(html.includes('&lt;script&gt;unsafe&lt;/script&gt;'));assert.ok(!html.includes('Open portfolio'));assert.ok(!html.includes('No CV attached'));
 assert.ok(render([fixture],services,'owner@example.invalid',{search:'missing'}).includes('No matching enquiries'));
 assert.ok(render([],services,'owner@example.invalid',{}).includes('Ready for your next project.'));
 console.log('Passed: enquiry dashboard labels, service filters, empty states, safe brief rendering and private navigation.');
}
