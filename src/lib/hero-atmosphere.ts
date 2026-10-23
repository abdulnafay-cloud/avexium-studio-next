// Front-to-back smoke layers with extinction and directional light scattering.
// Fixed sample counts keep the original scene's rendering budget predictable.
export const heroAtmosphere = `
varying vec2 vUv;
uniform float time;
uniform float aspect;
uniform vec2 pointer;

float hash3(vec3 p) {
 p = fract(p * .3183099 + vec3(.17,.31,.53));
 p *= 17.;
 return fract(p.x*p.y*p.z*(p.x+p.y+p.z));
}
float noise3(vec3 p) {
 vec3 i=floor(p), f=fract(p);
 f=f*f*f*(f*(f*6.-15.)+10.);
 return mix(mix(mix(hash3(i),hash3(i+vec3(1,0,0)),f.x),
                mix(hash3(i+vec3(0,1,0)),hash3(i+vec3(1,1,0)),f.x),f.y),
            mix(mix(hash3(i+vec3(0,0,1)),hash3(i+vec3(1,0,1)),f.x),
                mix(hash3(i+vec3(0,1,1)),hash3(i+vec3(1,1,1)),f.x),f.y),f.z);
}
float turbulence(vec3 p) {
 return noise3(p)*.49 + noise3(p*2.07+vec3(4.1,1.7,8.2))*.29
      + noise3(p*4.13+vec3(7.3,5.9,2.4))*.22;
}
float densityAt(vec3 p) {
 vec3 flow=p*1.65-vec3(time*.018,time*.085,time*.025);
 flow.x += .28*sin(p.y*1.5-time*.09+p.z);
 flow.z += .22*sin(p.x*1.7+time*.07);
 float cloud=pow(smoothstep(.32,.72,turbulence(flow)),1.6);
 // Broad drifting columns rather than a uniform sheet of noise.
 float plume=exp(-pow((p.x-.95-.22*sin(p.y*1.3+time*.06))*.7,2.));
 float lower=exp(-pow((p.y+1.35)*.8,2.));
 return cloud*(.08+plume*.85+lower*.35);
}
void main() {
 vec2 uv=vUv+vec2(-pointer.x,pointer.y)*.018;
 vec3 ray=normalize(vec3((uv-.5)*vec2(aspect,1.)*2.,1.65));
 vec3 origin=vec3(0,0,-2.4), lightPosition=vec3(2.8,.6,.8);
 vec3 color=vec3(.002,.002,.003);
 float transmission=1.;
 for(int i=0;i<6;i++) {
  float distance=1.1+float(i)*.52;
  vec3 p=origin+ray*distance;
  float density=densityAt(p);
  vec3 toLight=normalize(lightPosition-p);
  float shadow=densityAt(p+toLight*.42);
  float edge=clamp((density-shadow)*2.3+.35,.08,1.);
  float falloff=1./(1.+dot(lightPosition-p,lightPosition-p)*.12);
  float alpha=1.-exp(-density*.58);
  vec3 scattering=vec3(.032,.018,.023)+vec3(.9,.07,.018)*edge*falloff;
  color+=transmission*alpha*scattering;
  transmission*=1.-alpha;
 }
 float vignette=1.-smoothstep(.35,1.1,length((vUv-.5)*vec2(.85,1.)))*.35;
 gl_FragColor=vec4(color*vignette,1.);
}`;
