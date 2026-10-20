const area=document.querySelector('.credentials-layout');
const container=document.querySelector('#anna-lanyard');
if(area&&container){
 const screens=matchMedia('(min-width:701px)');
 let mounted=false;
 let ready;
 let dispose;
 let generation=0;
 const observer=new IntersectionObserver(async entries=>{
  if(!screens.matches||mounted||!entries.some(entry=>entry.isIntersecting))return;
  mounted=true;observer.disconnect();
  const current=++generation;
  try{
   ready??=Promise.all([import('./vendor/lanyard.js?v=6'),new Promise(resolve=>{const image=new Image();image.onload=image.onerror=resolve;image.src='portrait-hero-3730.jpg';})]);
   const [{default:Lanyard}]=await ready;
   if(!screens.matches||current!==generation)return;
   dispose=Lanyard({container,frontImage:'portrait-hero-3730.jpg',backImage:'gallery/anna-telegram-qr.png',cardColor:'#171819',size:.6,strapLength:.28,strapColor:'#191b1d',strapWidth:.62,finish:'satin',breeze:.10,damping:.72,elasticity:.30,cornerRadius:.25,intro:!matchMedia('(prefers-reduced-motion: reduce)').matches});
  }catch(error){if(current!==generation)return;container.classList.remove('is-rendered');container.classList.add('has-fallback');console.error('Lanyard could not start',error);}
 },{rootMargin:'0px 0px -15% 0px'});
 const syncScreen=()=>{
  generation++;
  observer.disconnect();
  dispose?.();dispose=undefined;mounted=false;
  container.classList.remove('is-rendered','has-fallback');
  if(screens.matches)observer.observe(container);
 };
 screens.addEventListener('change',syncScreen);
 syncScreen();
}
