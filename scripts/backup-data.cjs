const fs=require('node:fs/promises');
const path=require('node:path');
const {database,root,encrypt,decrypt,report}=require('./ops-common.cjs');
async function main(){
 const sql=await database();
 const [applications,enquiries,outbox]=await sql.transaction([
  sql`SELECT id,created_at,record,encode(cv,'hex') AS cv FROM public.avexium_career_applications ORDER BY created_at`,
  sql`SELECT id,created_at,record FROM public.avexium_enquiries ORDER BY created_at`,
  sql`SELECT * FROM public.avexium_notification_outbox ORDER BY id`
 ],{isolationLevel:'RepeatableRead',readOnly:true});
 const payload={version:1,createdAt:new Date().toISOString(),applications,enquiries,outbox};
 const encrypted=encrypt(payload),verified=decrypt(encrypted);
 if(JSON.stringify(verified)!==JSON.stringify(payload))throw new Error('Backup verification failed.');
 const folder=path.join(root,'backups');await fs.mkdir(folder,{recursive:true});
 const file=path.join(folder,new Date().toISOString().replace(/[:.]/g,'-')+'.avex');await fs.writeFile(file,encrypted,{flag:'wx'});
 const counts={applications:applications.length,enquiries:enquiries.length,outbox:outbox.length};
 await report('backup',{status:'verified',file:path.basename(file),counts});console.log('Encrypted backup created and verified. Record counts: '+JSON.stringify(counts));
}
main().catch(()=>{console.error('Backup failed. Check the database and private encryption key.');process.exitCode=1;});
