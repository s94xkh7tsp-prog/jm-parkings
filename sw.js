'use strict';
const CACHE='jm-parking-charleroi-airport-v12';
const BASE=new URL('./',self.location.href).href;
const FILES=['','index.html','gestion.html','manifest.json','icon-192.png','icon-512.png','icon-maskable.png','apple-touch-icon.png','revolut-qr.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(file=>BASE+file))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('jm-parking-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(BASE))return;
 if(req.mode==='navigate'){
  event.respondWith((async()=>{const cache=await caches.open(CACHE);const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),3000);try{const response=await fetch(req,{signal:controller.signal});if(!response.ok)throw Error('navigation');event.waitUntil(cache.put(url.href,response.clone()));return response;}catch(_){return (await cache.match(url.href))||(await cache.match(BASE+(url.pathname.endsWith('gestion.html')?'gestion.html':'index.html')))||Response.error();}finally{clearTimeout(timer);}})());return;
 }
 if(FILES.some(file=>BASE+file===url.href))event.respondWith(caches.match(req).then(cached=>cached||fetch(req)));
});
