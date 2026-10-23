const assert=require('node:assert/strict');
const {randomUUID}=require('node:crypto');
const fs=require('node:fs/promises'),path=require('node:path');
const {spawnSync}=require('node:child_process');
const {database,root,encrypt}=require('./ops-common.cjs');
let sql,file;const appId=randomUUID(),enquiryId=randomUUID();
async function main(){
 sql=await database();const now=new Date().toISOString(),email='recovery-check@example.invalid',pdf=Buffer.from('%PDF-1.4\nSynthetic recovery test\n%%EOF').toString('hex');
 const application={id:appId,createdAt:now,name:'Synthetic Recovery QA',email,role:'product-designer',portfolio:'https://example.invalid',message:'Synthetic recovery test, not a real applicant.',availability:'QA only',hasCV:true,consentAt:now};
 const enquiry={id:enquiryId,createdAt:now,name:'Synthetic Recovery QA',email,services:['Web development'],message:'Synthetic recovery test, not a real project brief.',stage:'QA only',consentAt:now};
 const payload={version:1,applications:[{id:appId,created_at:now,record:application,cv:pdf}],enquiries:[{id:enquiryId,created_at:now,record:enquiry}],outbox:[{enquiry_id:enquiryId,attempts:0,last_attempt:null,sent_at:null,provider_reference:null}]};
 await fs.mkdir(root,{recursive:true});file=path.join(root,'synthetic-recovery-'+appId+'.avex');await fs.writeFile(file,encrypt(payload),{flag:'wx'});
 const restore=()=>{const result=spawnSync(process.execPath,['scripts/restore-data.cjs',file,'--apply'],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);};
 restore();restore();
 const applications=await sql`SELECT encode(cv,'hex') AS cv,record FROM public.avexium_career_applications WHERE id=${appId}`;assert.equal(applications.length,1);assert.equal(applications[0].cv,pdf);assert.equal(applications[0].record.email,email);
 const enquiries=await sql`SELECT record FROM public.avexium_enquiries WHERE id=${enquiryId}`;assert.equal(enquiries.length,1);assert.deepEqual(enquiries[0].record.services,['Web development']);
 const queue=await sql`SELECT status FROM public.avexium_notification_outbox WHERE enquiry_id=${enquiryId}`;assert.equal(queue.length,1);assert.equal(queue[0].status,'pending');
 console.log('Passed: encrypted synthetic recovery restores private records, PDF bytes and queue state; repeat restore preserves existing records.');
}
main().catch(error=>{console.error(error instanceof assert.AssertionError?error.message:'Recovery integration check failed.');process.exitCode=1;}).finally(async()=>{if(sql){await sql`DELETE FROM public.avexium_career_applications WHERE id=${appId} AND record->>'email'='recovery-check@example.invalid'`;await sql`DELETE FROM public.avexium_enquiries WHERE id=${enquiryId} AND record->>'email'='recovery-check@example.invalid'`;}if(file)await fs.unlink(file).catch(()=>{});});
