// Customer-facing copy and section structure, applied after the design import.
const escape=text=>text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const heading=(text,classes='big')=>`<h2 class="${classes}"><span class="ln sc"><span>${escape(text)}</span></span></h2>`;
const intro=(label,title,description)=>`<div class="section-intro"><p class="section-eyebrow">${escape(label)}</p>${heading(title)}<p class="section-description">${escape(description)}</p></div>`;
module.exports=function rewriteSiteContent(markup){
 const page=(name,edit)=>{const pattern=new RegExp(`<main class="page(?: on)?" data-r="${name}">[\\s\\S]*?<\\/main>`);if(!pattern.test(markup))throw new Error('Missing content page: '+name);markup=markup.replace(pattern,edit);};
 page('home',html=>{
  html=html.replace('Design. Build. Grow.','Built for your business.').replace('Design &amp; engineering, together.','Avexium Digital / Design &amp; development');
  html=html.replace('Brand identities, websites and digital products. Thoughtfully designed, carefully engineered, ready for your next step.','Websites, brand identities and software for restaurants, retailers and service businesses. Designed around your customers. Built around the way you operate.');
  html=html.replace(/<section><div class="wrap"><p class="statement" id="stmt">[\s\S]*?<\/p><\/div><\/section>/,()=>`<section class="studio-intro"><div class="wrap"><p class="section-eyebrow">What we do</p><p class="statement" id="stmt">Your website is often where a customer decides whether to book, buy or get in touch. We design that experience—and build the content tools, integrations and software that keep it running.</p><a class="studio-about-link" href="/about">About Avexium <span aria-hidden="true">↗</span></a></div></section>`);
  html=html.replace(/(<section id="svc"[^>]*><div class="wrap">)[\s\S]*?(<ul class="svc">)/,(_,open,list)=>open+intro('Our expertise','Design and development.','From a first identity to a working storefront, we handle the design and the build. Start with a single service or commission a project that brings them together.')+list);
  const descriptions={
   'Brand identity':['A logo, type system and visual language your team can use across packaging, screens and print. Delivered with the files and guidance to keep it consistent.','Visual identity · Art direction · Brand guidelines'],
   'Websites and web apps':['Business websites, online stores and web applications. We design the pages, develop the functionality and connect the content and tools your team needs.','Website design · Development · CMS & integrations'],
   'Product design':['Interfaces for booking, purchasing, account management and daily operations. Flows, prototypes and component libraries that give developers a complete specification.','UX strategy · Interface design · Design systems'],
   'Motion and 3D':['Product animation, interactive 3D and scroll-driven websites. Art direction and real-time graphics developed together, with performance considered from the start.','WebGL experiences · 3D visuals · Brand motion']
  };
  html=html.replace(/(<h3>([^<]+)<\/h3>)<p>[^<]*<\/p>/g,(all,h,title)=>descriptions[title]?`${h}<p>${escape(descriptions[title][0])}<span class="capability-disciplines">${escape(descriptions[title][1])}</span></p>`:all);
  html=html.replace(/(<div class="wrap" style="width:100%">)<h2 class="big"[^>]*><span class="ln sc"><span>Selected work<\/span><\/span><\/h2>/,(_,open)=>open+intro('Selected work','Selected design studies.','Three self-initiated projects: a restaurant service interface and two retail storefronts. Explore the brief, the layout decisions and what each concept would need for production.'));
  html=html.replace(/(<section id="logo"[\s\S]*?<div class="wrap"[^>]*>)\s*<h2>[\s\S]*?<\/h2>\s*<div class="row"><p>[\s\S]*?<\/p>/,(_,open)=>`${open}<p class="section-eyebrow">Brand systems</p>${heading('Recognisable wherever you appear.','identity-heading')}<div class="row"><p>Your website, packaging and presentations should belong to the same business. We develop the typography, colour, composition and asset rules that make that possible.</p>`);
  const phases=[
   ['Define','We review your business, current website and customer needs. Together we agree what the project includes, who supplies what and how the finished work will be reviewed.'],
   ['Design','We work through page structure and visual direction before detailed layouts. You review prototypes with realistic content, including the mobile experience.'],
   ['Build','We build the approved designs, connect your content and integrations, and share working previews. Testing covers the main tasks, device layouts and failure states.'],
   ['Launch','We complete the release checks, deploy the project and hand over the source files and operating notes. Account ownership and ongoing responsibilities are agreed before launch.']
  ];
  html=html.replace(/<div class="words" id="words">[\s\S]*?<\/div>/,()=>`<div class="words" id="words">${phases.map(([title],i)=>`<span${i===0?' class="on"':''}>${title}</span>`).join('')}</div>`);
  html=html.replace(/<ul class="plist" id="plist">[\s\S]*?<\/ul>/,()=>`<ul class="plist" id="plist"><div class="bar"></div>${phases.map(([title,copy],i)=>`<li${i===0?' class="on"':''}><b>${title}</b><p>${copy}</p></li>`).join('')}</ul>`);
  html=html.replace(/(<section id="hcta"[\s\S]*?<div class="wrap">)\s*<h2>[\s\S]*?<\/h2>/,(_,open)=>open+intro('Start a conversation','Tell us what you’re planning.','A new website, a rebrand or software for your team? Send a short outline of the work, your current setup and any dates we should know about.'));
  return html;
 });
 page('services',html=>{
  html=html.replace('Everything a brand needs to launch and grow, handled by one team that designs and builds.','Brand identity, websites, applications and business software. See what each service covers, the technology involved and the materials you receive at handover.').replace('Designed together. Built to work.','Design, development and the details between.').replace('Let’s build<br>what comes next.','What does your<br>project need?').replace('Bring us the challenge. We will map the scope, technical dependencies and delivery approach around your business.','Share the problem, your existing website or software, and the features you have in mind. We’ll discuss which services fit and what needs to happen first.');
  const summaries={
  "Website design": "Website design starts with what your visitors need to find, understand and do. We organise the pages and content, establish the visual direction and deliver responsive Figma layouts ready for development.",
  "Web development": "We build business websites and web applications, from content-managed sites to customer portals. The work includes the interface, CMS, APIs and integrations your project needs, with source code and setup documentation at handover.",
  "App development": "iOS and Android applications for customer services, internal tools and digital products. We plan the core tasks, connect the backend and device features, and prepare tested builds for distribution.",
  "Brand identity": "An identity your team can put to work. We develop the mark, typography, colour palette and layout rules, then supply the master files, exports and application guidance for digital and print.",
  "UI/UX and product design": "We work through how a product behaves before the development begins. User flows, interactive prototypes and component specifications cover the main tasks as well as errors, permissions and missing data.",
  "Custom software": "Software for the work spreadsheets and disconnected tools no longer handle well. We map your records, roles and approvals, then develop the dashboards, portals and integrations around that process.",
  "E-commerce": "Online stores built around your catalogue and the way you fulfil orders. We handle storefront design and development, product structure and platform integrations, with checkout and order handling tested before launch.",
  "Motion and 3D": "Animation and interactive 3D for websites, products and brand communication. We develop the visual direction and assets, build the motion and prepare versions suited to the devices and channels where it will appear.",
  "SEO and digital marketing": "We work on how your website is found and how enquiries or purchases are measured. The scope can include technical SEO, page content, campaign landing pages and analytics configuration, based on the gaps in your current setup.",
  "AI and automation": "Automation for repeatable tasks such as routing enquiries, updating records and preparing information for review. We connect your existing tools and use AI where the task benefits from it, with permissions, validation and review steps defined in advance."
};
  return html.replace(/(<div class="tx"><h3>([^<]+)<\/h3>)<p>[\s\S]*?<\/p>/g,(all,open,title)=>summaries[title]?`${open}<p>${escape(summaries[title])}</p>`:all);
 });
 page('work',require('./work-content.cjs'));
 page('process',html=>{
  html=html.replace('Four steps, each with a clear outcome, so you always know what happens next.','You review the direction before we build, and the working product before it goes live. Each stage has defined outputs, review points and responsibilities.');
  const phases=[
   ['Discovery & scope','Define','Review business goals, users and existing systems','Agree deliverables, dependencies and responsibilities','Set priorities and acceptance criteria'],
   ['Experience & direction','Design','Map content, journeys and interaction states','Review visual direction and responsive prototypes','Resolve design decisions before implementation'],
   ['Implementation & validation','Build','Develop interfaces, data models and integrations','Review working previews with realistic content','Check permissions, errors, accessibility and devices'],
   ['Release & handover','Launch','Complete the agreed release checks','Prepare source files, assets and operating guidance','Confirm ownership, maintenance and any support scope']
  ];
  let index=0;
  return html.replace(/(<article class="stk"[^>]*>)[\s\S]*?<\/article>/g,(_,open)=>{const [label,title,...items]=phases[index++];return `${open}<span class="wk">${label}</span><h3>${title}</h3><ul>${items.map(item=>`<li>${item}</li>`).join('')}</ul></article>`;});
 });
 page('careers',require('./careers-content.cjs'));
 page('start',html=>{
  html=html.replace(/(<div class="st" id="st">)\s*<h1>[\s\S]*?<\/h1>/,(_,open)=>`${open}<div class="brief-intro"><p class="section-eyebrow">Start a conversation</p><h1><span class="ln sc"><span>What are you planning?</span></span></h1><p>Tell us what you need and what you have in place. You don’t need a finished specification—an outline of the business, the problem and the intended result is enough to start.</p><div class="brief-guidance"><p>A useful starting point</p><ul><li><strong>Your goals</strong><span>What should change for your customers or your team?</span></li><li><strong>Your starting point</strong><span>Share your website, existing designs or systems.</span></li><li><strong>Your priorities</strong><span>Mention essential features, dependencies or target dates.</span></li></ul></div><a href="mailto:avexiumdigital@gmail.com">avexiumdigital@gmail.com</a></div>`);
  html=html.replace(/<input class="fi" id="fn"[^>]*>/,field=>`<label class="form-field"><span>Your name</span>${field}</label>`).replace(/<input class="fi" id="fe"[^>]*>/,field=>`<label class="form-field"><span>Email address</span>${field}</label>`).replace(/<textarea class="fi" id="fmsg"[^>]*>[\s\S]*?<\/textarea>/,field=>`<label class="form-field"><span>Project overview</span>${field.replace(/aria-label="[^"]*"/,'aria-label="Project overview"').replace(/placeholder="[^"]*"/,'placeholder="Describe your goals, main requirements, existing systems and important dates."')}</label>`);
  html=html.replace('What do you need?','What can we help you with? <span class="field-hint">Choose one or more services. You can leave this open if you’re unsure.</span>').replace('Project stage','Where are you starting? <span class="field-hint">Choose the closest fit — an early idea is enough.</span>');
  html=html.replace('<form class="fm" id="fm" novalidate>','<form class="fm" id="fm" novalidate><div class="enquiry-form-heading"><p class="section-eyebrow">Your project brief</p><h2>Send your project enquiry.</h2><p>Include your website, main requirements and any launch dates. Leave out anything you haven’t decided yet.</p></div>');
  html=html.replace('placeholder="Describe your goals, main requirements, existing systems and important dates."','placeholder="I’m looking to…\nThe main goal is…\nMy current website or setup is…"');
  html=html.replace('<div><button class="pill" type="submit">Prepare email draft</button></div>','<p class="form-note">Your brief opens as a draft in your email app. Review it and send it to Avexium when you are ready.</p><div><button class="pill" type="submit">Prepare email draft</button></div>');
  return html;
 });
 if(/\bWeek(?:s)?\s+\d|next spark|Every spark starts|small, senior studio|Open roles/.test(markup))throw new Error('Unreviewed reference copy remains in public content.');
 return markup;
};
