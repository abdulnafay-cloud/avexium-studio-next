'use client';
/* eslint-disable @next/next/no-html-link-for-pages -- Full navigation resets the standalone particle runtime. */

import {useState, type FormEvent} from 'react';

export default function CareerApplicationForm({slug,title}:{slug:string;title:string}){
 const [pending,setPending]=useState(false);
 const [error,setError]=useState('');
 const [reference,setReference]=useState('');
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(pending)return;
  const form=event.currentTarget,body=new FormData(form),cv=body.get('cv');
  setError('');
  if(cv instanceof File&&cv.size>3*1024*1024){setError('Please choose a PDF smaller than 3 MB.');return;}
  setPending(true);
  try{
   const response=await fetch('/api/career-applications',{method:'POST',body});
   const result=await response.json();
   if(!response.ok)throw new Error(result.error||'We could not save your application. Please try again.');
   setReference(result.reference);form.reset();
  }catch(error){setError(error instanceof Error?error.message:'Connection interrupted. Please try again.');}
  finally{setPending(false);}
 }
 return <section className="career-apply" id="apply" aria-labelledby="apply-title">
  <p className="detail-eyebrow">Your next step</p><h2 id="apply-title">Send your portfolio.</h2>
  <p>Introduce yourself for {title}. Share a few relevant projects and tell us about your contribution.</p>
  {reference?<div className="career-apply-success" role="status"><h3>Application received.</h3><p>Your introduction has been saved. We’ll contact you by email if there’s a suitable opportunity.</p><p>Your reference: <strong>{reference}</strong></p><button type="button" onClick={()=>setReference('')}>Submit another introduction</button></div>:
  <form onSubmit={submit} className="career-apply-form" aria-busy={pending}>
   <input type="hidden" name="role" value={slug}/>
   <div className="career-honeypot" aria-hidden="true"><label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
   <div className="career-apply-fields"><label>Full name <span>Required</span><input name="name" autoComplete="name" required maxLength={100} placeholder="Your full name"/></label><label>Email address <span>Required</span><input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com"/></label></div>
   <label>Portfolio or relevant work <span>Required · full URL</span><input name="portfolio" type="url" required maxLength={1500} placeholder="https://your-portfolio.com"/></label>
   <label>Your experience and contribution <span>Required</span><textarea name="message" required minLength={30} maxLength={5000} rows={5} placeholder="Describe your skills, link to relevant projects and explain which parts you made."/></label>
   <label>Availability <span>Optional</span><input name="availability" maxLength={200} placeholder="For example: available from November, 20 hours per week"/></label>
   <label className="career-cv-field">CV or résumé <span>Optional · PDF only · up to 3 MB</span><input name="cv" type="file" accept=".pdf,application/pdf"/></label>
   <label className="career-apply-consent"><input name="consent" type="checkbox" value="yes" required/><span>I agree that Avexium Digital may store these details and contact me about relevant collaborations. <a href="/privacy">Privacy information ↗</a></span></label>
   {error&&<p className="career-apply-error" role="alert">{error}</p>}
   <button className="detail-button" type="submit" disabled={pending}>{pending?'Submitting…':'Submit application'} <span aria-hidden="true">↗</span></button>
   <p className="career-portfolio-note">Submitted directly to Avexium Digital. Please share only work you have permission to disclose.</p>
  </form>}
 </section>;
}
