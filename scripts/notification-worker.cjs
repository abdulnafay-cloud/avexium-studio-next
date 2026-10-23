const fs=require('node:fs/promises');
const path=require('node:path');
const {database,root,report}=require('./ops-common.cjs');
async function main(){
 const sql=await database(),send=process.argv.includes('--send');
 if(send&&(!process.env.RESEND_API_KEY||!process.env.NOTIFICATION_FROM||!process.env.NOTIFICATION_TO))throw new Error('Live email configuration is missing.');
 const only=process.argv.find(arg=>arg.startsWith('--only='))?.slice(7)||null;
 if(only&&!/^[a-f0-9-]{36}$/i.test(only))throw new Error('Invalid reference.');
 const rows=only?await sql`SELECT o.id,e.record FROM public.avexium_notification_outbox o JOIN public.avexium_enquiries e ON e.id=o.enquiry_id WHERE o.sent_at IS NULL AND e.id=${only}::uuid ORDER BY o.id LIMIT 1`:await sql`SELECT o.id,e.record FROM public.avexium_notification_outbox o JOIN public.avexium_enquiries e ON e.id=o.enquiry_id WHERE o.sent_at IS NULL ORDER BY o.id LIMIT 100`;
 const directory=path.join(root,'mail-preview');await fs.mkdir(directory,{recursive:true});let delivered=0;
 for(const row of rows){
  const e=row.record,subject='New project enquiry — '+e.id.slice(0,8),text=`Reference: ${e.id}\nName: ${e.name}\nEmail: ${e.email}\nServices: ${e.services.join(', ')||'To discuss'}\nStage: ${e.stage}\n\n${e.message}`;
  if(!send){const encoded=Buffer.from(text).toString('base64').match(/.{1,76}/g).join('\r\n');await fs.writeFile(path.join(directory,e.id+'.eml'),`From: Avexium Local Preview <preview@example.invalid>\r\nTo: Owner <owner@example.invalid>\r\nSubject: ${subject}\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n${encoded}\r\n`);await sql`UPDATE public.avexium_notification_outbox SET status='previewed',last_attempt=now() WHERE id=${row.id} AND sent_at IS NULL`;continue;}
  await sql`UPDATE public.avexium_notification_outbox SET attempts=attempts+1,last_attempt=now() WHERE id=${row.id}`;
  try{
   const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json','Idempotency-Key':'avexium-enquiry-'+e.id},body:JSON.stringify({from:process.env.NOTIFICATION_FROM,to:[process.env.NOTIFICATION_TO],reply_to:e.email,subject,text}),signal:AbortSignal.timeout(15000)});
   if(!response.ok)throw new Error('Delivery failed');const result=await response.json();
   await sql`UPDATE public.avexium_notification_outbox SET status='sent',sent_at=now(),provider_reference=${String(result.id||'accepted')} WHERE id=${row.id}`;delivered++;
  }catch{await sql`UPDATE public.avexium_notification_outbox SET status='failed' WHERE id=${row.id}`;await sql`INSERT INTO public.avexium_operational_events(code,severity) VALUES ('notification_delivery_failed','error')`;}
 }
 await report('notifications',{mode:send?'live':'preview',processed:rows.length,delivered});console.log(send?`Delivery run: ${delivered}/${rows.length} sent.`:`Local email previews written: ${rows.length}. No email was sent.`);
}
main().catch(()=>{console.error('Notification worker failed. Check private configuration.');process.exitCode=1;});
