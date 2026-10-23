'use client';
import {useActionState,useState} from 'react';
import Link from 'next/link';
import {adminAuthAction,type AdminAuthState} from '@/app/admin/auth-actions';

export default function AdminAuthForm({view,token=''}:{view:string;token?:string}){
 const [state,action,pending]=useActionState(adminAuthAction.bind(null,view,token),{} as AdminAuthState);
 const [verificationEmail,setVerificationEmail]=useState('');
 const password=['login','signup','reset'].includes(view);
 const labels:Record<string,string>={login:'Sign in',signup:'Create owner account',forgot:'Send reset link',reset:'Save new password',verify:'Send verification code'};
 return <><form action={action} className="admin-auth-form" aria-busy={pending}>
  {view==='signup'&&<label>Your name<input name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Your full name"/></label>}
  {view!=='reset'&&<label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="Your owner email" value={view==='verify'?verificationEmail:undefined} onChange={event=>{if(view==='verify')setVerificationEmail(event.target.value);}}/></label>}
  {password&&<label>{view==='reset'?'New password':'Password'}<input name="password" type="password" autoComplete={view==='login'?'current-password':'new-password'} required minLength={view==='login'?1:12} maxLength={128} placeholder={view==='login'?'Enter your password':'At least 12 characters'}/></label>}
  {view==='login'&&<Link href="/admin/forgot" className="admin-auth-forgot">Forgot password?</Link>}
  {state.error&&<p className="admin-auth-error" role="alert">{state.error}</p>}
  {state.message&&<p className="admin-auth-message" role="status">{state.message}</p>}
  <button type="submit" name="intent" value="send" disabled={pending}>{pending?'Please wait…':labels[view]}<span aria-hidden="true">↗</span></button>
  {view==='verify'&&<><label>Verification code<input name="otp" autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6,8}" minLength={6} maxLength={8} placeholder="Enter the code from your email"/></label><button type="submit" name="intent" value="verify" disabled={pending}>{pending?'Please wait…':'Verify email'}<span aria-hidden="true">↗</span></button></>}
 </form><div className="admin-auth-links">{view==='login'?<><Link href="/admin/signup">Create owner account</Link><Link href="/admin/verify">Resend verification</Link></>:<Link href="/admin/login">← Back to sign in</Link>}</div></>;
}
