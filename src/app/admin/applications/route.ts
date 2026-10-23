import {authorizeApplications,listApplications} from '@/lib/career-applications';
import roles from '@/data/career-roles.json';
import {renderApplicationDashboard} from '@/lib/application-dashboard';
import {databaseApplicationStats} from '@/lib/career-database';
import {ownerEmail} from '@/lib/admin-auth';

export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 const denied=await authorizeApplications();if(denied){if(denied.status===401)return Response.redirect(new URL('/admin/login',request.url));if(denied.status===403)return Response.redirect(new URL('/admin/verify',request.url));return denied;}
 const applications=await listApplications();
 const url=new URL(request.url);
 const stats=process.env.DATABASE_URL?await databaseApplicationStats():undefined;
 const html=renderApplicationDashboard(applications,roles,ownerEmail(),{search:url.searchParams.get('q')||'',role:url.searchParams.get('role')||'all'},stats);
 return new Response(html,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'}});
}
