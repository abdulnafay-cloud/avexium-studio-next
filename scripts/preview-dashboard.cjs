// Local visual test fixture only. It does not read credentials, sessions or real applications.
const http=require('node:http');
const {renderApplicationDashboard}=require('../src/lib/application-dashboard.ts');
const roles=require('../src/data/career-roles.json');
const now=new Date().toISOString();
const fixtures=[['Maya Chen','product-designer',true],['Sam Wilson','creative-developer',true],['Alex Morgan','brand-designer',false]].map(([name,role,hasCV],i)=>({id:'00000000-0000-0000-0000-00000000000'+i,createdAt:now,role,name,email:'sample-'+i+'@example.invalid',portfolio:'https://example.invalid/portfolio',message:'Synthetic design preview application. No real applicant information is displayed.',availability:'Sample availability',consentAt:now,hasCV}));
http.createServer((request,response)=>{
 const url=new URL(request.url,'http://127.0.0.1:3007');
 const html=renderApplicationDashboard(fixtures,roles,'owner@example.invalid',{search:url.searchParams.get('q')||'',role:url.searchParams.get('role')||'all'}).replace('YOUR WORKSPACE, AT A GLANCE','DESIGN PREVIEW · SYNTHETIC SAMPLE DATA');
 response.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});response.end(html);
}).listen(3007,'127.0.0.1',()=>console.log('Synthetic dashboard design preview: http://127.0.0.1:3007'));
