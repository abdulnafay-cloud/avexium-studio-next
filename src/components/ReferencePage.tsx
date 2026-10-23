import {referenceMarkup} from '@/data/reference-markup';
import ReferenceScripts from './ReferenceScripts';
import type {PublicSection} from '@/lib/site-metadata';
export default function ReferencePage({section}:{section:PublicSection}){
 const markup=referenceMarkup.replace(/<main class="page(?: on)?" data-r="([^"]+)"/g,(_,route)=>`<main class="page${route===section?' on':''}" data-r="${route}"`);
 return <><div id="reference-site" dangerouslySetInnerHTML={{__html:markup}}/><ReferenceScripts/></>;
}
