// Customer-facing copy and section structure, applied after the design import.
const escape=text=>text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const heading=(text,classes='big')=>`<h2 class="${classes}"><span class="ln sc"><span>${escape(text)}</span></span></h2>`;
const intro=(label,title,description)=>`<div class="section-intro"><p class="section-eyebrow">${escape(label)}</p>${heading(title)}<p class="section-description">${escape(description)}</p></div>`;
module.exports=function rewriteSiteContent(markup){
 const page=(name,edit)=>{const pattern=new RegExp(`<main class="page(?: on)?" data-r="${name}">[\\s\\S]*?<\\/main>`);if(!pattern.test(markup))throw new Error('Missing content page: '+name);markup=markup.replace(pattern,edit);};
 page('home',html=>{
  html=html.replace('Design. Build. Grow.','From idea to launch.').replace('Design &amp; engineering, together.','Avexium Digital — Design &amp; technology');
  html=html.replace('Brand identities, websites and digital products. Thoughtfully designed, carefully engineered, ready for your next step.','Give your business a clear identity and a stronger digital presence. We design brands, build websites and develop software that makes everyday work simpler.');
  html=html.replace(/<section><div class="wrap"><p class="statement" id="stmt">[\s\S]*?<\/p><\/div><\/section>/,()=>`<section class="studio-intro"><div class="wrap"><p class="section-eyebrow">What we do</p><p class="statement" id="stmt">Avexium Digital brings brand design, web development and product engineering into one project workflow. We define the requirements, design the experience and build the systems needed to support it.</p></div></section>`);
  html=html.replace(/(<section id="svc"[^>]*><div class="wrap">)[\s\S]*?(<ul class="svc">)/,(_,open,list)=>open+intro('Our expertise','Design meets technology.','We build the way your business looks, feels and works — through distinctive identities, thoughtful websites and intuitive digital products.')+list);
  const descriptions={
   'Brand identity':['A recognisable identity with a clear point of view. We shape the visual language that brings your business into focus, wherever people encounter it.','Visual identity · Art direction · Brand guidelines'],
   'Websites and web apps':['An expressive presence, built to work beautifully. We pair thoughtful design with reliable development to turn visits into meaningful interactions.','Website design · Development · CMS & integrations'],
   'Product design':['Complexity made intuitive. We turn customer needs and business requirements into clear journeys, purposeful interfaces and cohesive digital products.','UX strategy · Interface design · Design systems'],
   'Motion and 3D':['Another dimension to your story. We use movement, depth and interaction to make your brand and products feel tangible on screen.','WebGL experiences · 3D visuals · Brand motion']
  };
  html=html.replace(/(<h3>([^<]+)<\/h3>)<p>[^<]*<\/p>/g,(all,h,title)=>descriptions[title]?`${h}<p>${escape(descriptions[title][0])}<span class="capability-disciplines">${escape(descriptions[title][1])}</span></p>`:all);
  html=html.replace(/(<div class="wrap" style="width:100%">)<h2 class="big"[^>]*><span class="ln sc"><span>Selected work<\/span><\/span><\/h2>/,(_,open)=>open+intro('Selected work','Projects in practice.','Independent concepts exploring restaurant operations, skincare commerce and fashion retail. These projects show our approach to interfaces and digital experiences.'));
  html=html.replace(/(<section id="logo"[\s\S]*?<div class="wrap"[^>]*>)\s*<h2>[\s\S]*?<\/h2>\s*<div class="row"><p>[\s\S]*?<\/p>/,(_,open)=>`${open}<p class="section-eyebrow">Brand systems</p>${heading('Built to stay consistent.','identity-heading')}<div class="row"><p>A logo is one part of the system. Typography, colour, layout and usage rules help your brand stay recognisable across websites, products and everyday communication.</p>`);
  const phases=[
   ['Define','A clear direction starts with the right questions. We understand your business, your audience and the challenge, then shape a focused brief.'],
   ['Design','We give the direction a visual form. Concepts become layouts, prototypes and a coherent design system, refined with your feedback.'],
   ['Build','The design becomes a working experience. We develop the interfaces, connect the systems and test how everything performs together.'],
   ['Launch','We prepare every detail for release. Final checks, deployment and a clear handover give your team a confident starting point.']
  ];
  html=html.replace(/<div class="words" id="words">[\s\S]*?<\/div>/,()=>`<div class="words" id="words">${phases.map(([title],i)=>`<span${i===0?' class="on"':''}>${title}</span>`).join('')}</div>`);
  html=html.replace(/<ul class="plist" id="plist">[\s\S]*?<\/ul>/,()=>`<ul class="plist" id="plist"><div class="bar"></div>${phases.map(([title,copy],i)=>`<li${i===0?' class="on"':''}><b>${title}</b><p>${copy}</p></li>`).join('')}</ul>`);
  html=html.replace(/(<section id="hcta"[\s\S]*?<div class="wrap">)\s*<h2>[\s\S]*?<\/h2>/,(_,open)=>open+intro('Start a conversation','Your next chapter starts here.','A new brand, a better website or a product worth building. Tell us what you have in mind, and let’s shape the next step together.'));
  return html;
 });
 page('services',html=>{
  html=html.replace('Everything a brand needs to launch and grow, handled by one team that designs and builds.','Design and engineering for your next business move. From brand identity to connected software, we create experiences your customers understand and systems your team can build on.').replace('Designed together. Built to work.','Your next business move').replace('Let’s build<br>what comes next.','Built around<br>your ambition.').replace('Bring us the challenge. We will map the scope, technical dependencies and delivery approach around your business.','Tell us what your customers need, what your team wants to improve and how your existing systems work. We’ll shape a clear scope, technical approach and delivery plan around your priorities.');
  const summaries={
   'Website design':'Help customers understand your value and take the next step. We translate your positioning into clear page journeys, responsive Figma designs and interactive prototypes, with reusable components and specifications for development.',
   'Web development':'Give your business a website your team can manage and customers can use with confidence. We build with React and TypeScript, connect your CMS and APIs, and check accessibility, loading performance and critical user journeys.',
   'App development':'Put your service within reach of customers on iOS and Android. We select native or cross-platform development around your needs, connecting authentication, backend APIs and device features with testing and release preparation.',
   'Brand identity':'Make your business recognisable wherever customers meet it. We develop your logo system, typography, colour and visual direction, delivered as production-ready vector assets, digital design tokens and practical brand guidelines.',
   'UI/UX and product design':'Make complex tasks feel straightforward for your users. We map workflows, validate interactive prototypes and build Figma component systems, including accessible patterns and the loading, error and empty states your developers need.',
   'Custom software':'Replace fragmented processes with tools built around your operations. We develop portals, dashboards and business applications with role-based access, structured databases and API integrations, shaped by your workflows and data requirements.',
   'E-commerce':'Help customers find the right product and purchase with confidence. We design and develop Shopify or headless storefronts, connecting catalogue data, checkout, payments and fulfilment around your commercial and operational requirements.',
   'Motion and 3D':'Show what makes your product or brand distinctive through movement and interaction. We create Three.js and WebGL experiences, optimised 3D assets and product animation, with device performance budgets and reduced-motion alternatives.',
   'SEO and digital marketing':'Connect your business with people searching for what you offer. We address crawlability, page structure and structured data, then align content, campaign landing pages and analytics events with the enquiries or purchases you want to measure.',
   'AI and automation':'Reduce repetitive work without losing control of the process. We connect your tools through APIs and webhooks, adding retrieval or model-assisted steps where useful, with access controls, output validation and human review for important decisions.'
  };
  return html.replace(/(<div class="tx"><h3>([^<]+)<\/h3>)<p>[\s\S]*?<\/p>/g,(all,open,title)=>summaries[title]?`${open}<p>${escape(summaries[title])}</p>`:all);
 });
 page('work',html=>html.replace('A selection of recent identities, sites and products.','A collection of self-initiated projects across hospitality, skincare and fashion. The work explores interface design and digital product experiences; it is not presented as commissioned client work.').replace(/(<ul class="svc wl" id="wl">)/,'<p class="work-context">Explore the project previews below. Contact us to discuss a related design or development requirement.</p>$1').replace('</ul>','</ul><p id="work-empty" class="work-context" role="status" hidden>No projects are listed in this category yet. Choose another category or explore the full collection.</p>').replace('Independent restaurant operations exploration','Restaurant operations · Product interface concept').replace('Independent skincare-commerce exploration','Skincare retail · Commerce interface concept').replace('Independent fashion-commerce exploration','Fashion retail · Commerce interface concept'));
 page('process',html=>{
  html=html.replace('Four steps, each with a clear outcome, so you always know what happens next.','A project moves from an agreed brief to reviewed design, working implementation and a documented handover. Scope, milestones and timing are set around your requirements and dependencies.');
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
  html=html.replace(/(<div class="st" id="st">)\s*<h1>[\s\S]*?<\/h1>/,(_,open)=>`${open}<div class="brief-intro"><p class="section-eyebrow">Start a conversation</p><h1><span class="ln sc"><span>Let’s talk about your project.</span></span></h1><p>Tell us where your business is heading and what you want to create. We’ll use your brief to shape a focused conversation about design, technology and the right next step.</p><div class="brief-guidance"><p>A useful starting point</p><ul><li><strong>Your goals</strong><span>What should change for your customers or your team?</span></li><li><strong>Your starting point</strong><span>Share your website, existing designs or systems.</span></li><li><strong>Your priorities</strong><span>Mention essential features, dependencies or target dates.</span></li></ul></div><a href="mailto:avexiumdigital@gmail.com">avexiumdigital@gmail.com</a></div>`);
  html=html.replace(/<input class="fi" id="fn"[^>]*>/,field=>`<label class="form-field"><span>Your name</span>${field}</label>`).replace(/<input class="fi" id="fe"[^>]*>/,field=>`<label class="form-field"><span>Email address</span>${field}</label>`).replace(/<textarea class="fi" id="fmsg"[^>]*>[\s\S]*?<\/textarea>/,field=>`<label class="form-field"><span>Project overview</span>${field.replace(/aria-label="[^"]*"/,'aria-label="Project overview"').replace(/placeholder="[^"]*"/,'placeholder="Describe your goals, main requirements, existing systems and important dates."')}</label>`);
  html=html.replace('What do you need?','What can we help you with? <span class="field-hint">Choose one or more services. You can leave this open if you’re unsure.</span>').replace('Project stage','Where are you starting? <span class="field-hint">Choose the closest fit — an early idea is enough.</span>');
  html=html.replace('<form class="fm" id="fm" novalidate>','<form class="fm" id="fm" novalidate><div class="enquiry-form-heading"><p class="section-eyebrow">Your project brief</p><h2>A few details to get started.</h2><p>Share what you know. We can work through the finer details together.</p></div>');
  html=html.replace('placeholder="Describe your goals, main requirements, existing systems and important dates."','placeholder="I’m looking to…\nThe main goal is…\nMy current website or setup is…"');
  html=html.replace('<div><button class="pill" type="submit">Prepare email draft</button></div>','<p class="form-note">Your brief opens as a draft in your email app. Review it and send it to Avexium when you are ready.</p><div><button class="pill" type="submit">Prepare email draft</button></div>');
  return html;
 });
 if(/\bWeek(?:s)?\s+\d|next spark|Every spark starts|small, senior studio|Open roles/.test(markup))throw new Error('Unreviewed reference copy remains in public content.');
 return markup;
};
