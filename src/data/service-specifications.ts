type Specification = {
  summary: string;
  setup: string;
  work: [string, string, string][];
  handover: [string, string][];
  gates: [string, string][];
};
// Proposed scope examples, not claims of delivered client projects or guaranteed outcomes.
export const serviceSpecifications: Record<string, Specification> = {
  'digital-marketing': {
    summary: 'Campaign planning, conversion tracking, paid-media setup and landing-page experiments, with lead quality connected to reporting.',
    setup: 'Agree the advertising channels, analytics event schema, consent requirements, CRM lead stages and attribution window. Advertising accounts, tracking access and budget limits must be authorised before launch.',
    work: [
      ['Measurement', 'Define conversion events, UTM naming and source-to-CRM field mapping. Separate enquiries, qualified leads and sales.', 'Test a sample enquiry from the landing page through analytics and the CRM. Check duplicate events and missing source values.'],
      ['Campaign structure', 'Organise audiences, keywords, exclusions, creative variants and landing pages around specific offers and intent.', 'Review targeting, budgets, destinations, tracking and creative approvals against a pre-launch checklist.'],
      ['Experiment design', 'Record each hypothesis, variant, budget cap, observation window and stop condition before running a test.', 'Report observed results with sample size and attribution limits. Confirm the next action rather than declaring every uplift meaningful.'],
    ],
    handover: [['Campaign plan', 'Audience and channel matrix, budget allocation and creative brief.'], ['Tracking specification', 'Event dictionary, UTM rules, CRM mapping and test results.'], ['Campaign assets', 'Approved copy, creative variants and landing-page requirements.'], ['Review pack', 'Performance dashboard, experiment log and prioritised actions.']],
    gates: [['Before setup', 'Approve the offer, budget, qualified-lead definition and reporting baseline.'], ['Before launch', 'Sign off creative and complete the tracking and destination checks.'], ['At review', 'Compare results with the agreed baseline and approve changes or spend adjustments.']],
  },
  'seo-content': {
    summary: 'Crawl and indexing diagnostics, page-intent mapping, technical fixes and editorial briefs—not an arbitrary monthly word count.',
    setup: 'Define the audit URL set, target markets, CMS editing permissions and available search data. Prioritise work by impact, evidence and implementation effort.',
    work: [
      ['Technical audit', 'Inspect status codes, redirects, canonical URLs, robots directives, sitemaps and duplicate or orphan pages.', 'Re-crawl agreed pages after remediation. Verify canonical and redirect behaviour without assuming submission guarantees indexing.'],
      ['Page architecture', 'Map search intent to specific pages, with titles, headings, internal links and suitable structured-data requirements.', 'Check that each priority page has a distinct purpose, valid markup where applicable and working internal links.'],
      ['Editorial implementation', 'Create briefs with audience questions, evidence requirements, page structure and revision priorities.', 'Review factual accuracy with the subject expert, confirm publishing approval and record changes for subsequent search review.'],
    ],
    handover: [['Audit workbook', 'Issue, affected URLs, severity, evidence and proposed remedy.'], ['Page map', 'Intent-to-URL mapping, metadata and internal-link recommendations.'], ['Editorial briefs', 'Outlines, evidence requirements and scoped draft or revision files.'], ['Validation report', 'Re-crawl findings, remaining issues and search-review baseline.']],
    gates: [['Audit review', 'Agree which technical blockers and page opportunities enter scope.'], ['Publishing approval', 'Approve factual content and implementation changes before release.'], ['Post-release review', 'Verify fixes and monitor the agreed URLs; rankings are not an acceptance guarantee.']],
  },
  'brand-design': {
    summary: 'Positioning, identity rules and production-ready assets, tested across the actual places your brand needs to appear.',
    setup: 'Agree whether this is a new identity or a refresh, the application list, concept routes and revision rounds. Confirm ownership of existing assets and third-party licence needs.',
    work: [
      ['Identity construction', 'Develop logo variants, clear-space rules, minimum sizes, typography hierarchy and digital/print colour references.', 'Review small-size legibility, monochrome use, background contrast and representative digital and print applications.'],
      ['Application system', 'Define grids, composition, imagery treatment and editable templates for agreed sales and marketing surfaces.', 'Check that a team member can create a new piece using the template without breaking core identity rules.'],
      ['Asset packaging', 'Prepare vector masters, raster exports and documented naming, licensing and usage constraints.', 'Open the exported files, verify dimensions and colours, and identify missing or separately licensed resources.'],
    ],
    handover: [['Brand foundation', 'Positioning, audience, voice and approved creative criteria.'], ['Identity masters', 'Scoped editable masters plus SVG, PDF and PNG export variants.'], ['Application templates', 'Agreed presentation, social, campaign or print templates.'], ['Usage guide', 'Typography, colour, spacing, application examples and licence register.']],
    gates: [['Direction approval', 'Approve positioning and the chosen concept before expanding the identity.'], ['Application review', 'Test the identity on the agreed touchpoints and resolve practical issues.'], ['Handover approval', 'Review exports, template usability and licence responsibilities.']],
  },
  'ui-ux-design': {
    summary: 'User flows, responsive screens, interaction states and component specifications that an engineering team can implement.',
    setup: 'Define the user roles, journeys, screen inventory, breakpoints and state matrix. Agree whether research, usability testing and engineering handover are included.',
    work: [
      ['Information architecture', 'Map navigation, role permissions, task flows and dependencies before high-fidelity screen production.', 'Walk through agreed tasks with stakeholders and identify unreachable actions, ambiguous labels or missing decision points.'],
      ['Interaction coverage', 'Specify loading, empty, validation, error, success and permission states for priority journeys.', 'Review keyboard order, form behaviour, responsive layouts and recovery paths against the state matrix.'],
      ['Component system', 'Document spacing, typography, colour tokens, component variants and interaction rules.', 'Check consistency across screens and review feasibility with engineering. Record unresolved implementation questions.'],
    ],
    handover: [['UX map', 'Role matrix, information architecture and priority flow diagrams.'], ['Design files', 'Agreed responsive screens with named components and design tokens.'], ['Prototype & states', 'Linked priority journeys plus an interaction-state inventory.'], ['Handover specification', 'Behaviour notes, assets, annotations and review findings.']],
    gates: [['Flow approval', 'Confirm navigation and priority journeys before detailed screen design.'], ['Prototype review', 'Review complete tasks, not isolated screenshots; log findings and revisions.'], ['Engineering handover', 'Agree component behaviour and close or document open implementation questions.']],
  },
  'web-development': {
    summary: 'Responsive interfaces, CMS models, APIs and access-controlled workflows, with a documented path from development to production.',
    setup: 'Agree rendering and content needs, API boundaries, database ownership, authentication, environments and deployment access. A React/Next.js interface is one option—not a substitute for architecture planning.',
    work: [
      ['Frontend & content', 'Implement routes, reusable components, responsive layouts and the agreed CMS content types, with loading and error states.', 'Check priority journeys at agreed breakpoints, keyboard navigation, content editing and route behaviour.'],
      ['Data & integrations', 'Define request/response contracts, server-side validation, role permissions and integration failure handling where required.', 'Test invalid input, unauthorised access, failed upstream requests and duplicate submissions—not only successful requests.'],
      ['Release engineering', 'Separate development, staging and production configuration. Prepare build checks, deployment instructions and rollback steps.', 'Run agreed functional tests, review secrets handling and performance budgets, and confirm a rollback or recovery procedure.'],
    ],
    handover: [['Architecture pack', 'Route map, data model, API contracts and access-role definitions.'], ['Source & configuration', 'Repository, environment-variable template and setup instructions without embedded secrets.'], ['Test evidence', 'Critical-journey results, accessibility findings and performance review.'], ['Release runbook', 'Deployment, rollback, CMS guidance and maintenance responsibilities.']],
    gates: [['Architecture sign-off', 'Confirm features, data flows, dependencies and acceptance criteria.'], ['Staging acceptance', 'Complete stakeholder UAT and resolve release-blocking defects.'], ['Production approval', 'Confirm access, configuration, rollback ownership and launch readiness.']],
  },
  'mobile-development': {
    summary: 'Mobile journeys with explicit device support, permission handling, network behaviour and store-release requirements.',
    setup: 'Agree iOS/Android coverage, native versus cross-platform implementation, supported OS/device matrix, API dependencies and offline rules before development.',
    work: [
      ['App architecture', 'Define screen navigation, state management, authentication, local storage and API error handling for the agreed product.', 'Test session expiry, network loss, retry behaviour and persistence across app restarts.'],
      ['Device capabilities', 'Implement scoped camera, location, notifications or offline workflows with clear permission and fallback states.', 'Check denied permissions and representative devices. Validate offline sync and conflicts where offline work is included.'],
      ['Release preparation', 'Create signed builds, versioning, store assets and the data-use information required for submission.', 'Complete the agreed beta checklist and submission checks. Store approval remains the platform’s decision.'],
    ],
    handover: [['Product specification', 'Screen inventory, device matrix and online/offline state rules.'], ['App source & builds', 'Scoped source, build configuration and authorised signing setup.'], ['Device test report', 'Results for agreed hardware, permissions and connectivity conditions.'], ['Release pack', 'Store assets, submission notes and update/maintenance instructions.']],
    gates: [['Platform approval', 'Confirm device needs and native/cross-platform trade-offs.'], ['Beta acceptance', 'Review agreed flows and device tests before store submission.'], ['Release approval', 'Confirm signing, privacy disclosures and store-account ownership.']],
  },
  ecommerce: {
    summary: 'Catalogue structure, product discovery, checkout and fulfilment integrations, validated through representative orders.',
    setup: 'Define products, variants, markets, currencies, tax and shipping rules, payment providers and inventory ownership. Platform choice follows these constraints.',
    work: [
      ['Catalogue & storefront', 'Configure product fields, collections, filters, variant selection and merchandising content for the agreed platform.', 'Check representative products, missing imagery, unavailable variants, pricing display and mobile discovery.'],
      ['Checkout & orders', 'Connect scoped payment, shipping and order-notification flows using authorised merchant accounts.', 'Test success, failure, cancellation, discount and refund scenarios supported by the chosen platform and test environment.'],
      ['Migration & integrations', 'Map imported data, redirects, inventory updates and order handoffs. Define who owns each source of truth.', 'Reconcile a sample import, check redirects and test repeat or failed integration events without creating duplicate orders.'],
    ],
    handover: [['Commerce specification', 'Catalogue schema, order states, market rules and integration map.'], ['Configured storefront', 'Theme or custom source plus content and operational configuration.'], ['Order test matrix', 'Representative checkout, shipping, refund and notification test results.'], ['Operations guide', 'Product editing, order handling, integration ownership and launch checklist.']],
    gates: [['Commerce rules approval', 'Sign off catalogue, payment and fulfilment requirements.'], ['Order acceptance', 'Complete agreed test orders and resolve blocking commerce defects.'], ['Launch approval', 'Confirm migration reconciliation, merchant access and operational readiness.']],
  },
  'automation-ai': {
    summary: 'Trigger-to-action workflows and AI-assisted processing with evaluated outputs, human review and explicit failure paths.',
    setup: 'Define the trigger, data schema, API permissions, review rules and allowed providers. Agree baseline effort, evaluation cases and ongoing cost limits before choosing a workflow tool or model.',
    work: [
      ['Workflow engineering', 'Specify triggers, field mapping, branching, retries, deduplication and escalation for repeatable business processes.', 'Test duplicate events, malformed payloads, rate limits and upstream failures. Confirm each exception has an owner.'],
      ['AI evaluation', 'Define prompts or retrieval behaviour, permitted sources and a labelled test set. Route uncertain or sensitive outputs for review.', 'Measure agreed accuracy/error categories, latency and per-task cost. Inspect unsupported answers rather than judging a demo by appearance.'],
      ['Operational controls', 'Add audit logs, access boundaries, monitoring and manual fallback or disable paths.', 'Verify permissions, retention settings, reviewer actions and a documented stop/recovery procedure.'],
    ],
    handover: [['Workflow contract', 'Trigger schema, mapping, branches, exceptions and ownership.'], ['Implementation assets', 'Scoped workflow exports or source, configuration and connection instructions.'], ['Evaluation report', 'Test dataset, observed error cases, latency and running-cost estimates.'], ['Operating runbook', 'Review queue, alerts, retry/fallback procedures and credential ownership.']],
    gates: [['Pilot scope approval', 'Confirm one bounded workflow, permitted data and evaluation criteria.'], ['Evaluation acceptance', 'Review failure cases and human oversight before enabling live actions.'], ['Controlled rollout', 'Confirm monitoring, access and rollback; expand only after review.']],
  },
  'cloud-devops': {
    summary: 'Environment configuration, build/release pipelines, observability and recovery procedures with clearly assigned operational ownership.',
    setup: 'Inventory environments, access roles, deployment dependencies and costs. Agree availability needs, backup scope and recovery objectives; these are not implied service-level commitments.',
    work: [
      ['Environment management', 'Document infrastructure configuration, access boundaries, secrets handling and separation between staging and production.', 'Review permissions and configuration drift, and demonstrate repeatable environment setup where scoped.'],
      ['Delivery pipeline', 'Automate build, test and deployment stages with release approvals and a defined rollback path.', 'Run a staging release, exercise a failed check and confirm that a failed build cannot silently proceed to production.'],
      ['Observability & recovery', 'Define logs, health checks, alerts, backup coverage and incident escalation ownership.', 'Check sample alerts and agreed restore/rollback exercises. Record observed recovery behaviour and unresolved risks.'],
    ],
    handover: [['Environment inventory', 'System diagram, access matrix, dependencies and configuration records.'], ['Pipeline configuration', 'Version-controlled build, test, release and approval definitions.'], ['Operational evidence', 'Staging deployment, alert and scoped recovery-test results.'], ['Runbooks', 'Deploy, rollback, restore, escalation and ongoing support boundaries.']],
    gates: [['Risk review', 'Approve scope, access, maintenance windows and change priorities.'], ['Staging validation', 'Demonstrate pipeline checks and rollback before production changes.'], ['Operations handover', 'Confirm alert owners, recovery procedures and remaining responsibilities.']],
  },
  '3d-motion': {
    summary: 'Real-time scenes and motion sequences planned around asset budgets, interactions and fallback behaviour—not decoration alone.',
    setup: 'Agree scene inventory, interaction storyboard, asset licences, target devices and load/render budgets. Separate model production from scene integration when estimating scope.',
    work: [
      ['Asset preparation', 'Review geometry, texture sizes, materials and export formats. Prepare optimised scene assets and staged loading.', 'Measure asset transfer size and check visual quality against agreed references at each quality tier.'],
      ['Scene & interaction', 'Implement camera, lighting, materials and scoped scroll or product-configuration states in the selected real-time runtime.', 'Test navigation, touch interaction, resize behaviour, loading failures and cleanup when navigating between pages.'],
      ['Performance & fallback', 'Define reduced-motion behaviour, device-aware quality and a usable non-WebGL alternative.', 'Profile representative devices against agreed budgets and verify that essential content remains usable without the scene.'],
    ],
    handover: [['Experience specification', 'Storyboard, camera states, interaction rules and device targets.'], ['Optimised assets', 'Licensed scoped models, textures, materials and export files.'], ['Scene source', 'Runtime integration, quality settings and loading/fallback logic.'], ['Performance report', 'Device findings, asset budgets, reduced-motion checks and maintenance notes.']],
    gates: [['Storyboard approval', 'Agree visual references, interaction purpose and asset scope.'], ['Scene review', 'Approve key states and interactions on representative devices.'], ['Release acceptance', 'Check agreed performance budgets and accessible fallback behaviour.']],
  },
};
