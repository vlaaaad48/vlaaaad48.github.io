const caseIllustrations=['onboarding-bridge','talent-garden','hr-weaving'];
const casesRoot=document.querySelector('#cases');
portfolioContent.cases.forEach((item,index)=>{const article=document.createElement('article');article.className='case';article.innerHTML=`<button class="case-button" data-case="${index}" aria-haspopup="dialog"><div class="case-art" aria-hidden="true"><img src="gallery/${caseIllustrations[index]}-clear.webp" alt="" width="768" height="768" loading="lazy" decoding="async"></div><div class="case-copy"><div class="case-meta"><span>${item.category}</span></div><h3>${item.title.replace(/ *—\n/g,'\n— ').replace('\n','<br> ')}</h3><p>${item.subtitle}</p></div><span class="case-link" aria-hidden="true"><span>↗</span></span></button>`;casesRoot.append(article)});
document.querySelector('#principles').innerHTML=portfolioContent.principles.map((p,i)=>`<article class="principle"><span>0${i+1}</span><div><h3>${p.title}</h3><p>${p.text}</p></div></article>`).join('');
const dialog=document.querySelector('#case-dialog');let previousFocus;
casesRoot.addEventListener('click',event=>{const button=event.target.closest('[data-case]');if(!button)return;previousFocus=button;const item=portfolioContent.cases[Number(button.dataset.case)];document.querySelector('#dialog-title').textContent=item.title.replace('\n',' ');document.querySelector('#dialog-content').innerHTML=item.fields.map((text,i)=>`<div class="case-field"><span>0${i+1}</span><p>${text}</p></div>`).join('');window.applyTypography?.(dialog);window.replaceArrowIcons?.(dialog);dialog.setAttribute('aria-labelledby','dialog-title');dialog.showModal();document.body.classList.add('modal-open')});
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');previousFocus?.focus()});


window.applyTypography?.(document.body);

window.replaceArrowIcons?.(document.body);
