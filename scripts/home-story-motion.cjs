module.exports=String.raw`
function homeStoryPose(m,progress,narrow){
 function ease(v){v=clamp(v,0,1);return v*v*(3-2*v);}
 var weight=ease((m-2.4)/.6)*(1-ease((m-4.2)/.8)),blend=ease(m-3),mobile=narrow?.62:1;
 return {weight:weight,x:narrow?0:-.3*blend,y:(narrow?.45:.8)*(1-blend),scale:(.72-.14*blend)*mobile,pitch:-.04*blend,yaw:blend*(.18+clamp(progress,0,1)*.35)};
}
`;
