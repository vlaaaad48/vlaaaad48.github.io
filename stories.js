(() => {
 const root=document.querySelector('.stories'); if(!root)return;
 const slides=[...root.querySelectorAll('.story-slide')], bars=[...root.querySelectorAll('.story-progress i')];
 const selectors=[...root.querySelectorAll('[data-story]')], toggle=root.querySelector('.story-toggle');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let index=0, elapsed=0, last=0, visible=false, paused=reduced.matches;
 function render(){
  slides.forEach((s,i)=>{s.classList.toggle('is-current',i===index);s.setAttribute('aria-hidden',String(i!==index));});
  bars.forEach((b,i)=>b.style.transform=`scaleX(${i<index?1:i===index?elapsed/3000:0})`);
  selectors.forEach((b,i)=>b.setAttribute('aria-current',String(i===index)));
 }
 function show(next){index=(next+slides.length)%slides.length;elapsed=0;render();}
 selectors.forEach((button,i)=>button.addEventListener('click',()=>show(i)));
 function label(){toggle.setAttribute('aria-label',paused?'Продолжить смену фотографий':'Приостановить смену фотографий');toggle.setAttribute('aria-pressed',String(paused));}
 toggle.addEventListener('click',()=>{paused=!paused;label();});
 root.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show(index+(e.key==='ArrowRight'?1:-1));}});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{threshold:.25}).observe(root);
 function tick(now){const delta=last?Math.min(now-last,100):0;last=now;if(visible&&!paused&&!document.hidden){elapsed+=delta;if(elapsed>=3000)show(index+1);render();}requestAnimationFrame(tick);}
 reduced.addEventListener('change',()=>{paused=reduced.matches;label();});label();render();requestAnimationFrame(tick);
})();
