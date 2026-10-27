// The same globe-and-orbits concept, with an even shell and three continuous
// particle paths instead of scattered comet heads and an overexposed core.
module.exports=`function hero(i,k){
 var fraction=i/N,X,Y,Z,kd=0,bb=.6,r,la,lo,sl;
 if(fraction<.66){
  var shellCount=Math.floor(N*.66);la=Math.acos(1-2*(i+.5)/shellCount);lo=i*2.39996323;
  r=1.65+(rnd()-.5)*.018;sl=Math.sin(la);X=r*sl*Math.cos(lo);Y=r*Math.cos(la);Z=r*sl*Math.sin(lo);bb=.58+rnd()*.18;
 }else if(fraction<.94){
  var orbitIndex=i-Math.floor(N*.66),rg=orbitIndex%3,angle=orbitIndex*.61803398875*6.2831853;
  r=2.12+rg*.29+(rnd()-.5)*.025;
  X=r*Math.cos(angle);Y=(rnd()-.5)*.022;Z=r*Math.sin(angle);kd=2+rg*.3;
  bb=.38+.22*(.5+.5*Math.sin(angle*2.+rg));
 }else{
  r=1.8+rnd()*1.3;la=Math.acos(1-2*rnd());lo=rnd()*6.2831853;sl=Math.sin(la);
  X=r*sl*Math.cos(lo);Y=r*Math.cos(la);Z=r*sl*Math.sin(lo);kd=4;bb=.11+rnd()*.14;
 }
 pos[0][k]=X;pos[0][k+1]=Y;pos[0][k+2]=Z;K[i]=kd;B[i]=bb;
}`;
