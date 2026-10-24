import {vertexShader} from './service-particle-shaders';

// Three moving ribbon surfaces follow a trefoil path. The existing chapter
// morphs take over as the reader leaves the hero.
export const aboutHeroVertexShader='attribute vec3 ribbonCoord;\n'+vertexShader.replace('vec3 p0=position;',`
 float t=ribbonCoord.x, width=ribbonCoord.y, strand=ribbonCoord.z;
 float breath=.12*sin(uT*.38);
 vec3 center=vec3(.68*(sin(t)+2.*sin(2.*t)),.68*(cos(t)-2.*cos(2.*t)),.78*sin(3.*t+breath));
 vec3 tangent=normalize(vec3(.68*(cos(t)+4.*cos(2.*t)),.68*(-sin(t)+4.*sin(2.*t)),2.34*cos(3.*t+breath)));
 vec3 normal=normalize(cross(tangent,vec3(0.,0.,1.)));
 vec3 binormal=normalize(cross(tangent,normal));
 float twist=t*1.5+strand*2.094+uT*.16;
 vec3 across=normal*cos(twist)+binormal*sin(twist);
 vec3 p0=center+across*width+(normal*sin(twist)-binormal*cos(twist))*.13;
`);
