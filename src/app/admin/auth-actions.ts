'use server';

import {redirect} from 'next/navigation';
import {getAuth,ownerEmail} from '@/lib/admin-auth';

export type AdminAuthState={error?:string;message?:string};
export async function adminAuthAction(view:string,token:string,_previous:AdminAuthState,form:FormData):Promise<AdminAuthState>{
 const email=String(form.get('email')||'').trim().toLowerCase();
 const password=String(form.get('password')||'');
 if(!ownerEmail())return {error:'Owner access has not been configured.'};
 if(view!=='reset'&&email!==ownerEmail())return {error:'This dashboard is restricted to the owner account.'};
 if(['login','signup','reset'].includes(view)&&(password.length<(view==='login'?1:12)||password.length>128))return {error:'Use a password between 12 and 128 characters.'};
 const appUrl=process.env.APP_URL;
 if(!appUrl)return {error:'The application URL has not been configured.'};
 let signInComplete=false;
 try{
  const auth=getAuth();
  if(view==='login'){
   const {data,error}=await auth.signIn.email({email,password});
   if(error)return {error:'Unable to sign in. Check your credentials and verify your email, then try again.'};
   if(!data?.user.emailVerified)return {error:'Verify your email before opening the dashboard. Use Resend verification below to request and enter an email code.'};
   signInComplete=true;
  }else if(view==='signup'){
   const name=String(form.get('name')||'').trim();
   if(name.length<2||name.length>100)return {error:'Enter your name using 2–100 characters.'};
   const {error}=await auth.signUp.email({email,password,name,callbackURL:new URL('/admin/login',appUrl).href});
   if(error)return {error:'Unable to create this account. If you already registered, sign in or reset your password.'};
   return {message:'Account created. Open Resend verification to request and enter your email verification code, then sign in.'};
  }else if(view==='verify'){
   if(form.get('intent')==='verify'){
    const otp=String(form.get('otp')||'').trim();
    if(!/^\d{6,8}$/.test(otp))return {error:'Enter the numeric verification code from your email.'};
    const {error}=await auth.emailOtp.verifyEmail({email,otp});
    if(error)return {error:'This code is invalid or expired. Check the code or request a new one.'};
    return {message:'Email verified. You can now return to sign in.'};
   }
   const {error}=await auth.emailOtp.sendVerificationOtp({email,type:'email-verification'});
   if(error)return {error:'The verification code could not be sent. Check that email verification codes are enabled in Neon Auth, then try again.'};
   return {message:'Verification code requested. Check your inbox and Spam, then enter the latest code below. Delivery may take a few minutes.'};
  }else if(view==='forgot'){
   const {error}=await auth.requestPasswordReset({email,redirectTo:new URL('/admin/reset',appUrl).href});
   if(error)return {error:'The reset email could not be sent. Please try again shortly.'};
   return {message:'If this owner account exists, a password reset link has been sent to its email address.'};
  }else if(view==='reset'){
   if(!token||token.length>2000)return {error:'This reset link is invalid. Request a new password reset email.'};
   const {error}=await auth.resetPassword({token,newPassword:password});
   if(error)return {error:'This reset link is invalid or expired. Please request a new one.'};
   return {message:'Your password has been updated. You can now sign in.'};
  }else return {error:'Unknown authentication action.'};
 }catch{return {error:'Authentication is temporarily unavailable. Please try again shortly.'};}
 if(signInComplete)redirect('/admin/applications');
 return {};
}
