const fs=require('node:fs/promises');
const {database,decrypt}=require('./ops-common.cjs');
async function main(){
 const file=process.argv.find((arg,i)=>i>1&&!arg.startsWith('--'));if(!file)throw new Error('Provide an encrypted backup file.');
 const data=decrypt(await fs.readFile(file));if(data.version!==1||!Array.isArray(data.applications)||!Array.isArray(data.enquiries)||!Array.isArray(data.outbox))throw new Error('Unsupported backup.');
 console.log('Verified backup: '+data.applications.length+' applications, '+data.enquiries.length+' enquiries.');
 if(!process.argv.includes('--apply')){console.log('Dry run only. Add --apply to restore missing records into the configured database. Existing records are preserved.');return;}
 const sql=await database();
 // Atomic restore: never leave partially restored records or send queued mail automatically.
 const statements=[];
 for(const row of data.applications)statements.push(sql`INSERT INTO public.avexium_career_applications(id,created_at,record,cv) VALUES (${row.id},${row.created_at},${JSON.stringify(row.record)}::jsonb,decode(${row.cv},'hex')) ON CONFLICT(id) DO NOTHING`);
 for(const row of data.enquiries)statements.push(sql`INSERT INTO public.avexium_enquiries(id,created_at,record) VALUES (${row.id},${row.created_at},${JSON.stringify(row.record)}::jsonb) ON CONFLICT(id) DO NOTHING`);
 for(const row of data.outbox)statements.push(sql`INSERT INTO public.avexium_notification_outbox(enquiry_id,status,attempts,last_attempt,sent_at,provider_reference) VALUES (${row.enquiry_id},${row.sent_at?'sent':'pending'},${row.attempts},${row.last_attempt},${row.sent_at},${row.provider_reference}) ON CONFLICT(enquiry_id) DO NOTHING`);
 if(statements.length)await sql.transaction(statements);console.log('Restore completed. Existing records were preserved.');
}
main().catch(()=>{console.error('Restore failed. Check the backup file, encryption key and database.');process.exitCode=1;});
