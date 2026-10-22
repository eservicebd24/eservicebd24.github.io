(()=>{'use strict';const ROOT='https://eservicebd24.github.io/',API='https://script.google.com/macros/s/AKfycbySP1uhavqH3VwJDdDq6i0xDtdVA_CJRERaGTZheM0BwMBX_ttnrFK_8Zc5_qa2gHk9pA/exec';const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));async function shell(){
 if(window.__esbdSharedShellLoading||window.__esbdSharedShellLoaded)return;
 window.__esbdSharedShellLoading=true;
 try{
  const [a,b]=await Promise.all([fetch(ROOT+'header.html?'+Date.now(),{cache:'no-store'}),fetch(ROOT+'footer.html?'+Date.now(),{cache:'no-store'})]);
  if(!a.ok||!b.ok)throw new Error('Shared shell files unavailable');
  const h=(await a.text()).trim(),f=(await b.text()).trim();
  // Remove every legacy/page-specific header/footer so old navigation cannot remain.
  document.querySelectorAll('body header:not(#esbd-shared-header)').forEach(n=>n.remove());
  document.querySelectorAll('body footer:not(#esbd-shared-footer)').forEach(n=>n.remove());
  const oldH=document.getElementById('esbd-shared-header');if(oldH)oldH.remove();
  const oldF=document.getElementById('esbd-shared-footer');if(oldF)oldF.remove();
  document.body.insertAdjacentHTML('afterbegin',h);
  document.body.insertAdjacentHTML('beforeend',f);
  window.__esbdSharedShellLoaded=true;
 }catch(e){
  if(!document.getElementById('esbd-shared-header'))document.body.insertAdjacentHTML('afterbegin','<header id="esbd-shared-header"><a href="'+ROOT+'">☁ eServiceBD24</a><nav><a href="'+ROOT+'">Home</a><a href="'+ROOT+'all-services.html">All Services</a><a href="'+ROOT+'about.html">About</a><a href="'+ROOT+'contact.html">Contact</a></nav></header>');
  if(!document.getElementById('esbd-shared-footer'))document.body.insertAdjacentHTML('beforeend','<footer id="esbd-shared-footer">© 2026 eServiceBD24 · <a href="'+ROOT+'privacy.html">Privacy Policy</a></footer>');
 }finally{window.__esbdSharedShellLoading=false}
 settings();
}
function settings(){let cb='esbdShell'+Date.now();window[cb]=r=>{delete window[cb];let s=r&&r.settings||{},h=document.getElementById('esbd-shared-header'),f=document.getElementById('esbd-shared-footer');if(!h||!f)return;if(s.headerBrand){let b=h.querySelector('.brandtext');if(b)b.innerHTML=esc(s.headerBrand)+'<small>'+esc(s.tagline||'All Online Tools in One Place')+'</small>'}if(s.headerColor)h.style.background=s.headerColor;if(s.footerColor)f.style.background=s.footerColor;if(s.footerText){let t=f.querySelector('.esbd-footer-text');if(t)t.textContent=s.footerText}if(s.privacyUrl){let a=f.querySelector('.esbd-privacy-link');if(a)a.href=s.privacyUrl}if(s.headerMenu){let nav=h.querySelector('nav');if(nav){const routes={'Home':'','All Services':'all-services.html','About':'about.html','Contact':'contact.html','Privacy Policy':'privacy.html'};nav.innerHTML=String(s.headerMenu).split(',').map(x=>x.trim()).filter(Boolean).map(label=>'<a href="'+ROOT+(routes[label]===undefined?'all-services.html':routes[label])+'">'+esc(label)+'</a>').join('')}}if(s.footerMenu){let links=f.querySelector('.copyright span:last-child');if(links){const routes={'Home':'','All Services':'all-services.html','About':'about.html','Contact':'contact.html','Privacy Policy':'privacy.html'};links.innerHTML=String(s.footerMenu).split(',').map(x=>x.trim()).filter(Boolean).map(label=>'<a href="'+ROOT+(routes[label]===undefined?'all-services.html':routes[label])+'">'+esc(label)+'</a>').join(' · ')}}};let sc=document.createElement('script');sc.src=API+'?api=1&action=getSettings&callback='+cb;document.head.appendChild(sc)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',shell);else shell()})();