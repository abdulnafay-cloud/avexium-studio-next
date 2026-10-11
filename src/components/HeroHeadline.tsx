export default function HeroHeadline({title}:{title:string}){
 let index=0;
 return <h1 className="cinematic-headline" aria-label={title.replaceAll('|',' ')}>{title.split('|').map((line,lineIndex)=><span className="hero-line" aria-hidden="true" key={lineIndex}>{Array.from(line).map((character)=>{const i=index++;return <span className="hero-character" key={i} style={{'--dx':`${Math.sin(i*2.41)*85}px`,'--dy':`${Math.cos(i*1.71)*110}px`,'--spin':`${Math.sin(i*.73)*24}deg`,'--delay':`${lineIndex*.075}`} as React.CSSProperties}>{character===' '? '\u00a0':character}</span>;})}</span>)}</h1>;
}
