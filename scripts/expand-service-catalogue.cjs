const fs=require('node:fs');
const path=require('node:path');
const file=path.join(__dirname,'../src/data/service-pages.json');
const legacySlugs=['website-design','web-development','app-development','brand-identity','ui-ux-product-design','custom-software','e-commerce','motion-3d','seo-digital-marketing','ai-automation'];
const existing=JSON.parse(fs.readFileSync(file,'utf8'));
const base=legacySlugs.map(slug=>{const service=existing.find(item=>item.slug===slug);if(!service)throw new Error('Missing existing service '+slug);return {...service,featuredLegacy:true};});
for(const service of base){
 service.category=['brand-identity','ui-ux-product-design','motion-3d'].includes(service.slug)?'creative':service.slug==='seo-digital-marketing'?'marketing-sales':'digital-tech';
 service.visual=service.slug;
 service.color='#f33724';
}
function patch(slug,values){Object.assign(base.find(item=>item.slug===slug),values);}
patch('app-development',{title:'Mobile app development'});
patch('custom-software',{title:'SaaS & custom software',summary:'Customer portals, internal platforms and SaaS products built around your records, roles and operating process. We define the data model, permissions and integrations, then deliver working software with a release and maintenance plan.'});
patch('brand-identity',{title:'Graphic design & logo systems',summary:'Logo systems and graphic assets for the places your business appears: websites, packaging, presentations, campaigns and print. We establish the visual rules, create the agreed applications and supply usable masters, exports and production guidance.'});
patch('ui-ux-product-design',{title:'UI/UX & product design'});
patch('e-commerce',{title:'E-commerce stores & marketplaces',summary:'Shopify and WooCommerce stores, plus Amazon marketplace setup and connected catalogue operations where included. We organise products, storefront content, checkout and fulfilment rules, then test the customer and order-management workflows before launch.'});
patch('motion-3d',{title:'3D modelling & rendering',summary:'Product models, architectural or brand visuals and rendered animation prepared for their intended use. We define geometry, materials, lighting and camera direction, then deliver the agreed stills, sequences or optimised real-time assets.'});
patch('seo-digital-marketing',{title:'SEO & search content',focus:'Crawlability, page intent & organic search',summary:'Technical SEO and search-focused content based on your actual website and customer questions. We investigate crawl and indexing issues, map intent to pages and prioritise improvements, with a record of the fixes and the search data used to assess them.'});
patch('ai-automation',{title:'AI services & intelligent automation',focus:'Chatbots, agents, evaluation & applied AI',summary:'Chatbots, AI-assisted workflows and bounded agents connected to your business information and tools. We also provide prompt-system design and AI consulting, with a defined use case, evaluation examples, permission boundaries and human-review requirements.'});
function addWork(slug,item){const service=base.find(s=>s.slug===slug);if(!service.work.some(w=>w.title===item.title))service.work.push(item);}
function addTool(slug,item){const service=base.find(s=>s.slug===slug);if(!service.technology.some(w=>w.name===item.name))service.technology.push(item);}
addWork('custom-software',{title:'SaaS tenancy and product operations',detail:'For multi-tenant products, define tenant boundaries, role permissions, onboarding, subscription states and administrative support workflows. Plan billing-provider events, audit records, account closure and data export around the product requirements. Tenant separation is enforced where data is accessed rather than relying on the interface to hide another customer’s records.',check:'Test cross-tenant access, role changes, duplicate provider events, expired sessions and the account export or closure workflow included in scope.'});
addWork('brand-identity',{title:'Graphic production and campaign applications',detail:'Create the agreed presentation, social, packaging or print assets using a documented grid, type hierarchy and image treatment. Production specifications cover trim, bleed, resolution, colour references and required exports where relevant. Reusable templates include guidance for replacing copy and imagery without breaking the layout.',check:'Review long and short content, inspect final exports and confirm production specifications and third-party font or image usage rights.'});
addTool('e-commerce',{name:'WooCommerce and WordPress operations',detail:'Assess theme and plugin compatibility, hosting, payments, shipping configuration and the content-editing workflow. Updates and backups need an operating owner; extensions are selected around requirements rather than installed without a dependency plan.'});
addWork('e-commerce',{title:'Amazon listings and marketplace integration',detail:'Prepare the agreed marketplace catalogue fields, identifiers, variants, imagery and listing content. Seller-account verification, brand permissions and product-category requirements are confirmed with the account owner. Where systems are connected, define how inventory, orders, returns and fulfilment status are reconciled between the storefront and marketplace.',check:'Validate sample listings and variant relationships, test the scoped stock and order synchronisation, and record any marketplace approval or account dependency.'});
addTool('e-commerce',{name:'Shopify, Amazon and catalogue connectors',detail:'Platform-supported integrations can connect eligible marketplace accounts and product records. Confirm supported regions, categories and account capabilities, then test mappings and exception handling before synchronising a full catalogue.'});
addWork('motion-3d',{title:'Geometry, materials and rendering pipeline',detail:'Agree real dimensions, level of detail and the use of CAD or other supplied source material. Prepare topology, UVs, material maps and lighting for the approved camera views. Real-time delivery adds explicit texture, geometry and loading limits; high-resolution still rendering follows a separate output specification.',check:'Review silhouettes, scale, UV seams, material references and representative renders. For interactive assets, test file size, loading, appearance and performance on the target devices.'});
addWork('ai-automation',{title:'Chatbots, knowledge retrieval and bounded agents',detail:'Define supported questions and actions, the approved knowledge sources and escalation path. Retrieval includes document permissions and source references. An agent’s tool access is limited to authorised operations, with explicit confirmation for consequential actions, time and execution limits, and a useful failure or handover response.',check:'Evaluate representative questions, missing knowledge, conflicting instructions, permission boundaries and failed tool calls. Confirm that uncertain or unsupported requests reach the agreed review path.'});
addWork('ai-automation',{title:'Prompt engineering, evaluation and AI consulting',detail:'Review the proposed use case and establish a baseline before selecting a model or prompt pattern. Version the instructions, examples, output schema and evaluation dataset. Compare correctness, latency and operating requirements using realistic cases; consulting records whether an AI approach is justified and what controls would be needed for production.',check:'Run repeatable evaluations against agreed examples, inspect invalid structured output and report limitations. Re-test material prompt, model or source-data changes before release.'});
const additions=['technology','marketing','creative','writing','business'].flatMap(name=>require('./service-catalogue/'+name+'.cjs'));
const all=[...base,...additions];
const aliases={'graphic-design':'brand-identity'};
const descriptions={
 'website-design':'Sitemaps, responsive layouts, prototypes and a documented design handover.',
 'web-development':'Responsive websites, CMS models, APIs and access-controlled web applications.',
 'app-development':'iOS and Android applications, device features and release preparation.',
 'custom-software':'SaaS platforms, customer portals, internal tools and business-system integrations.',
 'ai-automation':'Chatbots, agents, prompt systems, AI consulting and evaluated business workflows.',
 'cybersecurity-penetration-testing':'Authorised application testing, risk evidence, remediation guidance and retesting.',
 'cloud-it-support':'AWS, Azure or Google Cloud setup, migrations, recovery and IT operations.',
 'data-analysis-dashboards':'SQL reporting, data preparation, dashboards and evaluated predictive analysis.',
 'no-code-automation':'Zapier, Make and n8n workflows with duplicate protection and recovery paths.',
 'e-commerce':'Shopify, WooCommerce and Amazon catalogue, checkout and order workflows.',
 'qa-software-testing':'Risk-based functional, browser, device and API testing with release evidence.',
 'social-media-management':'Editorial calendars, channel-specific production, publishing and community handling.',
 'seo-digital-marketing':'Crawl diagnostics, page-intent mapping, content improvements and search reporting.',
 'paid-advertising':'Google, Meta and TikTok campaign setup, creative tests and conversion tracking.',
 'email-marketing':'Audience segments, responsive templates, lifecycle sequences and delivery checks.',
 'influencer-affiliate-marketing':'Partner research, creator briefs, usage rights and attributable campaign records.',
 'content-marketing':'Editorial programmes, evidence-led briefs, landing pages and campaign copy.',
 'lead-generation-outreach':'Prospect research, approved outreach, qualification rules and CRM handoffs.',
 'brand-strategy':'Audience definition, positioning, value propositions and message architecture.',
 'video-marketing':'Short-form concepts, UGC-style production briefs and testable ad variants.',
 'brand-identity':'Logo systems, graphic assets, production files and reusable visual templates.',
 'video-editing-animation':'Editorial cuts, motion graphics, colour, sound, captions and delivery exports.',
 'voiceover-podcast-editing':'Narration, dialogue editing, audio cleanup and podcast assembly.',
 'photography-videography':'Shot planning, original capture, selection, retouching and channel-ready assets.',
 'ui-ux-product-design':'User flows, interface states, prototypes and implementable component systems.',
 'motion-3d':'Product geometry, materials, lighting, rendered images and optimised 3D assets.',
 'music-production':'Original composition, arrangement, mixing, mastering and audio-brand assets.',
 'copywriting-ghostwriting':'Website copy, articles and authored material built from real source expertise.',
 'translation-localisation':'Contextual translation, terminology management and in-product language checks.',
 'transcription-subtitling':'Verified transcripts, speaker labels, timed captions and subtitle files.',
 'resume-linkedin-writing':'Evidence-led CVs, achievement statements and consistent LinkedIn profile copy.',
 'technical-writing':'API references, setup guides, operating runbooks and verified examples.',
 'virtual-assistance':'Scheduling, records, document preparation and approved administrative follow-up.',
 'bookkeeping-accounting-tax':'Reconciled records, close support and jurisdiction-specific filing coordination.',
 'business-consulting':'Operating diagnosis, decision options, implementation plans and management coaching.',
 'legal-contracts-compliance':'Jurisdiction-scoped contracts, professional review and compliance operations.',
 'recruitment-hr':'Role briefs, applicant coordination, interview workflows and HR administration.',
 'customer-support-outsourcing':'Support queues, knowledge, escalation rules and quality-reviewed service operations.',
 'project-management':'Scope, milestones, dependencies, decision records and coordinated handover.',
 'market-research':'Customer interviews, desk research, surveys and evidence-based decision reports.'
};
const slugs=new Set(all.map(s=>s.slug));
for(const service of all){
 const prior={'app-development':['App development'],'custom-software':['Custom software'],'brand-identity':['Brand identity'],'ui-ux-product-design':['UI/UX and product design'],'e-commerce':['E-commerce'],'motion-3d':['Motion and 3D'],'seo-digital-marketing':['SEO and digital marketing'],'ai-automation':['AI and automation']};
 service.previousTitles=prior[service.slug]||[];
 service.overview=descriptions[service.slug];
 service.related=service.related.map(slug=>aliases[slug]||slug);
 for(const slug of service.related)if(!slugs.has(slug)||slug===service.slug)throw Error('Invalid related service: '+service.slug+' / '+slug);
 if(!service.overview)throw Error('Missing overview '+service.slug);
}
if(all.length!==40||slugs.size!==40)throw Error('Expected forty unique services.');
fs.writeFileSync(file,JSON.stringify(all,null,2)+'\n');
console.log('Prepared 40 detailed services in five categories.');
