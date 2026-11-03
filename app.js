const VIBES = [
  {k:"water", l:"🌊 On the water"},
  {k:"music", l:"🎸 Live music"},
  {k:"dog", l:"🐶 Bring the pup"},
  {k:"cheap", l:"💸 Cheap eats"},
  {k:"date", l:"🕯 Date night"},
  {k:"breakfast", l:"🥞 Breakfast"},
  {k:"brewery", l:"🍺 Breweries"},
  {k:"family", l:"👨‍👩‍👧 Family"},
  {k:"oceanfront", l:"🏖 Oceanfront"},
  {k:"saved", l:"♥ My spots"}
];
const TAG_LABEL = {water:"Waterfront", music:"Live music", dog:"Dog-friendly", breakfast:"Breakfast", date:"Date night", brewery:"Brewery", family:"Family", oceanfront:"Oceanfront"};
const GRADS = ["#ffd6a5,#ffadad","#caffbf,#9bf6ff","#bdb2ff,#ffc6ff","#fdffb6,#ffd6a5","#a0c4ff,#bdb2ff","#9bf6ff,#caffbf"];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const WHEN_MIN = {breakfast:8*60, lunch:12*60, dinner:19*60, late:22*60};

const update = () => { render(); fit(); };
const state = {vibes:new Set(), price:0, when:"any", day:new Date().getDay(), q:"", me:null, hl:null};
let saved = new Set();
try { saved = new Set(JSON.parse(localStorage.getItem("gse-saved") || "[]")); } catch (e) {}
const persist = () => { try { localStorage.setItem("gse-saved", JSON.stringify([...saved])); } catch (e) {} };

// Parses OpenStreetMap hours, e.g. "Mo-Th 11:00-15:00,17:00-21:00; Fr,Sa 11:00-02:00; Su off".
// week[day] is a list of [open, close] minute spans; close runs past 1440 when a place closes after midnight.
const DAY_RE = "(?:Mo|Tu|We|Th|Fr|Sa|Su)";
function parseHours(h) {
  if (!h) return null;
  const week = Array.from({length:7}, () => []);
  const rules = h.split(";").flatMap(r => r.split(new RegExp(`,\\s+(?=${DAY_RE})`))).map(s => s.trim()).filter(Boolean);
  for (const rule of rules) {
    const m = rule.match(new RegExp(`^(${DAY_RE}(?:-${DAY_RE})?(?:,${DAY_RE}(?:-${DAY_RE})?)*)\\s*(.*)$`));
    const dayPart = m ? m[1] : "Mo-Su", timePart = (m ? m[2] : rule).trim();
    const days = new Set();
    for (const seg of dayPart.split(",")) {
      const [a, b] = seg.split("-").map(d => DAYS.indexOf(d));
      if (b === undefined) days.add(a);
      else for (let i = a; ; i = (i + 1) % 7) { days.add(i); if (i === b) break; }
    }
    const spans = [];
    if (!/^(off|closed)?$/i.test(timePart)) {
      for (const t of timePart.split(",")) {
        const tm = t.match(/(\d{1,2}):(\d\d)\s*-+\s*(\d{1,2}):(\d\d)/);
        if (!tm) continue;
        const o = +tm[1] * 60 + +tm[2]; let c = +tm[3] * 60 + +tm[4];
        if (c <= o) c += 1440;
        spans.push([o, c]);
      }
    }
    days.forEach(d => week[d] = spans);
  }
  return week;
}
PLACES.forEach(p => p.week = parseHours(p.h));

const fmt = m => { const h = Math.floor(m / 60) % 24, mm = m % 60; return `${h % 12 || 12}${mm ? ":" + String(mm).padStart(2, "0") : ""} ${h < 12 ? "AM" : "PM"}`; };

// Returns the span open at this moment, including last night's hours that run past midnight.
function spanAt(p, day, min) {
  return p.week[day].find(s => min >= s[0] && min < s[1]) ||
    p.week[(day + 6) % 7].find(s => s[1] > 1440 && min + 1440 < s[1]);
}

function openAt(p, day, min) {
  if (!p.week) return null;
  return !!spanAt(p, day, min);
}

