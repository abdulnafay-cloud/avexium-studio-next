import 'server-only';
import {careerDatabase} from './career-database';
export type Enquiry={id:string;createdAt:string;name:string;email:string;services:string[];stage:string;message:string;consentAt:string};
export async function saveEnquiry(enquiry:Enquiry){
 const sql=careerDatabase();
 await sql.transaction([
  sql`INSERT INTO public.avexium_enquiries(id,created_at,record) VALUES (${enquiry.id},${enquiry.createdAt},${JSON.stringify(enquiry)}::jsonb) ON CONFLICT (id) DO NOTHING`,
  sql`INSERT INTO public.avexium_notification_outbox(enquiry_id) VALUES (${enquiry.id}) ON CONFLICT (enquiry_id) DO NOTHING`
 ]);
}
export async function listEnquiries(){const sql=careerDatabase();const rows=await sql`SELECT record FROM public.avexium_enquiries ORDER BY created_at DESC LIMIT 500`;return rows.map(row=>row.record as Enquiry);}
