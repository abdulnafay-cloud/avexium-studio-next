const assert=require('node:assert/strict');
const {randomUUID}=require('node:crypto');
const {database}=require('./ops-common.cjs');
const origin=process.argv[2]||'http://127.0.0.1:3002';let sql;const ids=[];
async function main(){
 sql=await database();const id=randomUUID();ids.push(id);
 const fixture={idempotencyKey:id,name:'Synthetic Enquiry QA',email:'enquiry-check@example.invalid',message:'Synthetic integration test for a responsive business website and connected content management workflow.',services:['web-development'],stage:'Starting something new',consent:true,website:''};
 const send=(body,extra={})=>fetch(origin+'/api/enquiries',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...extra},body:JSON.stringify(body)});
 assert.equal((await send(fixture,{Origin:'https://other.example'})).status,403);
 assert.equal((await send({...fixture,consent:false})).status,400);
 assert.equal((await send({...fixture,services:['unknown']})).status,400);
 assert.equal((await send({...fixture,website:'spam'})).status,400);
 assert.equal((await send({...fixture,message:'x'.repeat(22000)})).status,413);
 let response=await send(fixture);assert.equal(response.status,201);assert.equal((await response.json()).reference,id);
 assert.equal((await send(fixture)).status,201);
 const rows=await sql`SELECT record FROM public.avexium_enquiries WHERE id=${id}`;assert.equal(rows.length,1);assert.equal(rows[0].record.services[0],'Web development');
 const outbox=await sql`SELECT count(*)::int AS count FROM public.avexium_notification_outbox WHERE enquiry_id=${id}`;assert.equal(outbox[0].count,1);
 for(const path of ['/admin/enquiries','/admin/applications']){response=await fetch(origin+path,{redirect:'manual'});assert.equal(response.status,302);}
 assert.equal((await fetch(origin+'/api/admin/health')).status,401);
 const policy=await sql`SELECT relname,relrowsecurity FROM pg_class WHERE relname IN ('avexium_enquiries','avexium_notification_outbox','avexium_operational_events')`;assert.equal(policy.length,3);assert.ok(policy.every(row=>row.relrowsecurity));
 // Exercise local notification generation for this synthetic record only; it never sends email.
 const fs=require('node:fs/promises'),path=require('node:path');const {root}=require('./ops-common.cjs');
 const {spawnSync}=require('node:child_process');const run=spawnSync(process.execPath,['scripts/notification-worker.cjs','--only='+id],{encoding:'utf8'});assert.equal(run.status,0,run.stdout+run.stderr);
 const preview=await fs.readFile(path.join(root,'mail-preview',id+'.eml'),'utf8');assert.ok(preview.includes('Content-Transfer-Encoding: base64'));
 await fs.unlink(path.join(root,'mail-preview',id+'.eml'));
 const state=await sql`SELECT status,sent_at FROM public.avexium_notification_outbox WHERE enquiry_id=${id}`;assert.equal(state[0].status,'previewed');assert.equal(state[0].sent_at,null);
 console.log('Passed: direct enquiry persistence, retry deduplication, private notification queue and email previews, validation, access restrictions and row-level security.');
}
main().catch(error=>{console.error(error instanceof assert.AssertionError?error.message:'Enquiry integration checks failed.');process.exitCode=1;}).finally(async()=>{if(sql)for(const id of ids)await sql`DELETE FROM public.avexium_enquiries WHERE id=${id} AND record->>'email'='enquiry-check@example.invalid'`;});
