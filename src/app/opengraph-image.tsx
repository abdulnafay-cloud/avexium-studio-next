import {ImageResponse} from 'next/og';
export const alt='Avexium Digital — Brand, web & software';
export const size={width:1200,height:630};
export const contentType='image/png';
export default function Image(){return new ImageResponse(<div style={{display:'flex',flexDirection:'column',justifyContent:'space-between',width:'100%',height:'100%',padding:80,background:'#07090e',color:'#f4f5f7',fontFamily:'sans-serif'}}><div style={{fontSize:26,letterSpacing:8}}>AVEXIUM DIGITAL</div><div style={{display:'flex',flexDirection:'column',gap:24}}><div style={{fontSize:76,letterSpacing:-4}}>Brand. Web. Commerce.</div><div style={{fontSize:27,color:'#b2c1d2'}}>For restaurants, retailers & service businesses.</div></div><div style={{fontSize:18,color:'#66e3d1'}}>IDENTITY · STOREFRONTS · BUSINESS TOOLS</div></div>,size);}
