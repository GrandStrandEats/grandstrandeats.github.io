// Builds the static guide pages (one folder per page) from data.js.
// Run from the repo root after any data change:  node tools/build-pages.js
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
global.window = {};
require(path.join(ROOT, "data.js"));
const PLACES = window.PLACES;

const SITE = "https://grandstrandeats.com/";
const TAG_LABEL = {water:"Waterfront", music:"Live music", dog:"Dog-friendly", breakfast:"Breakfast", date:"Date night", brewery:"Brewery", family:"Family", oceanfront:"Oceanfront"};
const MB_AREAS = ["Myrtle Beach", "Market Common", "Boardwalk", "Downtown", "Carolina Forest", "Socastee"];

// Thanksgiving 2026: id -> what the restaurant's own website says. Only add a spot once it has posted 2026 plans.
const THANKSGIVING = {
  140: "🦃 Open 10:30 AM–9 PM · Thanksgiving dinner $30.95, kids under 10 $15.95 · Regular menu too · Preorder to-go for pickup Nov 26",
  47: "🦃 Thanksgiving buffet 11 AM–8 PM · $51.99 · All 4 Captain George's locations",
  28: "🦃 Open 11 AM–8 PM · Thanksgiving dinner $30.95, kids $15.95 · Regular menu too · Preorder to-go",
  518: "🦃 Open Thanksgiving (call for hours: 843-215-5255) · Thanksgiving dinner $30.95, kids $15.95 · Regular menu too · Preorder to-go",
};

const PAGES = [
  {
    slug: "restaurants-open-thanksgiving-myrtle-beach",
    title: "Restaurants Open on Thanksgiving 2026 in Myrtle Beach",
    h1: "Restaurants open on Thanksgiving 2026 in Myrtle Beach",
    desc: "Local Myrtle Beach and Grand Strand restaurants open on Thanksgiving Day, Thursday, November 26, 2026, with holiday hours, prices and to-go options.",
    intro: "Not cooking this year? These local Grand Strand restaurants are open on Thanksgiving Day, Thursday, November 26, 2026. We only list a spot once the restaurant has posted its own 2026 Thanksgiving plans, and we add more as they come in. Book early, because holiday tables fill up fast. Last checked November 3, 2026.",
    notes: THANKSGIVING,
    match: p => p.id in THANKSGIVING,
    stay: ["Myrtle Beach", "Murrells Inlet", "Surfside Beach"],
  },
  {
    slug: "waterfront-restaurants-myrtle-beach",
    title: "Waterfront Restaurants in Myrtle Beach & the Grand Strand",
    h1: "Waterfront restaurants on the Grand Strand",
    desc: "Local (no chains) waterfront and oceanfront restaurants in Myrtle Beach, Murrells Inlet, North Myrtle Beach and Garden City, with prices and links.",
    intro: "Eating with a view of the water is half the fun of a Grand Strand trip. These are the local, non-chain spots on our map that sit on the ocean, the inlet, the marsh or the Intracoastal Waterway. Many are busiest at sunset, so plan ahead on weekends.",
    match: p => p.tags.includes("water") || p.tags.includes("oceanfront"),
    stay: ["Myrtle Beach", "North Myrtle Beach", "Murrells Inlet", "Garden City"],
  },
  {
    slug: "seafood-restaurants-myrtle-beach",
    title: "Best Local Seafood Restaurants in Myrtle Beach & the Grand Strand",
    h1: "Local seafood restaurants on the Grand Strand",
    desc: "Local (no chains) seafood restaurants in Myrtle Beach, Murrells Inlet, North Myrtle Beach and nearby, with prices, vibes and directions.",
    intro: "Fresh shrimp, oysters, flounder and Calabash-style fried platters are what most people come to the Grand Strand to eat. These are the local, non-chain seafood spots on our map, from the Murrells Inlet MarshWalk up to Little River. Waits get long in summer, so go early or call ahead.",
    match: p => /seafood/i.test(p.c),
    stay: ["Myrtle Beach", "Murrells Inlet", "North Myrtle Beach"],
  },
  {
    slug: "breakfast-myrtle-beach",
    title: "Best Local Breakfast Spots in Myrtle Beach",
    h1: "Local breakfast spots in Myrtle Beach",
    desc: "Local breakfast and brunch restaurants in Myrtle Beach, Market Common and nearby, no chains. Prices, websites and directions.",
    intro: "Pancake houses are a Myrtle Beach tradition, but the local diners and cafés are where the regulars go. Here are the independent breakfast spots in and around Myrtle Beach on our map. Morning hours change by season, so check before you go.",
    match: p => p.tags.includes("breakfast") && MB_AREAS.includes(p.area),
    stay: ["Myrtle Beach"],
  },
  {
    slug: "murrells-inlet-restaurants",
    title: "Murrells Inlet Restaurants: Local Seafood & the MarshWalk",
    h1: "Murrells Inlet restaurants",
    desc: "Every local (non-chain) restaurant in Murrells Inlet on our map, including the MarshWalk, with prices, vibes and directions.",
    intro: "Murrells Inlet calls itself the seafood capital of South Carolina, and the MarshWalk boardwalk is lined with restaurants looking out over the marsh. Below is every local spot in Murrells Inlet on our map, MarshWalk places first.",
    match: p => p.area === "Murrells Inlet" || p.area === "MarshWalk",
    stay: ["Murrells Inlet", "Garden City"],
  },
  {
    slug: "north-myrtle-beach-restaurants",
    title: "North Myrtle Beach Restaurants: Local Spots, No Chains",
    h1: "North Myrtle Beach restaurants",
    desc: "Local (non-chain) restaurants in North Myrtle Beach, from Cherry Grove to Barefoot Landing, with prices, vibes and directions.",
    intro: "North Myrtle Beach has a slower, more local feel than the main strip. Here is every independent restaurant in North Myrtle Beach on our map, starting with the spots we've checked by hand.",
    match: p => p.area === "North Myrtle Beach",
    stay: ["North Myrtle Beach"],
  },
  {
    slug: "surfside-beach-restaurants",
    title: "Surfside Beach Restaurants: Local Spots, No Chains",
    h1: "Surfside Beach restaurants",
    desc: "Local (non-chain) restaurants in Surfside Beach, SC, the family beach south of Myrtle Beach. Prices, vibes and directions.",
    intro: "Surfside Beach is known as \"The Family Beach,\" and its restaurants match: casual, friendly and close to the sand. Here is every independent restaurant in Surfside Beach on our map.",
    match: p => p.area === "Surfside Beach",
    stay: ["Surfside Beach"],
  },
];

