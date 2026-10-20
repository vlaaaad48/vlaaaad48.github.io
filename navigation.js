(() => {
 const button=document.querySelector('.menu-toggle');
 const nav=document.querySelector('#nav');
 const main=document.querySelector('main');
 const wordmark=document.querySelector('.wordmark');
 const mobile=matchMedia('(max-width:700px)');
 let open=false;
 let savedY=0;
 let bodyStyles;
 const notify=()=>window.dispatchEvent(new CustomEvent('site-menu-change',{detail:{open}}));
 function close({restoreFocus=true}={}){
  if(!open)return;
  open=false;
  document.body.classList.remove('menu-open');
  nav.classList.remove('open');
  nav.inert=mobile.matches;
  main.inert=false;wordmark.inert=false;
  button.setAttribute('aria-expanded','false');
  button.setAttribute('aria-label','Открыть меню');
  Object.assign(document.body.style,bodyStyles);
  window.scrollTo({top:savedY,behavior:'instant'});
  notify();
  if(restoreFocus)button.focus({preventScroll:true});
 }
 function show(){
  if(!mobile.matches)return;
  savedY=window.scrollY;
  bodyStyles={position:document.body.style.position,top:document.body.style.top,width:document.body.style.width};
  open=true;notify();
  document.body.classList.add('menu-has-opened');
  // Establish the closed pose before enabling the first user-triggered transition.
  void nav.offsetWidth;
  document.body.classList.add('menu-open');
  Object.assign(document.body.style,{position:'fixed',top:`${-savedY}px`,width:'100%'});
  nav.inert=false;main.inert=true;wordmark.inert=true;
  nav.classList.add('open');
  button.setAttribute('aria-expanded','true');
  button.setAttribute('aria-label','Закрыть меню');
  nav.querySelector('a').focus({preventScroll:true});
 }
 button.addEventListener('click',()=>open?close():show());
 nav.addEventListener('click',event=>{const link=event.target.closest('a[href]');if(link)close({restoreFocus:false});});
 document.addEventListener('keydown',event=>{
  if(!open)return;
  if(event.key==='Escape'){event.preventDefault();close();return;}
  if(event.key==='Tab'){
   const items=[button,...nav.querySelectorAll('a[href],button:not([disabled])')].filter(item=>getComputedStyle(item).display!=='none'&&getComputedStyle(item).visibility!=='hidden');
   const first=items[0],last=items.at(-1);
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
 });
 mobile.addEventListener('change',()=>{document.body.classList.remove('menu-has-opened');close({restoreFocus:false});nav.inert=mobile.matches;});
 window.addEventListener('pageshow',event=>{
  if(event.persisted){document.body.classList.remove('menu-has-opened');close({restoreFocus:false});}
 });
 nav.classList.remove('open');
 document.body.classList.remove('menu-open','menu-has-opened');
 button.setAttribute('aria-expanded','false');
 nav.inert=mobile.matches;
 window.siteMenu={close};
})();
