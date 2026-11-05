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
    guide: [
      {h: "Pick your kind of water view", p: [
        "\"Waterfront\" means four pretty different things on the Grand Strand, and each one suits a different kind of night out.",
        "<strong>The ocean.</strong> Along the Myrtle Beach oceanfront you'll find beach bars and grills right on the sand, rooftop decks, and spots by the Boardwalk and the piers. Expect a breeze, a lively crowd and casual food like burgers, fish tacos and fried shrimp. Sea Captain's House and Pier 14 are good picks when you want a real sit-down meal with the ocean in view.",
        "<strong>The Murrells Inlet MarshWalk.</strong> A boardwalk along the salt marsh, lined with restaurants and bars with open decks. Drunken Jack's, Wahoo's Fish House, Creek Ratz, Dead Dog Saloon and Bubba's Love Shack are all on it. Many have live music on summer evenings, and it's easy to walk the boardwalk between dinner and a drink. More inlet favorites, like Wicked Tuna, Capt. Dave's Dockside and The Claw House, sit just off the MarshWalk on the same water.",
        "<strong>The Intracoastal Waterway.</strong> A calmer view of boats and marsh, away from the beach crowds. In North Myrtle Beach, Barefoot Landing has several restaurants on the waterway, and Boathouse Waterway Bar & Grill has a big outdoor deck on the water.",
        "<strong>Little River and Garden City.</strong> At the north end, Little River is an old fishing village with seafood spots like Captain Archie's on the waterfront. At the south end, Gulfstream Cafe in Garden City looks out over the inlet and is a favorite for a dressier dinner at sunset.",
      ]},
      {h: "When to go", p: [
        "Sunset is the busiest time at almost every place on this list. From late May through Labor Day, a 45-minute or longer wait at prime time is normal at the popular inlet and oceanfront spots. Eating at 4:30 or 5 PM, or after 8, makes a big difference.",
        "Spring and fall are the best seasons for eating outside: warm days, cooler evenings, fewer bugs and shorter waits. In winter some decks close, and a few spots cut back their hours or close one or two days a week, so check before you drive over.",
        "Summer afternoon thunderstorms are common. Most places will move you inside, but outdoor-only bars may close their decks until the storm passes.",
      ]},
    ],
    tips: [
      "Ask for a deck or window table when you put your name in. Those go first, and many places won't hold them.",
      "Bring bug spray for marsh-side tables around dusk, especially on the MarshWalk and the Intracoastal.",
      "Want the view without the wait? Go for lunch or an early happy hour instead of dinner.",
      "Some waterfront patios welcome dogs. Look for the dog-friendly tag below, and call to check, since rules can change by season.",
      "Parking near the MarshWalk and the Myrtle Beach oceanfront fills up on summer evenings. Arrive early or plan to walk a few blocks.",
    ],
    faq: [
      ["Where can I eat on the water in Myrtle Beach?", "For ocean views, try the beach bars and grills along the Myrtle Beach oceanfront and Boardwalk, or Sea Captain's House and Pier 14 for a sit-down meal. For marsh views and live music, head to the Murrells Inlet MarshWalk, about 25 minutes south. For a calmer view of the Intracoastal Waterway, try Barefoot Landing in North Myrtle Beach."],
      ["What is the Murrells Inlet MarshWalk?", "It's a boardwalk along the salt marsh in Murrells Inlet, lined with seafood restaurants and bars with outdoor decks. Many have live music in the evenings, and you can walk the boardwalk between spots."],
      ["What's the best time to get a waterfront table?", "Go before 5 PM or after 8 PM, especially from late May through Labor Day. Sunset is the busiest time everywhere on the water."],
    ],
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
  {
    slug: "romantic-restaurants-myrtle-beach",
    title: "Romantic Restaurants in Myrtle Beach: Local Date Night Spots",
    h1: "Romantic date night restaurants on the Grand Strand",
    desc: "Local (no chains) romantic restaurants for date night or an anniversary in Myrtle Beach, Murrells Inlet, Pawleys Island and North Myrtle Beach.",
    intro: "Planning an anniversary, a proposal or just a night out without the kids? These are the local spots on our map that we've marked as good for date night: quieter rooms, water views, good wine lists and food worth dressing up for. Most of them take reservations, and the best tables go first on summer weekends.",
    tips: [
      "Book ahead for Friday and Saturday nights from Memorial Day through Labor Day. Off-season weeknights are much easier.",
      "Ask for a window or patio table when you book if you want a water view. Those go first.",
      "Check sunset time before you go. Inlet and marsh views are at their best in the half hour before dark.",
      "Several of these are on the Murrells Inlet MarshWalk, where you can walk the boardwalk after dinner.",
    ],
    match: p => p.tags.includes("date"),
    stay: ["Myrtle Beach", "Murrells Inlet", "Pawleys Island"],
  },
  {
    slug: "italian-restaurants-myrtle-beach",
    title: "Local Italian Restaurants in Myrtle Beach & the Grand Strand",
    h1: "Local Italian restaurants on the Grand Strand",
    desc: "Independent Italian restaurants in Myrtle Beach, North Myrtle Beach, Murrells Inlet and nearby, from family red-sauce spots to date night. No chains.",
    intro: "When you've had your fill of fried seafood, a plate of pasta hits the spot. These are the independent Italian restaurants on our map, from casual family places with big portions to quieter rooms for a night out. Spots we've checked by hand are listed first.",
    tips: [
      "Many local Italian places do a lot of takeout. Ordering ahead is a good way to skip the summer wait.",
      "Family-style platters can feed a whole group for less than ordering one plate each.",
      "Some smaller spots close one or two days a week, often Sunday or Monday, especially in the off-season. Check hours before you go.",
    ],
    match: p => /italian/i.test(p.c),
    stay: ["Myrtle Beach", "North Myrtle Beach"],
  },
  {
    slug: "market-common-restaurants",
    title: "Market Common Restaurants in Myrtle Beach: Local Spots",
    h1: "Market Common restaurants",
    desc: "Local restaurants at The Market Common in Myrtle Beach, the walkable shopping and dining district near the airport and Grand Park. No chains.",
    intro: "The Market Common is a walkable shopping and dining district in south Myrtle Beach, built on the former Myrtle Beach Air Force Base. It's a good pick when you want dinner, a stroll and some shopping in one stop, away from the busy oceanfront. Here are the local restaurants there on our map.",
    tips: [
      "Parking is free in the lots and garages around the district.",
      "Grand Park, right next door, has a lake with a walking path. It's an easy after-dinner walk.",
      "It's a short drive from Myrtle Beach International Airport, so it works well for a first or last meal of a trip.",
    ],
    match: p => p.area === "Market Common",
    stay: ["Myrtle Beach"],
  },
  {
    slug: "garden-city-restaurants",
    title: "Garden City Beach Restaurants: Local Spots, No Chains",
    h1: "Garden City Beach restaurants",
    desc: "Local (non-chain) restaurants in Garden City Beach, SC, between Surfside Beach and Murrells Inlet, with prices, vibes and directions.",
    intro: "Garden City Beach sits between Surfside Beach and Murrells Inlet, with the Garden City Pier at its center and the inlet on its back side. It's casual and laid back, with plenty of spots to grab a meal in flip-flops. Here is every local restaurant in Garden City on our map.",
    tips: [
      "Murrells Inlet and the MarshWalk are only a few minutes away if you want more seafood choices.",
      "Some beach spots keep shorter hours or close for part of the winter, so check before you drive over in the off-season.",
    ],
    match: p => p.area === "Garden City",
    stay: ["Garden City", "Murrells Inlet"],
  },
  {
    slug: "pawleys-island-restaurants",
    title: "Pawleys Island & Litchfield Restaurants: Local Spots",
    h1: "Pawleys Island and Litchfield restaurants",
    desc: "Local restaurants in Pawleys Island and Litchfield Beach, SC, at the quiet south end of the Grand Strand. No chains.",
    intro: "Pawleys Island and Litchfield Beach are the quiet south end of the Grand Strand. Pawleys likes to call itself \"arrogantly shabby,\" and the restaurants fit: relaxed, local and unfussy, with some special-occasion spots mixed in. Here is every local restaurant in Pawleys Island and Litchfield on our map.",
    tips: [
      "Most of the restaurants are along Highway 17, not on the island itself.",
      "It's about 30 minutes south of Myrtle Beach, and an easy day trip from Murrells Inlet.",
      "Historic Georgetown is about 15 minutes farther south if you want to make a day of it.",
    ],
    match: p => p.area === "Pawleys Island" || p.area === "Litchfield Beach",
    stay: ["Pawleys Island"],
  },
  {
    slug: "conway-sc-restaurants",
    title: "Conway SC Restaurants: Local Spots Near Myrtle Beach",
    h1: "Conway, SC restaurants",
    desc: "Local (non-chain) restaurants in Conway, South Carolina, including historic downtown near the Riverwalk, about 20 minutes from Myrtle Beach.",
    intro: "Conway is the Horry County seat, about 20 minutes inland from Myrtle Beach on the Waccamaw River. Its historic downtown and Riverwalk make a nice break from the beach crowds, and it's home to Coastal Carolina University. Here is every local restaurant in Conway on our map.",
    tips: [
      "Downtown Conway is small and walkable. Park once and walk to dinner and the Riverwalk.",
      "Coastal Carolina home games and graduation weekends get busy, so plan ahead on those dates.",
    ],
    match: p => p.area === "Conway",
    stay: ["Conway"],
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
${cfg.faq ? `<script type="application/ld+json">${JSON.stringify({"@context": "https://schema.org", "@type": "FAQPage", mainEntity: cfg.faq.map(([q, a]) => ({"@type": "Question", name: q, acceptedAnswer: {"@type": "Answer", text: a}}))})}</script>` : ""}
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
.guide{margin:26px 0}.guide h2{font-size:21px;letter-spacing:-.02em;margin:0 0 8px}.guide p{font-size:15.5px;margin:0 0 12px}.faq h3{font-size:16px;margin:14px 0 4px}
.tips ul{margin:0;padding-left:20px}.tips li{font-size:14.5px;margin:5px 0}
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
${cfg.guide ? cfg.guide.map(s => `<section class="guide"><h2>${esc(s.h)}</h2>${s.p.map(t => `<p>${t}</p>`).join("")}</section>`).join("\n") : ""}
${cfg.tips ? `<div class="box tips"><h2>Local tips</h2><ul>${cfg.tips.map(t => `<li>${esc(t)}</li>`).join("")}</ul></div>` : ""}
${cfg.faq ? `<section class="guide faq"><h2>Common questions</h2>${cfg.faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join("")}</section>` : ""}
<div class="note">Hours, prices and vibes change, and some listings are still being checked. Call ahead or check the restaurant's website before you go. Know a local spot we're missing? Tell us on our <a href="https://www.facebook.com/profile.php?id=61596237747958">Facebook page</a>.</div>
<div class="box"><h2>After dinner: things to do on the Grand Strand</h2><div>${TODO.map(([e, label, q]) => `<a href="${GYG(q)}" target="_blank" rel="noopener sponsored">${e} ${label}</a>`).join("")}</div><p>Booked through GetYourGuide. Affiliate links.</p></div>
<div class="box"><h2>Where to stay</h2><div>${cfg.stay.map(a => `<a href="${STAY(a)}" target="_blank" rel="noopener sponsored">🏨 Hotels in ${a}</a>`).join("")}</div><p>Hotel search through Stay22. Affiliate links.</p></div>
<div class="box"><h2>More Grand Strand guides</h2><div>${others}</div></div>
<footer>Grand Strand Eats is a free map of local Myrtle Beach and Grand Strand restaurants. Locations come from OpenStreetMap. Some links are affiliate links: if you book a tour, activity or stay through them, we may earn a small commission at no extra cost to you. Spots marked Featured in the app may be paid placements; every other listing is free.${INFO_LINKS}</footer>
</div>
</body>
</html>
`;
}

// About / Privacy / Contact: plain text pages that reuse the guide page styles.
const FB = "https://www.facebook.com/profile.php?id=61596237747958";
const UPDATED = "November 5, 2026";
const INFO = [
  {
    slug: "about", title: "About Grand Strand Eats", h1: "About Grand Strand Eats",
    desc: "Grand Strand Eats is a free map of local, non-chain restaurants from Little River to Pawleys Island. Here is how the listings are chosen and checked.",
    body: `<p>Grand Strand Eats is a free map of local restaurants along South Carolina's Grand Strand, from Little River and North Myrtle Beach down through Myrtle Beach, Surfside, Garden City, Murrells Inlet and Pawleys Island. It is an independent site run by Christy, and it is not connected to any restaurant, tourism board or chamber of commerce.</p>
<h2>Why local spots only</h2>
<p>National chains are easy to find. The independent seafood shacks, pancake houses, breweries and marsh-side grills are harder to sort through when you're visiting, or even when you live here. So the map leaves chains out and keeps the focus on places that are only on the Grand Strand.</p>
<h2>Where the listings come from</h2>
<p>About 120 spots were picked and written up by hand. The rest come from OpenStreetMap, a free map that anyone can edit. For those, the price level and vibe are often a best guess from the type of food until someone checks them. We check listings against each restaurant's own website and Facebook page a few at a time, and fix hours, prices and addresses when they change.</p>
<p>Restaurants open, close and change hours all the time, especially between seasons. Please call ahead or check the restaurant's site before you go.</p>
<h2>How the site makes money</h2>
<p>Every listing is free. Spots marked ⭐ Featured may be paid placements, and that label is always shown. Some links to tours, activities and hotels are affiliate links through GetYourGuide and Stay22: if you book through them, we may earn a small commission at no extra cost to you. Paid placement never changes what we write about a restaurant.</p>
<h2>Help keep it right</h2>
<p>Know a local spot we're missing, or see hours that are wrong? See the <a href="../contact/">contact page</a>. Restaurant owners are welcome to send updates too.</p>`,
  },
  {
    slug: "privacy", title: "Privacy Policy", h1: "Privacy policy",
    desc: "How Grand Strand Eats handles your information: no accounts, no tracking of saved spots, and what the map, hosting and affiliate partners can see.",
    body: `<p><em>Last updated ${UPDATED}</em></p>
<p>Grand Strand Eats (grandstrandeats.com) does not ask you to sign up, does not have forms, and does not collect your name or email address.</p>
<h2>Saved spots and "Near me"</h2>
<p>Spots you save are kept in your own browser's local storage. They stay on your device and are never sent to us. If you tap "Near me," your browser asks for permission to share your location. Your location is used only inside your browser to sort the list by distance. It is not sent to us or stored.</p>
<h2>Offline use</h2>
<p>The site saves a copy of its own files in your browser so it loads quickly and works with a weak signal at the beach. You can clear this at any time by clearing your browser's site data.</p>
<h2>Services that load with the site</h2>
<p>Like any website, these services receive your IP address and basic browser information when your browser loads files from them:</p>
<ul>
<li>GitHub Pages, which hosts the site and may keep server logs for security.</li>
<li>Google Fonts, for the site's font.</li>
<li>OpenFreeMap, for the map tiles, and cdnjs and unpkg, for the map code.</li>
</ul>
<h2>Affiliate links</h2>
<p>Some links go to GetYourGuide and to hotel searches through Stay22 and Booking.com. When you click one of these, those companies may set cookies so they can tell that your booking came from us. Their own privacy policies apply on their sites.</p>
<h2>Advertising</h2>
<p>We may show ads from Google AdSense in the future. If we do, third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. Google's use of advertising cookies lets it and its partners serve ads to you based on your visits to this and other sites. You can opt out of personalized advertising in <a href="https://www.google.com/settings/ads" rel="noopener">Google's Ads Settings</a>, or opt out of some other vendors' cookies at <a href="https://www.aboutads.info/choices/" rel="noopener">aboutads.info</a>.</p>
<h2>Analytics</h2>
<p>We do not use analytics or tracking scripts on this site right now. If that changes, we will update this page.</p>
<h2>Children</h2>
<p>This site is meant for a general audience and does not knowingly collect information from children under 13.</p>
<h2>Changes and questions</h2>
<p>If this policy changes, the date at the top will change too. Questions? See the <a href="../contact/">contact page</a>.</p>`,
  },
  {
    slug: "contact", title: "Contact Grand Strand Eats", h1: "Contact us",
    desc: "Suggest a local Grand Strand restaurant, report wrong hours or prices, or ask about a Featured listing.",
    body: `<p>The quickest way to reach Grand Strand Eats is to send a message to our <a href="${FB}">Facebook page</a>. We read every message.</p>
<h2>Good reasons to get in touch</h2>
<ul>
<li><strong>Suggest a spot.</strong> Know a local, non-chain restaurant, food truck or brewery we're missing? Tell us its name and town.</li>
<li><strong>Fix a listing.</strong> Wrong hours, a closed restaurant, a bad address or a price that's off? Let us know and we'll check it.</li>
<li><strong>Restaurant owners.</strong> Send your current hours and menu link, or ask about a ⭐ Featured listing.</li>
</ul>
<p><a class="cta" href="${FB}">💬 Message us on Facebook</a></p>`,
  },
];

