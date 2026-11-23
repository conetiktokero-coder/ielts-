const C="c1-v6";const F=["./","index.html","manifest.json","icon.png","icon-180.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(C).then(c=>Promise.all(F.map(u=>fetch(u,{cache:"reload"}).then(r=>c.put(u,r))))).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
// Red primero para recibir actualizaciones, pero como mucho 2,5 s: con poca cobertura (metro, tren)
// se abre al instante desde la caché y la versión nueva se guarda en segundo plano para la próxima vez.
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET"||!e.request.url.startsWith(self.location.origin))return;
  e.respondWith((async()=>{
    const cache=await caches.open(C);
    const net=fetch(e.request,{cache:"no-cache"}).then(res=>{if(res.ok)cache.put(e.request,res.clone());return res});
    e.waitUntil(net.catch(()=>{}));
    const cached=await cache.match(e.request,{ignoreSearch:true})||(e.request.mode==="navigate"?await cache.match("index.html"):undefined);
    if(!cached)return net.catch(()=>cache.match("index.html"));
    return Promise.race([net.catch(()=>cached),new Promise(r=>setTimeout(()=>r(cached),2500))]);
  })());
});
