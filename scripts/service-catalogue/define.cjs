// Keep editorial source readable; expand compact tuples into the page schema.
module.exports=function define(category,visual,entries){return entries.map(entry=>{
 const {scope,tools,outputs,requires,stages,questions,...rest}=entry;
 return {...rest,category,visual,color:'#f33724',work:scope.map(([title,detail,check])=>({title,detail,check})),technology:tools.map(([name,detail])=>({name,detail})),deliverables:outputs,inputs:requires,process:stages,faq:questions};
});};
