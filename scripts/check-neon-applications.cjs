const assert=require('node:assert/strict');
process.loadEnvFile('.env.local');
const origin=process.argv[2]||'http://127.0.0.1:3002';
const ids=[];let sql;
async function main(){
 const {neon}=await import('@neondatabase/serverless');sql=neon(process.env.DATABASE_URL_POOLED||process.env.DATABASE_URL);
 for(const page of ['login','signup','forgot','reset','verify']){const response=await fetch(origin+'/admin/'+page);assert.equal(response.status,200);assert.ok((await response.text()).includes('Restricted to the verified owner account.'));}
 let response=await fetch(origin+'/admin/applications',{redirect:'manual'});assert.equal(response.status,302);assert.ok(response.headers.get('location').endsWith('/admin/login'));assert.equal(response.headers.get('www-authenticate'),null);
 assert.equal((await fetch(origin+'/api/career-applications/00000000-0000-0000-0000-000000000000/cv')).status,401);
 assert.equal((await fetch(origin+'/api/admin/logout',{method:'POST',headers:{Origin:'https://other.example'}})).status,403);
 const fixture=()=>{const form=new FormData();for(const [key,value] of Object.entries({role:'product-designer',name:'Synthetic Neon QA',email:'neon-application-check@example.invalid',portfolio:'https://example.invalid/portfolio',message:'Synthetic integration test of direct applications and private Neon persistence. This is not a real applicant.',availability:'QA only',consent:'yes'}))form.set(key,value);return form;};
 const send=(body,headers={})=>fetch(origin+'/api/career-applications',{method:'POST',headers:{Origin:origin,...headers},body});
 assert.equal((await send(fixture(),{Origin:'https://other.example'})).status,403);
 let form=fixture();form.delete('consent');assert.equal((await send(form)).status,400);
 form=fixture();form.set('cv',new Blob(['not a PDF']),'fake.pdf');assert.equal((await send(form)).status,400);
 form=fixture();form.set('role','unknown');assert.equal((await send(form)).status,400);
 form=fixture();form.set('cv',new Blob([new Uint8Array(3*1024*1024+1)]),'large.pdf');assert.equal((await send(form)).status,413);
 const pdf='%PDF-1.4\n% Synthetic integration test fixture\n%%EOF';form=fixture();form.set('cv',new Blob([pdf],{type:'application/pdf'}),'qa.pdf');
 response=await send(form);assert.equal(response.status,201);const {reference}=await response.json();ids.push(reference);
 const rows=await sql`SELECT record,encode(cv,'hex') AS pdf FROM public.avexium_career_applications WHERE id=${reference}`;
 assert.equal(rows.length,1);assert.equal(rows[0].record.email,'neon-application-check@example.invalid');assert.equal(rows[0].record.hasCV,true);assert.equal(Buffer.from(rows[0].pdf,'hex').toString(),pdf);
 assert.equal((await fetch(origin+'/api/career-applications/'+reference+'/cv')).status,401);
 assert.equal((await fetch(origin+'/.data/career-applications/'+reference+'/record.json')).status,404);
 for(let attempt=0;attempt<2;attempt++){response=await send(fixture());assert.equal(response.status,201);ids.push((await response.json()).reference);}
 assert.equal((await send(fixture())).status,429);
 const policy=await sql`SELECT relrowsecurity FROM pg_class WHERE oid='public.avexium_career_applications'::regclass`;assert.equal(policy[0].relrowsecurity,true);
 console.log('Passed: owner auth screens, login redirect, protected CVs, logout origin validation, Neon application/PDF persistence, role/consent/upload validation, rate limits and row-level security. Real owner signup/sign-in remains a user step.');
}
main().catch(error=>{console.error(error instanceof assert.AssertionError?error.message:'Neon application checks failed; inspect private configuration.');process.exitCode=1;}).finally(async()=>{
 if(sql)for(const id of ids)await sql`DELETE FROM public.avexium_career_applications WHERE id=${id} AND record->>'email'='neon-application-check@example.invalid'`;
});
