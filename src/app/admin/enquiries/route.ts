import {authorizeOwner,ownerEmail} from '@/lib/admin-auth';
import {listEnquiries} from '@/lib/enquiries';
import {renderEnquiryDashboard} from '@/lib/enquiry-dashboard';
import services from '@/data/service-pages.json';
import {careerDatabase} from '@/lib/career-database';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 const denied=await authorizeOwner();if(denied){if(denied.status===401)return Response.redirect(new URL('/admin/login',request.url));if(denied.status===403)return Response.redirect(new URL('/admin/verify',request.url));return denied;}
 const enquiries=await listEnquiries(),sql=careerDatabase();
 const rows=await sql`SELECT count(*)::int AS total,count(*) FILTER (WHERE created_at>=now()-interval '7 days')::int AS recent,count(*) FILTER (WHERE jsonb_array_length(record->'services')>0)::int AS "withCV",(SELECT count(DISTINCT service)::int FROM public.avexium_enquiries CROSS JOIN LATERAL jsonb_array_elements_text(record->'services') AS service) AS disciplines FROM public.avexium_enquiries`;
 const url=new URL(request.url),html=renderEnquiryDashboard(enquiries,services,ownerEmail(),{search:url.searchParams.get('q')||'',role:url.searchParams.get('role')||'all'},rows[0] as {total:number;recent:number;withCV:number;disciplines:number});
 return new Response(html,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",'X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin'}});
}
