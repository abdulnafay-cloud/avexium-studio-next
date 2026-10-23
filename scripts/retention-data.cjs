const {database,report}=require('./ops-common.cjs');
async function main(){
 const sql=await database(),apply=process.argv.includes('--apply');
 const applicationDays=Number(process.env.APPLICATION_RETENTION_DAYS||180),enquiryDays=Number(process.env.ENQUIRY_RETENTION_DAYS||365);
 if(![applicationDays,enquiryDays].every(n=>Number.isInteger(n)&&n>=30))throw new Error('Retention must be at least 30 days.');
 const appBefore=new Date(Date.now()-applicationDays*86400000).toISOString(),enquiryBefore=new Date(Date.now()-enquiryDays*86400000).toISOString();
 const [apps,enquiries,events]=await Promise.all([sql`SELECT count(*)::int AS count FROM public.avexium_career_applications WHERE created_at < ${appBefore}`,sql`SELECT count(*)::int AS count FROM public.avexium_enquiries WHERE created_at < ${enquiryBefore}`,sql`SELECT count(*)::int AS count FROM public.avexium_operational_events WHERE created_at < now()-interval '30 days'`]);
 const counts={applications:apps[0].count,enquiries:enquiries[0].count,events:events[0].count};
 if(apply)await sql.transaction([sql`DELETE FROM public.avexium_career_applications WHERE created_at < ${appBefore}`,sql`DELETE FROM public.avexium_enquiries WHERE created_at < ${enquiryBefore}`,sql`DELETE FROM public.avexium_operational_events WHERE created_at < now()-interval '30 days'`]);
 await report('retention',{mode:apply?'applied':'dry-run',counts,applicationDays,enquiryDays});console.log((apply?'Removed expired records: ':'Dry run; eligible records: ')+JSON.stringify(counts));
 if(!apply)console.log('No records deleted. Review retention periods and backups before using --apply.');
}
main().catch(()=>{console.error('Retention check failed. No credentials were printed.');process.exitCode=1;});
