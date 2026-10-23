(()=>{'use strict';
const ROOT='https://eservicebd24.github.io/',API='https://script.google.com/macros/s/AKfycbySP1uhavqH3VwJDdDq6i0xDtdVA_CJRERaGTZheM0BwMBX_ttnrFK_8Zc5_qa2gHk9pA/exec';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function normalUrl(value,label){
 let u=String(value||'').trim();
 const routes={'Home':'','All Services':'all-services.html','All Tools':'all-services.html','Categories':'all-services.html','About':'about.html','Contact':'contact.html','Privacy Policy':'privacy.html'};
 if(!u) return ROOT+(routes[label]===undefined?'all-services.html':routes[label]);
 if(/^https?:\/\//i.test(u)){
   // Normalize the legacy extensionless All Services URL without appending a second path.
   try{const x=new URL(u);if(x.hostname==='eservicebd24.github.io' && /\/all-services\/?$/i.test(x.pathname))x.pathname='/all-services.html';return x.href}catch(e){return u}
 }
 u=u.replace(/^\/+/, '');
 if(/^all-services\/?$/i.test(u))u='all-services.html';
 return ROOT+u;
}
function applySettings(r){
 const s=r&&r.settings||{},h=document.getElementById('esbd-shared-header'),f=document.getElementById('esbd-shared-footer');
 if(!h||!f)return;
 h.style.background='linear-gradient(100deg,#041632,#062e70 65%,#172bc0)';
 h.style.color='#fff';
 if(s.headerBrand){const b=h.querySelector('.brandtext');if(b)b.innerHTML=esc(s.headerBrand)+'<small>'+esc(s.tagline||'All Online Tools in One Place')+'</small>'}
 if(s.footerColor)f.style.background=s.footerColor;
 if(s.footerText){const t=f.querySelector('.esbd-footer-text');if(t)t.textContent=s.footerText}
 if(s.privacyUrl){const a=f.querySelector('.esbd-privacy-link');if(a)a.href=normalUrl(s.privacyUrl,'Privacy Policy')}
 const nav=h.querySelector('nav');
 if(nav&&(s.headerMenuItems||s.headerMenu)){
   let items=[];try{items=JSON.parse(s.headerMenuItems||'[]')}catch(e){}
   if(!Array.isArray(items)||!items.length){
     const map={'Home':'','All Services':'all-services.html','All Tools':'all-services.html','Categories':'all-services.html','About':'about.html','Contact':'contact.html','Privacy Policy':'privacy.html'};
     items=String(s.headerMenu||'Home,All Services,About,Contact').split(',').map(label=>{label=label.trim();return {label,url:map[label]===undefined?'all-services.html':map[label]}})
   }
   nav.innerHTML=items.filter(x=>x&&String(x.label||'').trim()).map(item=>{
     let label=String(item.label||'').trim();if(/^(all tools|categories|tools)$/i.test(label))label='All Services';
     return '<a href="'+esc(normalUrl(item.url,label))+'">'+esc(label)+'</a>'
   }).join('');
 }
 if(s.footerMenu){
   const links=f.querySelector('.copyright span:last-child');
   if(links){const map={'Home':'','All Services':'all-services.html','All Tools':'all-services.html','Categories':'all-services.html','About':'about.html','Contact':'contact.html','Privacy Policy':'privacy.html'};
    links.innerHTML=String(s.footerMenu).split(',').map(label=>label.trim()).filter(Boolean).map(label=>{if(/^(all tools|categories|tools)$/i.test(label))label='All Services';return '<a href="'+esc(ROOT+(map[label]===undefined?'all-services.html':map[label]))+'">'+esc(label)+'</a>'}).join(' · ')
   }
 }
}
function loadSettings(){
 const cb='esbdSettings_'+Date.now();window[cb]=r=>{try{delete window[cb]}catch(e){}applySettings(r)};
 const sc=document.createElement('script');sc.src=API+'?api=1&action=getSettings&callback='+cb;sc.onerror=()=>{};document.head.appendChild(sc);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadSettings,{once:true});else loadSettings();
})();