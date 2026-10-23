module.exports=String.raw`
(function(){
 var input=document.querySelector('#career-search'),filter=document.querySelector('#career-discipline');
 if(!input||!filter)return;
 var form=document.querySelector('.career-search-controls'),jobs=Array.from(document.querySelectorAll('[data-job-role]')),count=document.querySelector('#career-result-count'),empty=document.querySelector('#career-search-empty');
 function updateCareerSearch(){
  var words=input.value.trim().toLowerCase().split(/\s+/).filter(Boolean),visible=0;
  jobs.forEach(function(job){var matches=(filter.value==='all'||job.dataset.jobRole===filter.value)&&words.every(function(word){return job.dataset.jobSearch.toLowerCase().includes(word);});job.hidden=!matches;if(matches)visible++;});
  count.textContent=visible+' '+(visible===1?'opportunity':'opportunities');empty.hidden=visible!==0;
  if(typeof lenis!=='undefined'&&lenis)lenis.resize();
 }
 input.addEventListener('input',updateCareerSearch);filter.addEventListener('change',updateCareerSearch);
 form.addEventListener('submit',function(event){event.preventDefault();updateCareerSearch();});
 document.querySelector('#career-search-reset').addEventListener('click',function(){input.value='';filter.value='all';updateCareerSearch();input.focus();});
})();
`;
