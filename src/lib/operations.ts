import 'server-only';
import {careerDatabase} from './career-database';
export async function operationalEvent(code:string,severity:'error'|'info'='error'){
 // Fixed event codes only: never store credentials, request bodies or applicant data.
 const event={code:code.slice(0,80),severity,time:new Date().toISOString()};
 console[severity==='error'?'error':'info'](JSON.stringify(event));
 try{const sql=careerDatabase();await sql`INSERT INTO public.avexium_operational_events(code,severity) VALUES (${event.code},${severity})`;}catch{/* Console logging remains available if the database is down. */}
}
