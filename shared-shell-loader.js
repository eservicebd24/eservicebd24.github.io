/* eServiceBD24 shared header/footer loader for GitHub Pages.
   Add <div id="esbd-header-slot"></div> after <body> and
   <div id="esbd-footer-slot"></div> before </body>, then include this file. */
(()=>{'use strict';
 const ROOT='https://eservicebd24.github.io/';
 const FALLBACK_HEADER=`<header id="esbd-shared-header"><a href="${ROOT}">☁ eServiceBD24</a> · <a href="${ROOT}all-services.html">All Tools</a></header>`;
 const FALLBACK_FOOTER=`<footer id="esbd-shared-footer">© 2026 eServiceBD24. All Rights Reserved. · <a href="${ROOT}privacy.html">Privacy Policy</a></footer>`;
 async function insert(url,slotId,selector,position){
  const slot=document.getElementById(slotId); if(!slot && document.querySelector(selector)) return;
  try {const r=await fetch(ROOT+url+'?v='+encodeURIComponent(document.documentElement.dataset.shellVersion||'20261024-mobile-dropdown-right-v4'));if(!r.ok)throw Error('HTTP '+r.status);const html=await r.text();if(slot)slot.outerHTML=html;else if(position==='start')document.body.insertAdjacentHTML('afterbegin',html);else document.body.insertAdjacentHTML('beforeend',html);}
  catch(e){if(slot)slot.outerHTML=position==='start'?FALLBACK_HEADER:FALLBACK_FOOTER;else if(!document.querySelector(selector))document.body.insertAdjacentHTML(position==='start'?'afterbegin':'beforeend',position==='start'?FALLBACK_HEADER:FALLBACK_FOOTER);console.warn('eServiceBD24 shared shell fallback:',url,e);}
 }
 async function init(){await insert('header.html','esbd-header-slot','#esbd-shared-header','start');await insert('footer.html','esbd-footer-slot','#esbd-shared-footer','end');}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
