const CACHE_NAME = `tanklingo-v1`;

// Use the install event to pre-cache all initial resources.
self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            cache.addAll([
                "/",
                "/offline.html",
                "/tanks/1.png",
                "/tanks/2.png",
                "/tanks/3.png",
                "/tanks/4.png",
                "/tanks/5.png",
                "/tanks/6.png",
                "/tanks/7.png",
                "/tanks/8.png",
                "/tanks/9.png",
                "/tanks/10.png",
                "/Brixton_Wood.otf",
                "/Inter-Regular.ttf",
            ]);
        })()
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);

            // Get the resource from the cache.
            const cachedResponse = await cache.match(event.request);
            if (cachedResponse) {
                return cachedResponse;
            } else {
                try {
                    // If the resource was not in the cache, try the network.
                    const fetchResponse = await fetch(event.request);

                    // Save the resource in the cache and return it.
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                } catch (e) {
                    // If the resource was not in the cache and the network is unavailable, show offline.html
                    return caches.match("/offline.html");
                }
            }
        })()
    );
});
