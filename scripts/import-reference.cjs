const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const presentationScale=.75;
const servicePages=require(path.join(root,'src/data/service-pages.json'));
const source=fs.readFileSync(process.argv[2]||path.join(root,'design-reference/Avexium_Digital2.html'),'utf8');
const write=(file,text)=>fs.writeFileSync(path.join(root,file),text);
let css=[...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m=>m[1]).join('\n');
let markup=source.match(/<body[^>]*>([\s\S]*?)<\/body>/i)[1].replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
let runtime=[...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean).join('\n').replace(/\r\n/g,'\n');
markup=markup.replace(/(<section class="hero"[^>]*><div class="wrap">)\s*<h1>[\s\S]*?<\/h1>\s*<div class="row fade"><p>[\s\S]*?<\/p>/,(_,opening)=>`${opening}<p class="hero-eyebrow">Design &amp; engineering, together.</p><h1><span class="ln"><span style="--d:0">Design. Build. Grow.</span></span></h1><div class="row fade"><p>Brand identities, websites and digital products. Thoughtfully designed, carefully engineered, ready for your next step.</p>`);
// Import only the new Services design; the other five views keep their source.
const servicesReference=fs.readFileSync(path.join(root,'design-reference/Avexium_Digital_services-redesign.html'),'utf8');
const servicesMain=servicesReference.match(/<main class="page" data-r="services">[\s\S]*?<\/main>/)[0];
markup=markup.replace(/<main class="page" data-r="services">[\s\S]*?<\/main>/,()=>servicesMain);
const deckCSS=servicesReference.match(/\/\* services: stacked card deck \*\/[\s\S]*?(?=\/\* work page:)/)[0];
css=css.replace(/\/\* services: pinned stage \*\/[\s\S]*?(?=\/\* work page:)/,()=>deckCSS);
runtime=runtime.replaceAll("$$('.ai')",()=>"$$('.cd')").replaceAll("$$('.ai .tags')",()=>"$$('.cd .tags')").replaceAll("$('.ai.open')",()=>"$('.cd.open')");
runtime=runtime.replace("var y=sx.getBoundingClientRect().top+scrollY+(i+.5)/AI.length*(sx.offsetHeight-innerHeight);", "var deck=$('#deck'),gap=parseFloat(getComputedStyle(deck).rowGap)||0,y=deck.getBoundingClientRect().top+scrollY;for(var k=0;k<i;k++)y+=AI[k].offsetHeight+gap;y-=parseFloat(getComputedStyle(c).top)||80;");
css=css.replace('body,a,button{cursor:none}','body:has(#reference-site),#reference-site a,#reference-site button{cursor:none}');
// Hidden horizontal overflow creates a separate scroll container and prevents
// the viewport-pinned service stage from sticking while window scroll advances.
css=css.replace('overflow-x:hidden','overflow-x:clip');
css+='\nbody[data-r=services] #gl{opacity:.45}@media(max-width:860px){body[data-r=services] #gl{opacity:.3}}\n';
runtime=runtime.replace("$$('.ln>span').forEach", ()=>"$$('h1,h2').forEach(function(h){var lines=Array.from(h.querySelectorAll('.ln'));h.setAttribute('aria-label',lines.length?lines.map(function(l){return l.textContent.trim()}).join(' '):h.textContent.trim())});$$('.ln>span').forEach");
runtime=runtime.replace('function frame(now){','var lastDraw=0;function frame(now){\n if(document.hidden||now-lastDraw<1000/(innerWidth<760?30:45)){requestAnimationFrame(frame);return}lastDraw=now;');
runtime=runtime.replace('renderer.setPixelRatio(Math.min(devicePixelRatio,2))','renderer.setPixelRatio(Math.min(devicePixelRatio,1.5))');
runtime=runtime.replace('gl_PointSize=(1.1+aR*2.3)*uPR*(7./-mv.z)*(1.-uCalm*.2)*(.85+.25*aB);','gl_PointSize=clamp((1.1+aR*2.3)*uPR*(7./max(-mv.z,.12))*(1.-uCalm*.2)*(.85+.25*aB),.6,7.*uPR);');
runtime=runtime.replace('vA=min(vA,1.5);','vA=min(vA,1.5)*step(.12,-mv.z);');
// Match the denser site-wide presentation without CSS zoom, which would change
// the coordinate system used by the pinned sections and particle renderer.
runtime=runtime.replace('pts.scale.setScalar((narrow?.62:1)*kf(KS,mm)*os);',`pts.scale.setScalar(${presentationScale}*(narrow?.62:1)*kf(KS,mm)*os);`);
// Preserve the reference's scroll anchors. Match its 60fps smoothing in elapsed
// time even when this renderer runs at its lower desktop/mobile frame limits.
runtime=runtime.replace('mm+=(tgt-mm)*.07;', 'mm+=(tgt-mm)*(1-Math.pow(.93,dt*60));');
const serviceFrame="if(route==='services'){var q2=sx.getBoundingClientRect(),pp2=clamp(-q2.top/Math.max(sx.offsetHeight-vh,1),0,.999),sb=AI[Math.floor(pp2*AI.length)];spi.style.transform='scaleX('+pp2.toFixed(4)+')';if(!sb.classList.contains('open')){AI.forEach(function(x,i){x.classList.toggle('open',x===sb);RB[i].classList.toggle('on',x===sb)});setTint(sb);pulse=Math.max(pulse,.4)}}";
if(!runtime.includes(serviceFrame))throw new Error('Service scroll stage changed; review before importing.');
runtime=runtime.replace(serviceFrame,`if(route==='services'){
 var deck=$('#deck'),deckTop=deck.getBoundingClientRect().top+scrollY,gap=parseFloat(getComputedStyle(deck).rowGap)||0,offset=deckTop,index=0,blend=0;
 AI.forEach(function(card,i){
  var naturalTop=offset-scrollY,stickyTop=parseFloat(getComputedStyle(card).top)||80;
  card.__naturalTop=naturalTop;offset+=card.offsetHeight+gap;
  var reveal=reduce?1:clamp((vh-naturalTop)/Math.max(vh*.28,1),0,1);
  card.style.opacity=reveal.toFixed(4);card.classList.toggle('in',reveal>0);
  if(naturalTop<=vh*.35)index=i;
  card.__stickyTop=stickyTop;
 });
 var next=Math.min(index+1,AI.length-1);
 if(next!==index)blend=clamp((vh*.9-AI[next].__naturalTop)/Math.max(vh*.55,1),0,1);
 blend=blend*blend*(3-2*blend);var active=blend>.5?next:index;
 if(reduce){index=active;next=active;blend=0;}
 var pp2=clamp((vh-deck.getBoundingClientRect().top)/Math.max(deck.offsetHeight,1),0,1);
 spi.style.transform='scaleX('+pp2.toFixed(4)+')';
 AI.forEach(function(card,i){
  var following=AI[i+1],stack=following?clamp((vh*.7-following.__naturalTop)/Math.max(vh*.55,1),0,1):0;
  card.classList.toggle('open',true);
  card.style.transform=reduce?'none':'translate3d(0,'+((1-Number(card.style.opacity))*36).toFixed(2)+'px,0) scale('+(1-stack*.035).toFixed(4)+')';
  card.style.filter=reduce?'none':'brightness('+(1-stack*.25).toFixed(3)+')';
  RB[i].classList.toggle('on',i===active);
  if(i===active)RB[i].setAttribute('aria-current','step');else RB[i].removeAttribute('aria-current');
 });
 var fromColor=AI[index].dataset.c.split(',').map(Number),toColor=AI[next].dataset.c.split(',').map(Number),serviceColor=fromColor.map(function(c,i){return c+(toColor[i]-c)*blend});
 tint=serviceColor.concat(serviceColor.map(function(c){return c+(1-c)*.5}));
}`);
// Services colour is determined by the same scroll blend as its content, without
// the homepage palette or time-based tint easing leaking into the transition.
runtime=runtime.replace("if(tint)lt=tint;tm+=((route==='services'&&tint?1:0)-tm)*.06;if(lt&&tm>.001)for(kk=0;kk<6;kk++)pv[kk]+=(lt[kk]-pv[kk])*tm;", "if(route==='services'&&tint){pv=tint.slice();tm=1;lt=tint}else{tm+=(0-tm)*.06;if(lt&&tm>.001)for(kk=0;kk<6;kk++)pv[kk]+=(lt[kk]-pv[kk])*tm;}");
markup=markup.replaceAll('hello@avexium.digital','avexiumdigital@gmail.com').replaceAll('careers@avexium.digital','avexiumdigital@gmail.com');
let serviceLinkIndex=0,serviceFocusIndex=0;
markup=markup.replace(/<a class="lk" href="#\/start">Start this project/g,()=>{
 const service=servicePages[serviceLinkIndex++];
 if(!service)throw new Error('Unexpected service detail link in reference.');
 return `<a class="lk service-detail-trigger" href="/services/${service.slug}" aria-label="${service.title} — view service details">View service details`;
});
markup=markup.replace(/<span class="tl"><i><\/i>[^<]*<\/span>/g,()=>`<span class="tl"><i></i>${servicePages[serviceFocusIndex++].focus}</span>`);
markup=markup.replace(/<span class="idx">\d+<\/span>/g,'').replace(/<b id="scur">\d+<\/b>/,'').replace(/(<i id="spi"><\/i><\/div>)<b>10<\/b>/,'$1');
const technicalLabels=['Figma · Design tokens · Responsive layouts','React · TypeScript · CMS & APIs','iOS & Android · React Native / Flutter','Vector assets · Typography · Brand systems','User flows · Prototypes · Component systems','Authentication · Databases · Integrations','Shopify / Headless · Checkout · Inventory','Three.js · WebGL · Optimised 3D assets','Technical SEO · Structured data · Analytics','Workflow APIs · Retrieval · Human review'];
let technicalIndex=0;
markup=markup.replace(/(<article class="cd[^>]*>[\s\S]*?<div class="cdtop">)[\s\S]*?(<\/div><div class="tx"><h3>[^<]*<\/h3>)<p>[\s\S]*?<\/p>/g,(_,start,heading)=>{
 const i=technicalIndex++,service=servicePages[i];
 return `${start}<span class="tl"><i></i>${service.focus}</span><span class="service-tech">${technicalLabels[i]}</span>${heading}<p>${service.summary}</p>`;
});
if(technicalIndex!==10)throw new Error('Expected ten technical service summaries.');
markup=markup.replace('<div class="row" style="justify-content:flex-start;gap:20px;padding-bottom:120px">','<section class="services-outro"><div class="services-outro-copy"><span class="services-eyebrow">Designed together. Built to work.</span><h2>Let’s build<br>what comes next.</h2><p>Bring us the challenge. We will map the scope, technical dependencies and delivery approach around your business.</p></div><div class="btns">').replace(/(<a class="pill ghost" href="#\/work">See our work<\/a>)<\/div>\s*<\/div><\/main>/,'$1</div></section>\n</div></main>');
if(serviceLinkIndex!==servicePages.length||serviceFocusIndex!==servicePages.length)throw new Error('Service overview must match the detail-page catalogue.');
// Share the actual animated specimens with the detail pages instead of creating
// an unrelated visual system. Their CSS animation rules already live in reference.css.
const specimenLines=source.split(/\r?\n/).filter(line=>/<div class="ai(?: open)?"/.test(line));
if(specimenLines.length!==servicePages.length)throw new Error('Expected one reference specimen per service.');
const visuals={};
specimenLines.forEach((line,index)=>{
 const start=line.indexOf('<div class="vis ');
 if(start<0)throw new Error('Missing service specimen.');
 let visual=line.slice(start).trim().replace(/<\/div>$/,'');
 if(servicePages[index].slug==='ai-automation'){
  const dots=Array.from({length:35},(_,i)=>`<i style="--k:${Math.floor(i/7)+i%7}"></i>`).join('');
  visual=visual.replace(/(<div class="vis[^"]*\bv8"[^>]*>)(<\/div>)/,(_,open,close)=>open+dots+close);
 }
 visuals[servicePages[index].slug]=visual;
});
write('src/data/service-visuals.ts',`// Generated from the same specimens as the animated Services overview.\nexport const serviceVisuals:Record<string,string>=${JSON.stringify(visuals)};\n`);
const homeServiceLinks={'Brand identity':'brand-identity','Websites and web apps':'web-development','Product design':'ui-ux-product-design','Motion and 3D':'motion-3d'};
markup=markup.replace(/<a([^>]*?)href="#\/services"([^>]*)>([\s\S]*?)<\/a>/g,(link,before,after,content)=>{
 const title=content.match(/<h3>([^<]+)<\/h3>/)?.[1],slug=homeServiceLinks[title];
 return slug?`<a${before}href="/services/${slug}"${after}>${content}</a>`:link;
});
markup=markup.replace(/<div class="chips" id="need">[\s\S]*?<\/div>/,()=>`<div class="chips" id="need">${servicePages.map(service=>`<button type="button" class="chip" data-service="${service.slug}" aria-pressed="false">${service.title}</button>`).join('')}</div>`);
markup=markup.replace(/<div class="fl">Budget<\/div><div class="chips" id="bud">[\s\S]*?<\/div>/,()=>`<div class="fl">Project stage</div><div class="chips" id="bud">${['Starting something new','Redesigning','Improving an existing product','Exploring options'].map(stage=>`<button type="button" class="chip" aria-pressed="false">${stage}</button>`).join('')}</div>`);
if(/\$\s*\d|\bBudget\b/i.test(markup))throw new Error('Pricing or budget language remains in the active website.');
runtime=runtime.replace("$('#fm').addEventListener",()=>"var requestedService=new URLSearchParams(location.search).get('service');$$('#need .chip').forEach(function(c){if(c.dataset.service===requestedService)c.setAttribute('aria-pressed','true')});$('#fm').addEventListener");
markup=markup.replace('</nav></div></footer>','<a href="/privacy">Privacy</a><a href="/site-information">Site information</a></nav></div></footer>');
const projects=[
 {slug:'tablevori',name:'Tablevori',image:'/projects/tablevori.png',copy:'Independent restaurant operations exploration',tags:'product web',colors:['#35e0c4','#1f6fff','#04202a']},
 {slug:'seluvrane',name:'Seluvrane',image:'/projects/seluvrane.webp',copy:'Independent skincare-commerce exploration',tags:'brand web',colors:['#ffb15c','#ff3d6e','#2a0d12']},
 {slug:'drapeviqa',name:'Drapeviqa',image:'/projects/drapeviqa.png',copy:'Independent fashion-commerce exploration',tags:'brand web',colors:['#ff7ad9','#7a4dff','#1a0a33']},
];
let cardIndex=0;
markup=markup.replace(/<a class="card"[\s\S]*?<\/a>/g,()=>{const p=projects[cardIndex++];if(!p)return '';return `<a class="card" href="/work/${p.slug}" data-cursor="View"><div class="art" style="--a1:${p.colors[0]};--a2:${p.colors[1]};--a3:${p.colors[2]}"><div class="in project-image" style="background-image:url('${p.image}')"></div></div><div class="cap"><h3>${p.name}</h3><span>${p.copy}</span></div></a>`;});
let workIndex=0;
markup=markup.replace(/<li class="wi"[\s\S]*?<\/li>/g,()=>{const p=projects[workIndex++];if(!p)return '';return `<li class="wi" data-t="${p.tags}" data-image="${p.image}" style="--a1:${p.colors[0]};--a2:${p.colors[1]};--a3:${p.colors[2]}"><a href="/work/${p.slug}"><h3>${p.name}</h3><p>${p.copy}</p><span class="yr">Self-initiated</span><span class="ar">→</span></a></li>`;});
runtime=runtime.replace("var names2=['Northfold','Marlow Coffee','Atlas Care','Kiln','Halden Bank','Ostrava Festival']",`var names2=${JSON.stringify(projects.map(p=>p.name))}`);
runtime=runtime.replace("var a=$('.art',wprev);", "var a=$('.art',wprev);$('.in',a).style.backgroundImage='url('+li.dataset.image+')';$('.in',a).classList.add('project-image');");
markup=markup.replace('id="fn" placeholder','id="fn" aria-label="Your name" maxlength="120" placeholder').replace('id="fe" type','id="fe" aria-label="Email address" maxlength="200" type').replace('id="fmsg" placeholder','id="fmsg" aria-label="Tell us about your project" maxlength="6000" placeholder').replace('Send project details','Prepare email draft').replace('<h2>Thank you.</h2><p id="dtxt">We will reply within two working days.</p>','<h2>Your brief is ready.</h2><p id="dtxt" role="status">Open your email app to review and send your enquiry.</p><div class="btns"><a class="pill" id="draft-link" href="mailto:avexiumdigital@gmail.com">Open email draft ↗</a><button type="button" class="pill ghost" id="edit-brief">Edit brief</button></div>');
const fakeSuccess="err.textContent='';$('#dtxt').textContent='Thanks, '+n.split(' ')[0]+'. We will reply to '+m+' within two working days.';$('#st').classList.add('sent');pulse=1";
if(!runtime.includes(fakeSuccess))throw new Error('Source form handler changed; review before importing.');
runtime=runtime.replace(fakeSuccess,()=>`err.textContent='';var services=$$('#need .chip[aria-pressed="true"]').map(function(c){return c.textContent}).join(', ')||'To discuss',stage=$('#bud .chip[aria-pressed="true"]');var brief='Name: '+n+'\\nEmail: '+m+'\\nServices: '+services+'\\nProject stage: '+(stage?stage.textContent:'To discuss')+'\\n\\n'+$('#fmsg').value.trim();$('#draft-link').href='mailto:avexiumdigital@gmail.com?subject='+encodeURIComponent('Project enquiry — '+services)+'&body='+encodeURIComponent(brief);$('#dtxt').textContent='Your details have not been sent or stored. Review the draft in your email app, then send it when you are ready.';$('#st').classList.add('sent');$('#draft-link').focus();pulse=1`);
runtime=runtime.replace("var menu=$('#menu');", "$('#edit-brief').addEventListener('click',function(){$('#st').classList.remove('sent');$('#fn').focus()});var menu=$('#menu');");
markup=markup.replace('class="mob"','class="mob" id="mobile-menu" inert aria-hidden="true"').replace('id="menu"','id="menu" aria-controls="mobile-menu" aria-expanded="false"');
runtime=runtime.replace("document.body.classList.toggle('menu-open')", "document.body.classList.toggle('menu-open');var open=document.body.classList.contains('menu-open');menu.setAttribute('aria-expanded',String(open));$('.mob').inert=!open;$('.mob').setAttribute('aria-hidden',String(!open))");
runtime=runtime.replace("document.body.classList.remove('menu-open');if(r===route)", "document.body.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');$('.mob').inert=true;$('.mob').setAttribute('aria-hidden','true');if(r===route)");
runtime=runtime.replace("route=r;document.body.dataset.r=r;setActive();", "route=r;document.body.dataset.r=r;document.title=r==='home'?'Avexium Digital — brand design, websites and software':names[r]+' — Avexium Digital';setActive();");
runtime=runtime.replace("cv.className='';busy=false}", "cv.className='';busy=false;if(hashRoute()!==route)go()}");
runtime=runtime.replace("addEventListener('hashchange',go);", "window.__avexiumRoute=go;addEventListener('hashchange',go);");
runtime=runtime.replace("requestAnimationFrame(frame);\n})();", "requestAnimationFrame(frame);\nif(hashRoute()!=='home')go();\nwindow.__avexiumReferenceReady=true;\n})();");
runtime=runtime.replace('addEventListener(\'resize\',size);size();', "addEventListener('resize',size);size();if(document.fonts)document.fonts.ready.then(measure);");
markup=require('./site-content.cjs')(markup);
({markup,runtime}=require('./launch-readiness.cjs')({markup,runtime}));
write('public/reference/enquiry.js',"(function(){var $=function(s){return document.querySelector(s)},$$=function(s){return Array.from(document.querySelectorAll(s))},pulse=0;\n"+require('./enquiry-runtime.cjs')+'\n})();');
runtime=runtime.replace(/var names2=\[[^\]]*\],mq=/,()=>`var names2=${JSON.stringify(['Brand identity','Website design','Web development','Product design','AI & automation','Motion & 3D'])},mq=`);
runtime=runtime.replace("['Websites',1","['Web development',1").replace("['Campaigns',3","['AI & automation',3");
runtime=runtime.replace("w.style.animationDelay=i*60+'ms'}})})});",()=>"w.style.animationDelay=i*60+'ms'}});$('#work-empty').hidden=$$('.wi').some(function(w){return !w.hidden})})});");
css=`@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Manrope:wght@500;600&display=swap');\n${css}\n`;
css+='\n#sx .service-detail-trigger{display:inline-flex;align-items:center;justify-content:center;gap:24px;min-height:60px;padding:12px 24px;border:1px solid rgba(255,255,255,.8);border-radius:999px;background:#f4f5f7;color:#06070a;font-size:16px;font-weight:500}#sx .service-detail-trigger .ar{width:auto;height:auto;border:0;border-radius:0;font-size:20px}#sx .service-detail-trigger:hover{background:var(--sc);border-color:var(--sc)}#sx .service-detail-trigger:hover .ar{background:none;color:inherit;transform:translate(3px,-3px)}\n';
css+='\n#sx .ai{transition:none;will-change:transform,opacity}#sx .open .hd h3,#sx .open .tx p,#sx .open .lk{transition:none;opacity:1;transform:none;filter:none}#sx .open .tl,#sx .open .tags span,#sx .open .vis{animation:none;opacity:1}#sx .ai:not(.open){visibility:hidden}@media(prefers-reduced-motion:reduce){#sx .ai{transform:none!important}}\n';
// The stage has only absolutely positioned children, so auto margins on .wrap
// otherwise shrink its intrinsic width to its padding. Keep stage sizing separate
// from the brand specimen's .sw swatches, which share the original short name.
css+=`\n#sx>.pin>.wrap.sw{width:100%;min-width:0}#sx>.pin>.wrap.sw>.sc{min-width:0;width:100%}#sx .ai{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr)}#sx .tx,#sx .vis{min-width:0}#sx .v1 .sw{flex:none;min-height:auto;padding:0}#sx .v3 svg{width:100%;height:auto}@media(max-width:860px){#sx .ai{grid-template-columns:minmax(0,1fr)}#sx>.pin>.wrap.sw{padding:76px 0 38px}#sx .tx{gap:14px}#sx .hd{gap:12px}#sx .ft{gap:14px}#sx .tags span{padding:6px 11px;font-size:13px}#sx .vis{height:170px}#sx .v10 .pn{height:164px;width:90px}#sx .v1 .sw{padding:0}}\n`;
css+=`.project-image{background-size:cover!important;background-position:center top!important;background-repeat:no-repeat!important}.art .in.project-image::after{display:none}.done .btns{margin-top:28px}.wi[hidden]{display:none!important}.webgl-fallback #gl,.webgl-fallback #pre,.webgl-fallback #cur{display:none}.webgl-fallback,.webgl-fallback a,.webgl-fallback button{cursor:auto!important}.reference-load-error{padding:20vh 8vw;position:relative;z-index:200;background:#06070a;color:white}.reference-load-error a{text-decoration:underline}.document-brand{display:block;margin:35px clamp(20px,4.5vw,64px);font-size:15px;letter-spacing:.25em}.legal-layout{max-width:1000px;padding:75px clamp(20px,4.5vw,64px) 120px;margin:auto}.legal-layout h1{font-size:clamp(42px,6vw,80px);margin:25px 0}.legal-layout header>p{margin:30px 0;max-width:60ch}.legal-layout article{margin-top:55px}.legal-layout article section{border-top:1px solid var(--line);padding:30px 0}.legal-layout h2{font-size:28px;margin-bottom:18px}.legal-layout article p{max-width:65ch}.legal-layout a{text-decoration:underline}.legal-layout .section-label{color:var(--mut);font-size:12px;letter-spacing:.15em}\n`;
write('src/app/reference.css',css);
write('src/data/reference-markup.ts',`// Imported from the user-supplied Avexium_Digital2 (6).html.\nexport const referenceMarkup=${JSON.stringify(markup)};\n`);
css+='\nhtml{overflow-x:visible}footer nav{flex-wrap:wrap;max-width:100%}.webgl-fallback #cv{display:none}.webgl-fallback .ch,.webgl-fallback .fade,.webgl-fallback [data-rv]{transform:none!important;opacity:1!important;clip-path:none!important}.webgl-fallback .hero .wrap{opacity:1!important;filter:none!important}\n';
// Scale presentation dimensions, keeping breakpoints and full-viewport scroll
// stages unchanged. Protect asset URLs so embedded SVGs remain byte-for-byte intact.
const assetUrls=[];
css=css.replace(/url\((?:[^()"']|"[^"]*"|'[^']*')*\)/g,url=>`AVEXIUM_ASSET_${assetUrls.push(url)-1}`);
css=css.replace(/\{([^{}]*)\}/g,(rule,declarations)=>'{'+declarations.replace(/([\w-]+)\s*:\s*([^;{}]+)/g,(declaration,property,value)=>{
 const fullStage=/^(?:min-)?height$/.test(property)&&/^(?:100(?:s)?vh|\d{3,}(?:s)?vh|calc\(100svh)/.test(value.trim());
 return property+':'+value.replace(/(-?\d*\.?\d+)(px|vw|vh|svh)\b/g,(length,number,unit)=>fullStage?length:`${Number((Number(number)*presentationScale).toFixed(3))}${unit}`);
})+'}');
css=css.replace(/AVEXIUM_ASSET_(\d+)/g,(_,index)=>assetUrls[Number(index)]);
css+=`\n/* A single-line, left-aligned home headline, independent of the scene scale. */
.page[data-r=home] .hero{justify-content:flex-start;align-items:flex-end;padding-bottom:clamp(48px,9vh,100px)}
.page[data-r=home] .hero>.wrap{width:100%;max-width:none;margin:0;padding-inline:clamp(24px,3.375vw,48px);text-align:left}
.page[data-r=home] .hero h1{font-family:'Manrope','Helvetica Neue',Arial,sans-serif;font-weight:600;font-size:clamp(26px,7vw,100px);line-height:1.12;letter-spacing:-.055em;max-width:none;white-space:nowrap}
.page[data-r=home] .hero h1 .ln{display:block;overflow:hidden}.page[data-r=home] .hero h1 .wb{white-space:nowrap}
.page[data-r=home] .hero-eyebrow{font-size:11px;line-height:1.5;letter-spacing:.13em;text-transform:uppercase;color:rgba(244,245,247,.65);margin-bottom:24px;max-width:none}
.page[data-r=home] .hero .row{flex-direction:column;align-items:flex-start;justify-content:flex-start;gap:24px;margin-top:26px;max-width:560px}
.page[data-r=home] .hero .row>p{font-size:clamp(15px,1.35vw,18px);line-height:1.7;max-width:49ch}.page[data-r=home] .hero .btns{justify-content:flex-start}
@media(max-width:600px){.page[data-r=home] .hero{padding-bottom:70px}.page[data-r=home] .hero-eyebrow{font-size:9px;letter-spacing:.11em;margin-bottom:18px}.page[data-r=home] .hero .row{margin-top:20px;gap:22px}.page[data-r=home] .hero .row>p{font-size:14px;max-width:36ch}}
`;
css+=`\n/* Premium Services deck; viewport sections remain exactly one screen. */
.page[data-r=services]>.wrap{max-width:1280px;width:100%;padding-inline:clamp(22px,5vw,72px)}
.page[data-r=services] .ph{min-height:100vh;min-height:100svh;display:flex;flex-direction:column;justify-content:center;padding:110px 0 72px;position:relative}
.page[data-r=services] .ph::after{content:'Explore our capabilities ↓';position:absolute;bottom:38px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--mut)}
.page[data-r=services] .ph h1{font-size:clamp(64px,11vw,150px);letter-spacing:-.065em}
.page[data-r=services] .ph p{max-width:44ch;font-size:clamp(17px,1.7vw,22px);line-height:1.6}
#sx{height:auto;padding:0 0 60px}#deck{gap:clamp(48px,10vh,100px);margin-top:0;padding-bottom:30px}
#sx .cd{top:calc(82px + min(var(--i,0)*7px,63px));border-radius:26px;min-height:min(70svh,650px);padding:clamp(26px,3.8vw,52px);grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:28px 44px;background:linear-gradient(145deg,rgba(255,255,255,.055),transparent 55%),rgba(9,11,16,.92);box-shadow:0 24px 80px -30px #000,inset 0 1px 0 rgba(255,255,255,.12);backdrop-filter:blur(28px)}
#sx .cd.in{animation:none}#sx .cd .vis{animation:none;opacity:1;min-width:0}#sx .cd .tx{min-width:0}#sx .cd h3{font-size:clamp(30px,3.8vw,54px);line-height:1.05}
#sx .cd p{font-size:15px;line-height:1.75;max-width:48ch}#sx .cdtop{justify-content:flex-start;flex-wrap:wrap;gap:12px 20px}
#sx .tl{font-size:11px;white-space:normal}#sx .service-tech{font-size:11px;line-height:1.6;color:rgba(244,245,247,.52);letter-spacing:.02em}
#sx .tags{flex-wrap:wrap;gap:7px}#sx .tags span{font-size:11px;padding:6px 10px}#sx .v1 .sw{padding:0;min-height:0;flex:none}#sx .v3 svg{width:100%;height:auto}#sx .vis{height:260px}
#sx .sf{margin-top:36px}.services-outro{min-height:100vh;min-height:100svh;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:34px;padding:100px 0;position:relative;border-top:1px solid var(--line)}
.services-eyebrow{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--mut)}.services-outro h2{font-size:clamp(48px,7vw,100px);letter-spacing:-.055em;margin:24px 0}.services-outro p{font-size:16px;line-height:1.7;max-width:48ch}
@media(max-width:860px){#sx .cd{grid-template-columns:minmax(0,1fr);padding:24px;min-height:0;gap:20px;top:calc(72px + min(var(--i,0)*4px,36px))}#sx .cdtop{order:0}#sx .cd .tx{order:1}#sx .cd .vis{order:2;height:160px}#sx .cd h3{font-size:32px}#sx .cd p{font-size:14px;line-height:1.65}#sx .cd .ft{gap:18px}#sx .v10 .pn{height:150px;width:85px}#sx .v4,#sx .v5{width:150px;margin:auto}#sx .service-detail-trigger{min-height:44px}.services-outro h2{font-size:52px}}
@media(max-width:860px) and (max-height:740px){#sx .cd{position:relative;top:0}}
@media(prefers-reduced-motion:reduce){#sx .cd{transform:none!important;filter:none!important;opacity:1!important}}
`;
write('src/app/reference.css',css);
runtime=runtime.replace("sv+=((route==='services'?1:0)-sv)*.045;", "sv+=(((route==='services'||route==='start')?1:0)-sv)*.045;");
runtime=runtime.replace('careers:[5,5]','careers:[0,4]');
runtime=runtime.replace('function size(){',()=>require('./careers-scene.cjs')+'\nfunction size(){');
runtime=runtime.replace('renderer.render(fs,cam);renderer.render(scene,cam);',"pts.visible=route!=='careers';careerPoints.visible=route==='careers';careerVeil.visible=careerPoints.visible;if(careerPoints.visible)updateCareerScene(y);renderer.render(fs,cam);renderer.render(scene,cam);");
runtime=runtime.replace('window.__avexiumRoute=go;',`var careerJump=$('[data-career-jump]');if(careerJump)careerJump.addEventListener('click',function(){var target=$('#career-roles'),y=target.getBoundingClientRect().top+scrollY-85;if(lenis)lenis.scrollTo(y,{duration:1.4});else scrollTo({top:y,behavior:reduce?'instant':'smooth'});});window.__avexiumRoute=go;`);
runtime=runtime.replace('window.__avexiumRoute=go;',()=>require('./careers-search.cjs')+'\nwindow.__avexiumRoute=go;');
runtime=runtime.replace('var vl=lenis?lenis.velocity:0;',`if(route==='careers'){pts.position.x=narrow?0:1.8;pts.position.y=narrow?-.8:0;var story=$('#career-story');if(story){var cr=story.getBoundingClientRect(),cp=clamp(-cr.top/Math.max(story.offsetHeight-innerHeight,1),0,.999),ci=Math.floor(cp*3);document.querySelectorAll('.career-chapters article').forEach(function(el,i){el.classList.toggle('on',reduce||i===ci);el.setAttribute('aria-hidden',reduce||i===ci?'false':'true');});}}
 var vl=lenis?lenis.velocity:0;`);
runtime=runtime.replace('var vl=lenis?lenis.velocity:0;',`if(route==='start'){pts.position.set(0,narrow?.9:0,0);pts.scale.setScalar(.75*(narrow?.62:1)*1.3);pts.rotation.set(.5+myn*.06,-.32+mxn*.12,0);}
 var vl=lenis?lenis.velocity:0;`);
runtime=runtime.replace("var nmc=$('#nm').getContext('2d');nmc.fillStyle='#fff';for(i=0;i<ord.length;i+=2){var n2=ord[i];nmc.fillRect(34+lx(n2)*31,34-ly(n2)*31,2,2)}",`var nmc=$('#nm').getContext('2d');function drawNavMark(time){nmc.clearRect(0,0,68,68);nmc.fillStyle='#fff';var t=reduce?0:time*.001,spin=Math.sin(t*.45)*.055,c=Math.cos(spin),s=Math.sin(spin);for(var j=0;j<ord.length;j+=2){var n=ord[j],x=lx(n),y=ly(n),breathe=1+(reduce?0:.025*Math.sin(t*1.2+x*3+y*2));nmc.globalAlpha=.7+.3*Math.sin(t*.8+j*.2);nmc.fillRect(34+(x*c-y*s)*29*breathe,34-(x*s+y*c)*29*breathe,1.65,1.65);}nmc.globalAlpha=1;}drawNavMark(0);`);
runtime=runtime.replace('lastDraw=now;','lastDraw=now;drawNavMark(now);');
write('public/reference/runtime.js',`/* User-supplied particle design with routing, contact and accessibility integration. */\ntry {\n${runtime}\n} catch(error) {\n console.error('Avexium scene initialization failed',error);document.body.classList.add('loaded','webgl-fallback');window.removeEventListener('hashchange',window.__avexiumRoute);\n const selectPage=()=>{const route=location.hash.replace(/^#\\/?/,'')||location.pathname.split('/').filter(Boolean).join('/')||'home';const pages=[...document.querySelectorAll('.page')];const valid=pages.some(p=>p.dataset.r===route);for(const page of pages)page.classList.toggle('on',page.dataset.r===(valid?route:'home'));document.body.classList.remove('menu-open');const mobile=document.querySelector('.mob');if(mobile){mobile.inert=true;mobile.setAttribute('aria-hidden','true')}window.scrollTo(0,0);};\n window.addEventListener('hashchange',selectPage);selectPage();\n}\n`);
// Detail pages use the exact particle shader from the shared design, without
// mounting the overview's router, hidden pages, or scene-specific DOM.
const shaderStart=runtime.indexOf("vertexShader:'attribute vec3 p1");
const shaderBlock=runtime.slice(shaderStart,runtime.indexOf('pts.frustumCulled',shaderStart));
const shaderParts=shaderBlock.split('fragmentShader:');
const joinShader=expression=>[...expression.matchAll(/'([^']*)'/g)].map(match=>match[1]).join('');
const vertexShader=joinShader(shaderParts[0]),fragmentShader=joinShader(shaderParts[1]);
if(!vertexShader.includes('uS*1.6-aR*.6')||!fragmentShader.includes('gl_PointCoord'))throw new Error('Shared particle shader extraction failed.');
write('src/data/service-particle-shaders.ts',`// Generated from the main website particle renderer.\nexport const vertexShader=${JSON.stringify(vertexShader)};\nexport const fragmentShader=${JSON.stringify(fragmentShader)};\n`);
const logoBytes=Buffer.from(source.match(/var raw=atob\('([^']+)'\)/)[1],'base64');
let logoPath='';
for(let i=0;i+3<logoBytes.length;i+=16){const x=34+(logoBytes.readUInt16LE(i)/65535*2-1)*31,y=34-(logoBytes.readUInt16LE(i+2)/65535*2-1)*31;logoPath+=`M${x.toFixed(2)} ${y.toFixed(2)}h2v2h-2z`;}
write('public/reference/brand-mark.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 68"><path fill="white" d="${logoPath}"/></svg>`);
console.log('Imported six-page particle design and direct enquiry integration.');
