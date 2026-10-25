// 킥오프 라이프 서비스 워커: 인터넷이 없어도 이어 하기
// 페이지는 항상 네트워크 먼저 (새 버전이 바로 보이게) · 안 되면 저장해 둔 것으로 · 폰트는 저장본 먼저
const C='kl-v1';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./manifest.webmanifest','./icon-192.png','./icon-512.png'])).catch(()=>{}))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.origin===location.origin){if(u.searchParams.has('v'))return;   // 새 버전 확인 요청은 그대로 네트워크로
    e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(m=>m||caches.match('./'))));return}
  if(/fonts\.(googleapis|gstatic)\.com$/.test(u.host)){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res})))}
});
