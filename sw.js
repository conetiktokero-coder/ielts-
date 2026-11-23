const C="c1-v5";const F=["./","index.html","manifest.json","icon.png","icon-180.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(C).then(c=>Promise.all(F.map(u=>fetch(u,{cache:"reload"}).then(r=>c.put(u,r))))).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
// red primero (si hay internet coge la última versión), caché si no hay conexión
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;
  e.respondWith(fetch(e.request,{cache:"no-cache"}).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));return res})
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match("index.html"))))});
