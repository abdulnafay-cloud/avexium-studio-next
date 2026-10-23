import 'server-only';
import {neon} from '@neondatabase/serverless';
import type {CareerApplication} from './career-applications';
import type {DashboardStats} from './application-dashboard';

export function careerDatabase(){
 const url=process.env.DATABASE_URL_POOLED||process.env.DATABASE_URL;
 if(!url)throw new Error('Application database is not configured.');
 return neon(url);
}
export async function saveDatabaseApplication(application:CareerApplication,cv:Buffer|null){
 const sql=careerDatabase();
 await sql`INSERT INTO public.avexium_career_applications(id,created_at,record,cv) VALUES (${application.id},${application.createdAt},${JSON.stringify(application)}::jsonb,decode(${cv?.toString('hex')||null},'hex'))`;
}
export async function listDatabaseApplications(){
 const sql=careerDatabase();
 const rows=await sql`SELECT record FROM public.avexium_career_applications ORDER BY created_at DESC LIMIT 500`;
 return rows.map(row=>row.record as CareerApplication);
}
export async function databaseApplicationStats():Promise<DashboardStats>{
 const sql=careerDatabase();
 const rows=await sql`SELECT count(*)::int AS total,count(*) FILTER (WHERE created_at >= now()-interval '7 days')::int AS recent,count(*) FILTER (WHERE cv IS NOT NULL)::int AS "withCV",count(DISTINCT record->>'role')::int AS disciplines FROM public.avexium_career_applications`;
 return rows[0] as DashboardStats;
}
export async function readDatabaseCV(id:string){
 const sql=careerDatabase();
 const rows=await sql`SELECT encode(cv,'hex') AS pdf FROM public.avexium_career_applications WHERE id=${id}`;
 return rows[0]?.pdf?Buffer.from(rows[0].pdf,'hex'):null;
}
