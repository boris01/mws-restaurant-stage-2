/* uglified */
"use strict";!function(){function e(e){return new Promise(function(t,n){e.onsuccess=function(){t(e.result)},e.onerror=function(){n(e.error)}})}function t(t,n,o){var r,a=new Promise(function(a,i){e(r=t[n].apply(t,o)).then(a,i)});return a.request=r,a}function n(e,t,n){n.forEach(function(n){Object.defineProperty(e.prototype,n,{get:function(){return this[t][n]},set:function(e){this[t][n]=e}})})}function o(e,n,o,r){r.forEach(function(r){r in o.prototype&&(e.prototype[r]=function(){return t(this[n],r,arguments)})})}function r(e,t,n,o){o.forEach(function(o){o in n.prototype&&(e.prototype[o]=function(){return this[t][o].apply(this[t],arguments)})})}function a(e,n,o,r){r.forEach(function(r){r in o.prototype&&(e.prototype[r]=function(){return e=this[n],(o=t(e,r,arguments)).then(function(e){if(e)return new s(e,o.request)});var e,o})})}function i(e){this._index=e}function s(e,t){this._cursor=e,this._request=t}function c(e){this._store=e}function l(e){this._tx=e,this.complete=new Promise(function(t,n){e.oncomplete=function(){t()},e.onerror=function(){n(e.error)},e.onabort=function(){n(e.error)}})}function d(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new l(n)}function u(e){this._db=e}n(i,"_index",["name","keyPath","multiEntry","unique"]),o(i,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),a(i,"_index",IDBIndex,["openCursor","openKeyCursor"]),n(s,"_cursor",["direction","key","primaryKey","value"]),o(s,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(t){t in IDBCursor.prototype&&(s.prototype[t]=function(){var n=this,o=arguments;return Promise.resolve().then(function(){return n._cursor[t].apply(n._cursor,o),e(n._request).then(function(e){if(e)return new s(e,n._request)})})})}),c.prototype.createIndex=function(){return new i(this._store.createIndex.apply(this._store,arguments))},c.prototype.index=function(){return new i(this._store.index.apply(this._store,arguments))},n(c,"_store",["name","keyPath","indexNames","autoIncrement"]),o(c,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),a(c,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),r(c,"_store",IDBObjectStore,["deleteIndex"]),l.prototype.objectStore=function(){return new c(this._tx.objectStore.apply(this._tx,arguments))},n(l,"_tx",["objectStoreNames","mode"]),r(l,"_tx",IDBTransaction,["abort"]),d.prototype.createObjectStore=function(){return new c(this._db.createObjectStore.apply(this._db,arguments))},n(d,"_db",["name","version","objectStoreNames"]),r(d,"_db",IDBDatabase,["deleteObjectStore","close"]),u.prototype.transaction=function(){return new l(this._db.transaction.apply(this._db,arguments))},n(u,"_db",["name","version","objectStoreNames"]),r(u,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(e){[c,i].forEach(function(t){t.prototype[e.replace("open","iterate")]=function(){var t,n=(t=arguments,Array.prototype.slice.call(t)),o=n[n.length-1],r=this._store||this._index,a=r[e].apply(r,n.slice(0,-1));a.onsuccess=function(){o(a.result)}}})}),[i,c].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,t){var n=this,o=[];return new Promise(function(r){n.iterateCursor(e,function(e){e?(o.push(e.value),void 0===t||o.length!=t?e.continue():r(o)):r(o)})})})});var p={open:function(e,n,o){var r=t(indexedDB,"open",[e,n]),a=r.request;return a.onupgradeneeded=function(e){o&&o(new d(a.result,e.oldVersion,a.transaction))},r.then(function(e){return new u(e)})},delete:function(e){return t(indexedDB,"deleteDatabase",[e])}};"undefined"!=typeof module?(module.exports=p,module.exports.default=module.exports):self.idb=p}();const e=1,t="restaurant-idb",n="restaurants";class o{static get DATABASE_URL(){return"http://localhost:1337/restaurants"}static async openIndexDB(){if("indexedDB"in window)return await idb.open(t,e,e=>{e.createObjectStore(n,{keyPath:"id"}).createIndex("by-id","id")});console.log("This browser doesn't support IndexedDB")}static async insertUpdateIndexDB(e){if(!e)return;let t=await this.openIndexDB();if(!t)return;let o=t.transaction(n,"readwrite").objectStore(n);return e.forEach(async e=>{await o.get(e.id),await o.put(e)}),t.close(),await this.getCacheFromIndexDB()}static async getCahedFromIndexDBByID(){let e=await this.openIndexDB();if(!e)return;let t=e.transaction(n,"readwrite").objectStore(n),o=await t.get(element.id);return console.log(o),e.close(),o}static async getCacheFromIndexDB(){let e=await this.openIndexDB();if(!e)return;let t=e.transaction(n,"readwrite").objectStore(n).index("by-id"),o=await t.getAll();return console.log(o),e.close(),o}static fetchRestaurants(e){fetch(o.DATABASE_URL,{method:"GET"}).then(e=>e.ok?e.json():this.getCacheFromIndexDB()).then(t=>{this.insertUpdateIndexDB(t).then(n=>{e(null,t)})}).catch(t=>{this.getCacheFromIndexDB().then(t=>{e(null,t)}).catch(e=>{console.log(`fetchRestaurants:: error ${e.message}`)})})}static fetchRestaurantById(e,t){o.fetchRestaurants((n,o)=>{if(n)t(n,null);else{const n=o.find(t=>t.id==e);n?t(null,n):t("Restaurant does not exist",null)}})}static fetchRestaurantByCuisine(e,t){o.fetchRestaurants((n,o)=>{if(n)t(n,null);else{const n=o.filter(t=>t.cuisine_type==e);t(null,n)}})}static fetchRestaurantByNeighborhood(e,t){o.fetchRestaurants((n,o)=>{if(n)t(n,null);else{const n=o.filter(t=>t.neighborhood==e);t(null,n)}})}static fetchRestaurantByCuisineAndNeighborhood(e,t,n){o.fetchRestaurants((o,r)=>{if(o)n(o,null);else{let o=r;"all"!=e&&(o=o.filter(t=>t.cuisine_type==e)),"all"!=t&&(o=o.filter(e=>e.neighborhood==t)),n(null,o)}})}static fetchNeighborhoods(e){o.fetchRestaurants((t,n)=>{if(t)e(t,null);else{const t=n.map((e,t)=>n[t].neighborhood),o=t.filter((e,n)=>t.indexOf(e)==n);e(null,o)}})}static fetchCuisines(e){o.fetchRestaurants((t,n)=>{if(t)e(t,null);else{const t=n.map((e,t)=>n[t].cuisine_type),o=t.filter((e,n)=>t.indexOf(e)==n);e(null,o)}})}static urlForRestaurant(e){return`./restaurant.html?id=${e.id}`}static imageUrlForRestaurant(e){return`/img/${e.photograph}.jpg.webp`}static mapMarkerForRestaurant(e,t){return new google.maps.Marker({position:e.latlng,title:e.name,url:o.urlForRestaurant(e),map:t,animation:google.maps.Animation.DROP})}}function r(e){this.dialogEl=e,this.focusedElBeforeOpen;let t=this.dialogEl.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]');this.focusableEls=Array.prototype.slice.call(t),this.firstFocusableEl=this.focusableEls[0],this.lastFocusableEl=this.focusableEls[this.focusableEls.length-1],this.close()}r.prototype.open=function(){let e=this;this.dialogEl.removeAttribute("aria-hidden"),this.focusedElBeforeOpen=document.activeElement,this.dialogEl.addEventListener("keydown",function(t){e._handleKeyDown(t)}),this.dialogEl.style.display="block",this.firstFocusableEl.focus()},r.prototype.close=function(){this.dialogEl.setAttribute("aria-hidden",!0),this.focusedElBeforeOpen&&(this.focusedElBeforeOpen.focus(),console.log(this.focusedElBeforeOpen+" button focused")),this.dialogEl.style.display="none"},r.prototype._handleKeyDown=function(e){let t=this;switch(e.keyCode){case 9:if(1===t.focusableEls.length){e.preventDefault();break}e.shiftKey?document.activeElement===t.firstFocusableEl?(e.preventDefault(),t.lastFocusableEl.focus(),console.log("Dismiss button focused")):(e.preventDefault(),t.firstFocusableEl.focus(),console.log("Refresh button focused")):document.activeElement===t.lastFocusableEl?(e.preventDefault(),t.firstFocusableEl.focus(),console.log("Refresh button focused")):(e.preventDefault(),t.lastFocusableEl.focus(),console.log("Dismiss button focused"));break;case 27:t.close()}},r.prototype.addEventListeners=function(e,t){let n=this,o=document.querySelectorAll(t);for(let e=0;e<o.length;e++)o[e].addEventListener("click",function(){n.close()})},window.initMap=(()=>{a((e,t)=>{e?console.error(e):(self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:t.latlng,scrollwheel:!1}),o.mapMarkerForRestaurant(self.restaurant,self.map))})});const a=e=>{if(self.restaurant)return void e(null,self.restaurant);const t=s("id");t?o.fetchRestaurantById(t,(t,n)=>{self.restaurant=n,n?e(null,n):console.error(t)}):e("No restaurant id in URL",null)},i=(e,t)=>{const n=document.createElement("li");n.setAttribute("tabindex",t);const o=document.createElement("div");o.id="review-header";const r=document.createElement("p");r.className="review-name",r.innerHTML=e.name,o.appendChild(r);const a=document.createElement("p");a.className="review-date",a.innerHTML=e.date,o.appendChild(a),n.appendChild(o);const i=document.createElement("div");i.className="review-rating-div";const s=document.createElement("p");s.className="review-rating",s.innerHTML=`Rating: ${e.rating}`,i.appendChild(s),n.appendChild(i);const c=document.createElement("p");return c.className="review-comment",c.innerHTML=e.comments,n.appendChild(c),n},s=(e,t)=>{t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");const n=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null},c=e=>{e.classList.add("fade-in"),e.dataset&&e.dataset.src&&(e.src=e.dataset.src),e.dataset&&e.dataset.srcset&&(e.srcset=e.dataset.srcset)};document.addEventListener("DOMContentLoaded",e=>{let t=window.matchMedia("(max-width: 744px)");t.matches?(console.log("matched"),d(!0)):(console.log("not matched"),d(!1)),t.addListener(l),a((e,t)=>{e?console.error(e):(((e=self.restaurant)=>{document.getElementById("restaurant-name").innerHTML=e.name,document.getElementById("restaurant-address").innerHTML=e.address;const t=document.getElementById("restaurant-img"),n=document.createElement("source");n.setAttribute("media","(max-width:360px)"),n.setAttribute("data-srcset",o.imageUrlForRestaurant(e).replace(".jpg.webp","_300.jpg.webp")),t.appendChild(n);const r=document.createElement("source");r.setAttribute("media","(max-width:460px)"),r.setAttribute("data-srcset",o.imageUrlForRestaurant(e).replace(".jpg.webp","_400.jpg.webp")),t.appendChild(r);const a=document.createElement("source");a.setAttribute("media","(max-width:300px)"),a.setAttribute("data-srcset",o.imageUrlForRestaurant(e).replace(".jpg.webp","_300.jpg.webp")),t.appendChild(a);const s=document.createElement("source");s.setAttribute("media","(max-width:400px)"),s.setAttribute("data-srcset",o.imageUrlForRestaurant(e).replace(".jpg.webp","_400.jpg.webp")),t.appendChild(s);const c=document.createElement("source");c.setAttribute("media","(max-width:600px)"),c.setAttribute("data-srcset",o.imageUrlForRestaurant(e).replace(".jpg.webp","_600.jpg.webp")),t.appendChild(c);const l=document.createElement("source");l.setAttribute("media","(min-width:601px)"),l.setAttribute("data-srcset",o.imageUrlForRestaurant(e)),t.appendChild(l);const d=document.createElement("img");d.className="restaurant-img",d.setAttribute("data-src",o.imageUrlForRestaurant(e)),d.alt="Restaurant ".concat(e.name),t.appendChild(d),document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type,e.operating_hours&&((e=self.restaurant.operating_hours)=>{const t=document.getElementById("restaurant-hours");for(let n in e){const o=document.createElement("tr"),r=document.createElement("td");r.innerHTML=n,o.appendChild(r);const a=document.createElement("td");a.innerHTML=e[n],o.appendChild(a),t.appendChild(o)}})(),((e=self.restaurant.reviews)=>{const t=document.getElementById("reviews-container"),n=document.createElement("h3");if(n.innerHTML="Reviews",t.appendChild(n),!e){const e=document.createElement("p");return e.innerHTML="No reviews yet!",void t.appendChild(e)}const o=document.getElementById("reviews-list");let r=9;e.forEach(e=>{o.appendChild(i(e,r)),r++}),t.appendChild(o)})()})(),(()=>{let e=document.querySelectorAll("source, img"),t=document.getElementById("map");if("IntersectionObserver"in window){let n=new IntersectionObserver(function(e,n){e.forEach(e=>{e.intersectionRatio>.5&&(e.target===t?(console.log(e.intersectionRatio),(()=>{const e=document.createElement("script");e.src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBFeL_3upfjewT5kik74_YRMizmEuoBFnU&libraries=places&callback=initMap",document.getElementsByTagName("head")[0].appendChild(e)})()):c(e.target),n.unobserve(e.target))})},{root:null,rootMargin:"0px",threshold:1});e.forEach(e=>n.observe(e)),n.observe(t)}else e.forEach(e=>c(e))})(),((e=self.restaurant)=>{const t=document.getElementById("breadcrumb"),n=document.createElement("li"),o=document.createElement("a");o.setAttribute("href","#"),o.setAttribute("aria-current","page"),o.className="current-page-link",o.innerHTML=e.name,o.tabIndex=3,n.appendChild(o),t.appendChild(n)})())})});const l=e=>{e.matches?(console.log("matched"),d(!0)):(console.log("not matched"),d(!1))},d=e=>{let t=document.getElementById("maincontent"),n=document.getElementById("top-container"),o=document.getElementById("map-container");e?(n.removeChild(o),t.appendChild(o)):o.parentNode===t&&(t.removeChild(o),n.appendChild(o))};function u(e){e.addEventListener("statechange",function(){"installed"==e.state&&p(e)})}function p(e){let t=document.getElementById("openModal"),n=document.getElementById("btnRefresh"),o=new r(t);o.addEventListeners(".modalWindow",".cancel"),o.open(),n.addEventListener("click",function(){e.postMessage({action:"skipWaiting"}),n.removeEventListener("click",e.postMessage({action:"skipWaiting"}))})}(()=>new Promise((e,t)=>{var n;navigator.serviceWorker&&(function(){let e=document.getElementsByTagName("body").item(0),t=document.createElement("div");t.className="modalWindow",t.id="openModal",t.setAttribute("role","alertdialog"),t.setAttribute("aria-labelledby","modalHeader"),t.setAttribute("tabindex","-1");let n=document.createElement("div"),o=document.createElement("div");o.className="modalHeader";let r=document.createElement("h2");r.id=o,r.innerHTML="New version available";let a=document.createElement("div");a.className="modalButtons";let i=document.createElement("div"),s=document.createElement("button");s.id="btnRefresh",s.className="ok",s.setAttribute("role","button"),s.setAttribute("aria-label","Refresh application"),s.setAttribute("title","Refresh"),s.setAttribute("tabindex","-1"),s.innerHTML="Refresh?",i.appendChild(s);let c=document.createElement("div"),l=document.createElement("button");l.id="btnDismiss",l.className="cancel",l.setAttribute("role","button"),l.setAttribute("aria-label","Dismiss this alert"),l.setAttribute("title","Dismiss"),l.setAttribute("tabindex","-1"),l.innerHTML="Dismiss",c.appendChild(l),a.appendChild(i),a.appendChild(c),o.appendChild(r),o.appendChild(a),n.appendChild(o),t.appendChild(n),e.appendChild(t)}(),window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").then(function(e){if(navigator.serviceWorker.controller){if(e.waiting)return console.log("Waiting"),void p(e.waiting);if(e.installing)return console.log("Installing"),void u(e.installing);e.addEventListener("updatefound",function(){console.log("Update found"),u(e.installing)}),console.log("ServiceWorker successfuly registerd: ",e.scope)}})},function(e){console.log("ServiceWorker registration failed: ",e)}),navigator.serviceWorker.addEventListener("controllerchange",function(){console.log("controllerchange"),n||(window.location.reload(),n=!0)}))}))();