const INFO_CSS = `.prose h2{font-size:19px;letter-spacing:-.02em;margin:26px 0 6px}.prose p,.prose li{font-size:15.5px}.prose a:not(.cta){color:var(--brand);font-weight:700}.prose ul{padding-left:20px}`;
const INFO_LINKS = `<div style="margin-top:8px;font-weight:700"><a href="../about/" style="color:var(--brand)">About</a> · <a href="../privacy/" style="color:var(--brand)">Privacy</a> · <a href="../contact/" style="color:var(--brand)">Contact</a></div>`;

function infoPage(cfg, style) {
  const url = SITE + cfg.slug + "/";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(cfg.title)} | Grand Strand Eats</title>
<meta name="description" content="${esc(cfg.desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Grand Strand Eats"><meta property="og:title" content="${esc(cfg.title)}"><meta property="og:description" content="${esc(cfg.desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}share.png">
<meta name="theme-color" content="#0e7c86">
<link rel="icon" href="../icon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
${style.replace("</style>", INFO_CSS + "\n</style>")}
</head>
<body>
<div class="wrap">
<header><a href="../"><span class="logo">🌅</span>Grand Strand Eats</a></header>
<h1>${esc(cfg.h1)}</h1>
<div class="prose">
${cfg.body}
</div>
<div class="box"><h2>Grand Strand guides</h2><div>${PAGES.map(o => `<a href="../${o.slug}/">${esc(o.h1)}</a>`).join("")}</div></div>
<footer>Grand Strand Eats is a free map of local Myrtle Beach and Grand Strand restaurants.${INFO_LINKS}</footer>
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

const STYLE = page(PAGES[0], []).match(/<style>[\s\S]*?<\/style>/)[0];
for (const cfg of INFO) {
  const dir = path.join(ROOT, cfg.slug);
  fs.mkdirSync(dir, {recursive: true});
  fs.writeFileSync(path.join(dir, "index.html"), infoPage(cfg, STYLE));
  urls.push(SITE + cfg.slug + "/");
  console.log(cfg.slug);
}

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);

module.exports = {PAGES};
