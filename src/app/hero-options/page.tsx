import type {Metadata} from 'next';
import Link from 'next/link';
import HeroConceptScene,{type HeroConcept} from '@/components/HeroConceptScene';
import './preview.css';
export const metadata:Metadata={title:'Three hero directions',robots:{index:false,follow:false}};
const options:{id:HeroConcept;name:string;label:string;headline:string;copy:string;motion:string}[]=[
 {id:'optics',name:'Precision optics',label:'01 / CINEMATIC ENGINEERING',headline:'Focus on what matters.',copy:'A machined optical assembly with convex glass, metal detailing and an opening iris. Confident, technical and cinematic.',motion:'Scroll to separate the optical elements and move closer. Move your pointer to change the viewing angle.'},
 {id:'fabric',name:'Liquid metal',label:'02 / SCULPTURAL DESIGN',headline:'Ideas with a new shape.',copy:'A continuous sheet of polished ruby metal moves like fine fabric. Soft folds catch warm and cool studio light.',motion:'Scroll to deepen the folds and move through the sculpture. Pointer movement gently tilts the material.'},
 {id:'orbit',name:'Orbital glass',label:'03 / CONNECTED SYSTEMS',headline:'Everything, connected.',copy:'A refractive glass knot suspended inside three precision orbital rings. A quiet ruby core grounds the composition.',motion:'Scroll to orbit the interconnected forms. Glass reflections and slowly crossing rings create layered depth.'},
];
export default function HeroOptions(){return <div className="hero-options">
 <section className="concept-intro"><span className="section-label">AVEXIUM / HERO EXPLORATIONS</span><h1>Three directions.<br/>One first impression.</h1><p>Live 3D studies for your next homepage hero. Scroll through each scene or jump to a direction below. These are previews; choose a direction before it is added to the homepage.</p><nav aria-label="Hero directions">{options.map(o=><a href={`#${o.id}`} key={o.id}>{o.label.slice(0,2)} · {o.name} <span>↓</span></a>)}</nav></section>
 {options.map(o=><section className="concept-journey" id={o.id} key={o.id} aria-label={o.name}><div className="concept-stage"><HeroConceptScene concept={o.id}/><div className="concept-shade"/><div className="concept-heading"><span>{o.label}</span><h2>{o.headline}</h2><p>{o.copy}</p></div><div className="concept-caption"><strong>{o.name}</strong><p>{o.motion}</p><span>LIVE 3D / SCROLL TO EXPLORE ↓</span></div></div></section>)}
 <section className="concept-end"><h2>Which direction feels like Avexium?</h2><p>Choose 01, 02 or 03. The chosen scene can then be refined with the homepage headline and its full scroll transition.</p><Link className="outline-link" href="/">Return to current homepage ↗</Link></section>
 </div>;}