const GYG = q => `https://www.getyourguide.com/s/?q=${encodeURIComponent(q)}&partner_id=GFIFJ6X&utm_medium=online_publisher`;
const TODO = [
  ["🐬", "Dolphin cruises", "Myrtle Beach dolphin"],
  ["🌅", "Sunset cruises", "Myrtle Beach sunset cruise"],
  ["🎭", "Dinner shows", "Myrtle Beach dinner show"],
  ["🛶", "Kayak & river tours", "Myrtle Beach kayak"],
  ["🎣", "Fishing trips", "Myrtle Beach fishing"],
];
// Stay22 hotel links (aid grandstrandeats): a Booking.com search for the area.
const STAY = a => `https://www.stay22.com/allez/booking?link=${encodeURIComponent("https://www.booking.com/searchresults.html?ss=" + a + ", South Carolina")}&aid=grandstrandeats`;

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const price = p => p.p ? "$".repeat(p.p) : "";

// Hand-checked spots (ids 1-124) first, then A-Z.
const sortSpots = list => list.slice().sort((a, b) => ((a.id > 124) - (b.id > 124)) || a.n.localeCompare(b.n));

function spot(p, note) {
  const dir = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.n + ", " + p.area + ", SC")}`;
  const meta = [p.area, p.c.replace(/ · /g, ", "), price(p)].filter(Boolean).join(" · ");
  const tags = p.tags.filter(t => TAG_LABEL[t]).map(t => `<span class="tag">${TAG_LABEL[t]}</span>`).join("");
  return `<li class="spot"><div class="em">${p.e}</div><div><h3>${esc(p.n)}</h3><div class="meta">${esc(meta)}</div>${note ? `<div class="hol">${esc(note)}</div>` : ""}${tags ? `<div class="tags">${tags}</div>` : ""}<div class="acts">${p.web ? `<a href="${esc(p.web)}" target="_blank" rel="noopener">Website</a>` : ""}<a href="${dir}" target="_blank" rel="noopener">Directions</a></div></div></li>`;
}

function page(cfg, spots) {
  const url = SITE + cfg.slug + "/";
  const others = PAGES.filter(o => o !== cfg).map(o => `<a href="../${o.slug}/">${esc(o.h1)}</a>`).join("");
  const ld = {
    "@context": "https://schema.org", "@type": "ItemList", name: cfg.h1, numberOfItems: spots.length,
    itemListElement: spots.map((p, i) => ({"@type": "ListItem", position: i + 1, item: {"@type": "Restaurant", name: p.n, address: {"@type": "PostalAddress", addressLocality: p.area === "MarshWalk" ? "Murrells Inlet" : p.area, addressRegion: "SC"}, ...(p.web ? {url: p.web} : {})}})),
  };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(cfg.title)} | Grand Strand Eats</title>
<meta name="description" content="${esc(cfg.desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article"><meta property="og:site_name" content="Grand Strand Eats"><meta property="og:title" content="${esc(cfg.title)}"><meta property="og:description" content="${esc(cfg.desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}share.png"><meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0e7c86">
<link rel="icon" href="../icon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<style>
:root{--bg:#f6f3ee;--surface:#fff;--ink:#14212b;--muted:#5d6b75;--line:#e6e0d6;--brand:#0e7c86;--brand-ink:#fff;--sun:#ff8a3d;--chip:#eef2f2}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0f161b;--surface:#172229;--ink:#ecf2f4;--muted:#9aa9b2;--line:#24333c;--brand:#2cc0c9;--brand-ink:#06252a;--chip:#1f2d35}}
:root[data-theme="dark"]{--bg:#0f161b;--surface:#172229;--ink:#ecf2f4;--muted:#9aa9b2;--line:#24333c;--brand:#2cc0c9;--brand-ink:#06252a;--chip:#1f2d35}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font-family:"Plus Jakarta Sans",system-ui,sans-serif;line-height:1.55;-webkit-font-smoothing:antialiased}
.wrap{max-width:760px;margin:0 auto;padding:0 16px 60px}
header{display:flex;align-items:center;gap:10px;padding:14px 0;border-bottom:1px solid var(--line)}
header a{color:inherit;text-decoration:none;font-weight:800;font-size:17px;display:flex;align-items:center;gap:10px}
.logo{width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,var(--sun),#ffbf69 45%,var(--brand));display:grid;place-items:center}
h1{font-size:30px;line-height:1.15;letter-spacing:-.03em;margin:26px 0 10px}
.intro{color:var(--muted);font-size:16px;margin:0 0 14px}
.cta{display:inline-block;background:var(--brand);color:var(--brand-ink);font-weight:800;text-decoration:none;border-radius:999px;padding:10px 16px;margin:4px 0 8px}
.count{font-size:13px;color:var(--muted);font-weight:600;margin:16px 0 8px}
ol{list-style:none;padding:0;margin:0}
.spot{display:grid;grid-template-columns:52px 1fr;gap:12px;background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:12px;margin-bottom:10px}
.em{font-size:30px;text-align:center}
h3{margin:0;font-size:17px;letter-spacing:-.02em}
.meta{font-size:13.5px;color:var(--muted)}
.hol{font-size:13.5px;font-weight:600;margin:5px 0 2px}
.tags{display:flex;gap:5px;flex-wrap:wrap;margin:6px 0 2px}
.tag{font-size:11.5px;font-weight:700;background:var(--chip);border-radius:8px;padding:3px 7px}
.acts{display:flex;gap:6px;margin-top:6px;flex-wrap:wrap}
.acts a,.box a{font-size:12.5px;font-weight:800;text-decoration:none;color:var(--brand);border:1.5px solid var(--line);border-radius:10px;padding:5px 9px}
.box{background:var(--surface);border:1.5px dashed var(--brand);border-radius:16px;padding:14px;margin:24px 0}
.box h2{font-size:17px;margin:0 0 10px;letter-spacing:-.02em}
.box div{display:flex;flex-wrap:wrap;gap:6px}
.box p{font-size:11.5px;color:var(--muted);margin:8px 0 0}
.note{font-size:12.5px;color:var(--muted);background:var(--chip);border-radius:12px;padding:10px 12px;margin:18px 0}
footer{font-size:12px;color:var(--muted);border-top:1px solid var(--line);padding-top:14px;margin-top:20px}
</style>
</head>
<body>
<div class="wrap">
<header><a href="../"><span class="logo">🌅</span>Grand Strand Eats</a></header>
<h1>${esc(cfg.h1)}</h1>
<p class="intro">${esc(cfg.intro)}</p>
<a class="cta" href="../">🗺 See them on the map</a>
<div class="count">${spots.length} local spots · no chains</div>
<ol>
${spots.map(p => spot(p, cfg.notes && cfg.notes[p.id])).join("\n")}
</ol>
<div class="note">Hours, prices and vibes change, and some listings are still being checked. Call ahead or check the restaurant's website before you go. Know a local spot we're missing? Tell us on our <a href="https://www.facebook.com/profile.php?id=61596237747958">Facebook page</a>.</div>
<div class="box"><h2>After dinner: things to do on the Grand Strand</h2><div>${TODO.map(([e, label, q]) => `<a href="${GYG(q)}" target="_blank" rel="noopener sponsored">${e} ${label}</a>`).join("")}</div><p>Booked through GetYourGuide. Affiliate links.</p></div>
<div class="box"><h2>Where to stay</h2><div>${cfg.stay.map(a => `<a href="${STAY(a)}" target="_blank" rel="noopener sponsored">🏨 Hotels in ${a}</a>`).join("")}</div><p>Hotel search through Stay22. Affiliate links.</p></div>
<div class="box"><h2>More Grand Strand guides</h2><div>${others}</div></div>
<footer>Grand Strand Eats is a free map of local Myrtle Beach and Grand Strand restaurants. Locations come from OpenStreetMap. Some links are affiliate links: if you book a tour, activity or stay through them, we may earn a small commission at no extra cost to you. Spots marked Featured in the app may be paid placements; every other listing is free.</footer>
</div>
</body>
</html>
`;
}

const urls = [SITE];
for (const cfg of PAGES) {
  let spots = sortSpots(PLACES.filter(cfg.match));
  if (cfg.slug === "murrells-inlet-restaurants") spots = spots.filter(p => p.area === "MarshWalk").concat(spots.filter(p => p.area !== "MarshWalk"));
  const dir = path.join(ROOT, cfg.slug);
  fs.mkdirSync(dir, {recursive: true});
  fs.writeFileSync(path.join(dir, "index.html"), page(cfg, spots));
  urls.push(SITE + cfg.slug + "/");
  console.log(cfg.slug, spots.length);
}

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);

module.exports = {PAGES};
