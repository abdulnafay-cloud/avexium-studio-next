module.exports=String.raw`
(function(){
 var form=$('#fm');if(!form||form.dataset.enquiryReady)return;form.dataset.enquiryReady='true';var pending=false,key=crypto.randomUUID();
 form.addEventListener('submit',async function(event){
  event.preventDefault();if(pending)return;
  var name=$('#fn').value.trim(),email=$('#fe').value.trim(),message=$('#fmsg').value.trim(),error=$('#err'),button=form.querySelector('button[type=submit]');
  if(name.length<2){error.textContent='Enter your full name.';$('#fn').focus();return;}
  if(!/^\S+@[^\s@]+\.[^\s@]+$/.test(email)){error.textContent='Enter a valid email address.';$('#fe').focus();return;}
  if(message.length<30){error.textContent='Tell us a little more about your project (at least 30 characters).';$('#fmsg').focus();return;}
  if(!$('#enquiry-consent').checked){error.textContent='Please agree to the privacy information before submitting.';$('#enquiry-consent').focus();return;}
  var services=$$('#need .chip[aria-pressed="true"]').map(function(chip){return chip.dataset.service||chip.textContent.trim();}),stage=$('#bud .chip[aria-pressed="true"]');
  error.textContent='';pending=true;button.disabled=true;button.textContent='Submitting…';
  try{
   var response=await fetch('/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idempotencyKey:key,name:name,email:email,message:message,services:services,stage:stage?stage.textContent.trim():'Exploring options',consent:true,website:$('#enquiry-website').value})});
   var result=await response.json();if(!response.ok)throw new Error(result.error||'Your enquiry could not be saved. Please try again.');
   $('#dtxt').textContent='Your enquiry has been received. Reference: '+result.reference+'. We’ll review your brief and contact you using the email you provided.';
   $('#st').classList.add('sent');$('#dtxt').setAttribute('tabindex','-1');$('#dtxt').focus();key=crypto.randomUUID();pulse=1;
  }catch(problem){error.textContent=problem.message||'Connection interrupted. Please try again.';}
  finally{pending=false;button.disabled=false;button.textContent='Send project enquiry';}
 });
 $('#edit-brief').addEventListener('click',function(){$('#st').classList.remove('sent');form.reset();$$('#need .chip,#bud .chip').forEach(function(chip){chip.setAttribute('aria-pressed','false');});$('#fn').focus();});
})();
`;
