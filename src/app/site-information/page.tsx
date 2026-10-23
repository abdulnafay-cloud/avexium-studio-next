import {pageMetadata} from '@/lib/site-metadata';
import InformationPage from '@/components/InformationPage';
export const metadata=pageMetadata('/site-information','Site information','Contact information, portfolio context and enquiry functionality for Avexium Digital.');
export default function SiteInformation(){return <InformationPage title="Site information." intro="About Avexium Digital, the work presented here and how to contact us." sections={[
 ['About Avexium Digital','Avexium Digital presents services across brand identity, digital design, web development, software and connected workflows. Service pages explain potential scope, technology choices, deliverables and project inputs. The exact work and responsibilities are agreed for each engagement.'],
 ['Contact','Project and collaboration enquiries can be sent to avexiumdigital@gmail.com. Include your requirements, relevant project context and the best way to reach you. The project form submits your brief directly to a private enquiry inbox.'],
 ['Portfolio context','Tablevori, Seluvrane and Drapeviqa are self-initiated concepts exploring restaurant operations, skincare commerce and fashion retail. They are presented as independent work, not commissioned client engagements. Sample product information, reviews and dashboard figures within project imagery are illustrative.'],
 ['Enquiry and collaboration pages','The project form saves your enquiry directly and provides a confirmation reference. Collaboration listings describe areas of interest for portfolio enquiries and do not establish confirmed vacancies or employment terms.'],
 ['Project scope and delivery','Service descriptions explain capabilities and possible approaches. Deliverables, dependencies, milestones, technical choices and any ongoing support are confirmed against an agreed project scope.']
 ]}/>;}