function statusNow(p) {
  if (!p.week) return {cls:"unk", txt:p.hn || "Hours not confirmed yet"};
  const d = new Date(), day = d.getDay(), min = d.getHours() * 60 + d.getMinutes();
  const s = spanAt(p, day, min);
  if (s) return {cls:"open", txt:`Open · closes ${fmt(s[1])}`};
  const later = p.week[day].find(x => x[0] > min);
  if (later) return {cls:"closed", txt:`Closed · opens ${fmt(later[0])}`};
  for (let i = 1; i <= 7; i++) { const n = p.week[(day + i) % 7][0]; if (n) return {cls:"closed", txt:`Closed · opens ${i === 1 ? "tomorrow" : DAY_NAMES[(day + i) % 7]} ${fmt(n[0])}`}; }
  return {cls:"closed", txt:"Closed"};
}

function miles(a, b) {
  const R = 3958.8, r = x => x * Math.PI / 180;
  const dLat = r(b.lat - a.lat), dLon = r(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function matches(p) {
  for (const v of state.vibes) {
    if (v === "cheap") { if (p.p !== 1) return false; }
    else if (v === "saved") { if (!saved.has(p.id)) return false; }
    else if (!p.tags.includes(v)) return false;
  }
  if (state.price && p.p !== state.price) return false;
  if (state.when !== "any") {
    const now = new Date();
    const min = state.when === "now" ? now.getHours() * 60 + now.getMinutes() : WHEN_MIN[state.when];
    const day = state.when === "now" ? now.getDay() : state.day;
    if (openAt(p, day, min) === false) return false; // unknown hours stay visible
  }
  if (state.q) {
    const q = state.q.toLowerCase();
    if (!(p.n + " " + p.c + " " + p.area).toLowerCase().includes(q)) return false;
  }
  return true;
}

// ---------- UI ----------
const $ = id => document.getElementById(id);
$("vibes").innerHTML = VIBES.map(v => `<button class="vibe" data-k="${v.k}">${v.l}</button>`).join("");
$("price").innerHTML = ["All", "$", "$$", "$$$", "$$$$"].map((l, i) => `<button data-p="${i}" class="${i === 0 ? "on" : ""}">${l}</button>`).join("");
$("day").innerHTML = DAY_NAMES.map((d, i) => `<option value="${i}" ${i === state.day ? "selected" : ""}>${i === new Date().getDay() ? "Today" : d}</option>`).join("");

$("vibes").onclick = e => { const b = e.target.closest(".vibe"); if (!b) return; const k = b.dataset.k; state.vibes.has(k) ? state.vibes.delete(k) : state.vibes.add(k); b.classList.toggle("on"); update(); };
$("price").onclick = e => { const b = e.target.closest("button"); if (!b) return; state.price = +b.dataset.p; [...$("price").children].forEach(x => x.classList.toggle("on", x === b)); update(); };
$("when").onchange = e => { state.when = e.target.value; $("day").style.display = state.when === "now" ? "none" : ""; update(); };
$("day").onchange = e => { state.day = +e.target.value; update(); };
$("q").oninput = e => { state.q = e.target.value.trim(); update(); };
$("viewtoggle").onclick = () => { const m = $("main").classList.toggle("showmap"); $("viewtoggle").textContent = m ? "📋 List" : "🗺 Map"; if (m) setTimeout(() => { map.invalidateSize(); fit(); }, 50); };

// ---------- Map ----------
const map = L.map("map", {zoomControl:false}).setView([33.70, -78.88], 11);
L.control.zoom({position:"topright"}).addTo(map);
// OpenFreeMap: free vector tiles, no key, commercial use allowed.
L.maplibreGL({style:"https://tiles.openfreemap.org/styles/liberty", attribution:'<a href="https://openfreemap.org" target="_blank">OpenFreeMap</a> © <a href="https://www.openmaptiles.org/" target="_blank">OpenMapTiles</a> Data from <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'}).addTo(map);
const layer = L.layerGroup().addTo(map);
let meMarker = null;

function card(p, i) {
  const st = statusNow(p);
  const dist = state.me ? `${miles(state.me, p).toFixed(1)} mi · ` : "";
  const menu = p.web || `https://www.google.com/search?q=${encodeURIComponent(p.n + " " + p.area + " SC menu")}`;
  const dir = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}`;
  return `<article class="card ${state.hl === p.id ? "hl" : ""} ${p.f ? "feat" : ""}" id="c${p.id}" data-id="${p.id}">
    <div class="thumb" style="background:linear-gradient(135deg,${GRADS[i % GRADS.length]})">${p.e}</div>
    <div>
      <div class="name"><span>${p.n}</span><button class="heart" data-save="${p.id}" aria-label="Save">${saved.has(p.id) ? "❤️" : "🤍"}</button></div>
      <div class="meta">${dist}${p.area} · ${p.c}${p.p ? ` · <b>${"$".repeat(p.p)}</b>` : ""}</div>
      <div class="status" style="color:var(--${st.cls})"><span class="dot" style="background:var(--${st.cls})"></span>${st.txt}</div>
      <div class="tags">${p.f ? `<span class="tag feat">⭐ Featured</span>` : ""}${p.tags.map(t => `<span class="tag">${TAG_LABEL[t]}</span>`).join("")}</div>
      <div class="acts">
        <a href="${menu}" target="_blank" rel="noopener">📖 Menu</a>
        <a href="${dir}" target="_blank" rel="noopener">🧭 Go</a>
        ${p.tel ? `<a href="tel:${p.tel}">📞 Call</a>` : ""}
      </div>
    </div>
  </article>`;
}

// GetYourGuide affiliate links (partner GFIFJ6X), shown as a "Things to do" box in the list.
const GYG = q => `https://www.getyourguide.com/s/?q=${encodeURIComponent(q)}&partner_id=GFIFJ6X&utm_medium=online_publisher`;
// Stay22 hotel links (aid grandstrandeats): a Booking.com search for the area.
const STAY = a => `https://www.stay22.com/allez/booking?link=${encodeURIComponent("https://www.booking.com/searchresults.html?ss=" + a + ", South Carolina")}&aid=grandstrandeats`;
const STAY_AREAS = ["Myrtle Beach", "North Myrtle Beach", "Surfside Beach", "Murrells Inlet", "Garden City"];
const TODO = [
  ["🐬", "Dolphin cruises", "Myrtle Beach dolphin"],
  ["🌅", "Sunset cruises", "Myrtle Beach sunset cruise"],
  ["🎭", "Dinner shows", "Myrtle Beach dinner show"],
  ["🛶", "Kayak & river tours", "Myrtle Beach kayak"],
  ["🎣", "Fishing trips", "Myrtle Beach fishing"],
  ["🎟", "All things to do", "Myrtle Beach"],
];
function todoBox() {
  return `<div class="todo"><div class="todo-h">After dinner: things to do on the Grand Strand</div>
    <div class="todo-links">${TODO.map(([e, label, q]) => `<a href="${GYG(q)}" target="_blank" rel="noopener sponsored">${e} ${label}</a>`).join("")}</div>
    <div class="todo-h" style="margin-top:12px">Where to stay</div>
    <div class="todo-links">${STAY_AREAS.map(a => `<a href="${STAY(a)}" target="_blank" rel="noopener sponsored">🏨 ${a}</a>`).join("")}</div>
    <div class="todo-f">Tours booked through GetYourGuide, hotels through Stay22. Affiliate links.</div></div>`;
}

let shown = [];
function render() {
  shown = PLACES.filter(matches);
  // Featured spots go first unless the list is sorted by distance.
  if (state.me) shown.sort((a, b) => miles(state.me, a) - miles(state.me, b));
  else shown.sort((a, b) => (b.f || 0) - (a.f || 0));
  const list = $("list");
  list.innerHTML = `<div class="note">🧪 Early version: ${PLACES.length} local Grand Strand spots. Locations are from OpenStreetMap; vibes, prices and hours are still being verified.</div>
    <div class="count"><span>${shown.length} spot${shown.length === 1 ? "" : "s"} match</span>${state.vibes.size || state.price || state.when !== "any" || state.q ? `<button class="iconbtn" id="clear">Clear</button>` : ""}</div>` +
    (shown.length ? shown.map((p, i) => (i === 6 ? todoBox() : "") + card(p)).join("") + (shown.length <= 6 ? todoBox() : "") : `<div class="empty">No matches. Try fewer vibes.</div>` + todoBox()) +
    `<div class="foot">Some links on Grand Strand Eats are affiliate links. If you book a tour, activity or stay through them, we may earn a small commission at no extra cost to you. Spots marked ⭐ Featured may be paid placements; every other listing is free.<div class="guides">Guides: <a href="waterfront-restaurants-myrtle-beach/">Waterfront restaurants</a> · <a href="breakfast-myrtle-beach/">Myrtle Beach breakfast</a> · <a href="murrells-inlet-restaurants/">Murrells Inlet &amp; MarshWalk</a> · <a href="north-myrtle-beach-restaurants/">North Myrtle Beach</a> · <a href="surfside-beach-restaurants/">Surfside Beach</a></div></div>`;
  const c = $("clear"); if (c) c.onclick = clearAll;

  layer.clearLayers();
  shown.forEach(p => {
    const st = statusNow(p);
    const icon = L.divIcon({className:"", html:`<div class="pin ${st.cls === "closed" ? "closed" : ""}"><span>${p.e}</span></div>`, iconSize:[34, 34], iconAnchor:[17, 34]});
    L.marker([p.lat, p.lon], {icon}).addTo(layer).bindPopup(`${p.n}<br><small>${st.txt}</small>`).on("click", () => highlight(p.id, false));
  });
}

// Zooms the map to whatever matches after a filter change.
function fit() {
  if (!shown.length) return;
  const pts = shown.map(p => [p.lat, p.lon]);
  if (state.me) pts.push([state.me.lat, state.me.lon]);
  map.fitBounds(pts, {padding:[40, 40], maxZoom:15});
}

function clearAll() {
  state.vibes.clear(); state.price = 0; state.when = "any"; state.q = "";
  document.querySelectorAll(".vibe").forEach(b => b.classList.remove("on"));
  [...$("price").children].forEach((x, i) => x.classList.toggle("on", i === 0));
  $("when").value = "any"; $("q").value = ""; $("day").style.display = "";
  update();
}

function highlight(id, fly) {
  state.hl = id;
  const p = PLACES.find(x => x.id === id);
  document.querySelectorAll(".card").forEach(c => c.classList.toggle("hl", +c.dataset.id === id));
  const el = $("c" + id); if (el && getComputedStyle($("list")).display !== "none") el.scrollIntoView({behavior:"smooth", block:"center"});
  if (fly && p) map.flyTo([p.lat, p.lon], 15, {duration:.8});
}

$("list").onclick = e => {
  const s = e.target.closest("[data-save]");
  if (s) { const id = +s.dataset.save; saved.has(id) ? saved.delete(id) : saved.add(id); persist(); render(); return; }
  if (e.target.closest("a")) return;
  const c = e.target.closest(".card"); if (c) highlight(+c.dataset.id, true);
};

$("surprise").onclick = () => {
  if (!shown.length) return;
  const p = shown[Math.floor(Math.random() * shown.length)];
  if (window.matchMedia("(max-width:820px)").matches && !$("main").classList.contains("showmap")) { highlight(p.id, true); }
  else { highlight(p.id, true); }
  layer.eachLayer(m => { const ll = m.getLatLng(); if (ll.lat === p.lat && ll.lng === p.lon) setTimeout(() => m.openPopup(), 700); });
};

$("near").onclick = () => {
  if (!navigator.geolocation) return alert("Location isn't available on this device.");
  $("near").textContent = "📍 Finding you…";
  navigator.geolocation.getCurrentPosition(pos => {
    state.me = {lat:pos.coords.latitude, lon:pos.coords.longitude};
    $("near").textContent = "📍 Nearest first"; $("near").classList.add("on");
    if (meMarker) meMarker.remove();
    meMarker = L.marker([state.me.lat, state.me.lon], {icon:L.divIcon({className:"", html:'<div class="me"></div>', iconSize:[16, 16]})}).addTo(map);
    map.flyTo([state.me.lat, state.me.lon], 12);
    render();
  }, () => { $("near").textContent = "📍 Near me"; alert("Couldn't get your location. Check that location is allowed for this site."); }, {timeout:10000});
};

// ---------- Install as an app ----------
let deferred = null;
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferred = e; $("install").style.display = "flex"; });
$("install").onclick = async () => { if (!deferred) return; deferred.prompt(); await deferred.userChoice; deferred = null; $("install").style.display = "none"; };
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});

render();
setInterval(render, 60000); // keeps "open now" current
