import 'server-only';
import {createNeonAuth} from '@neondatabase/auth/next/server';

let instance:ReturnType<typeof createNeonAuth>|undefined;
export const ownerEmail=()=>process.env.ADMIN_OWNER_EMAIL?.trim().toLowerCase()||'';
export function getAuth(){
 if(!instance){
  const baseUrl=process.env.NEON_AUTH_BASE_URL,secret=process.env.NEON_AUTH_COOKIE_SECRET;
  if(!baseUrl||!secret||secret.length<32)throw new Error('Owner authentication is not configured.');
  instance=createNeonAuth({baseUrl,cookies:{secret,sessionDataTtl:60,sameSite:'lax'},logLevel:'silent'});
 }
 return instance;
}
export async function authorizeOwner(){
 if(!ownerEmail())return Response.json({error:'Owner access is not configured.'},{status:503});
 try{
  const {data,error}=await getAuth().getSession();
  if(error)return Response.json({error:'Please sign in again.'},{status:401});
  if(!data?.user)return Response.json({error:'Sign in to access applications.'},{status:401});
  if(data.user.email.toLowerCase()!==ownerEmail())return Response.json({error:'This account does not have dashboard access.'},{status:403});
  if(!data.user.emailVerified)return Response.json({error:'Verify your owner email before accessing applications.'},{status:403});
  return null;
 }catch{return Response.json({error:'Authentication is temporarily unavailable. Please try again.'},{status:503});}
}
