// Builds the static guide pages (one folder per page) from data.js.
// Run from the repo root after any data change:  node tools/build-pages.js
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
global.window = {};
require(path.join(ROOT, "data.js"));
const PLACES = window.PLACES;
require(path.join(ROOT, "todo.js"));
const THINGS = window.THINGS;

const SITE = "https://grandstrandeats.com/";
const TAG_LABEL = {holiday:"Holiday", free:"Free", kids:"Kids", rainy:"Indoors", outdoor:"Outdoors", night:"Evenings", pier:"Pier", water:"Waterfront", music:"Live music", dog:"Dog-friendly", breakfast:"Breakfast", date:"Date night", brewery:"Brewery", family:"Family", oceanfront:"Oceanfront"};
const MB_AREAS = ["Myrtle Beach", "Market Common", "Boardwalk", "Downtown", "Carolina Forest", "Socastee"];

// Thanksgiving 2026: id -> what the restaurant's own website says. Only add a spot once it has posted 2026 plans.
const THANKSGIVING = {
  140: "🦃 Open 10:30 AM–9 PM · Thanksgiving dinner $30.95, kids under 10 $15.95 · Regular menu too · Preorder to-go for pickup Nov 26",
  47: "🦃 Thanksgiving buffet 11 AM–8 PM · $51.99 · All 4 Captain George's locations",
  28: "🦃 Open 11 AM–8 PM · Thanksgiving dinner $30.95, kids $15.95 · Regular menu too · Preorder to-go",
  518: "🦃 Open Thanksgiving (call for hours: 843-215-5255) · Thanksgiving dinner $30.95, kids $15.95 · Regular menu too · Preorder to-go",
  18: "🦃 Seafood & traditional buffet 11 AM–4:30 PM · Adults $48.95, kids 6–11 $15.95, 5 & under free · 20% gratuity added · Reservations preferred: 843-651-5800",
  2: "🦃 Open 11 AM–10:30 PM · Thanksgiving buffet 11 AM–5 PM · Reservations recommended",
  234: "🦃 Thanksgiving Day feature (call 843-497-2636) · At-home dinner for 4, $225, pickup Nov 24–25, 1–5 PM · Order by Sat, Nov 21",
  39: "🦃 39th annual Thanksgiving Day Feast 1–3 PM · Turkey Trot post-race brunch 8–10 AM · Call 843-238-1013",
  652: "🦃 To-go Thanksgiving feast $49/person (serves 2–12) · Turkey, sides, rolls & pie · Order by Sun, Nov 22 at noon · Pickup Wed, Nov 25, 2–8 PM at 3200 S Ocean Blvd",
  71: "🦃 Thanksgiving to-go: 8-person package $225, 12-person $300, or à la carte · Pickup Wed, Nov 25 · Order by Sun, Nov 15 at c-chospitality.com/promotions",
  126: "🦃 Thanksgiving to-go: 8-person package $225, 12-person $300, or à la carte · Pickup Wed, Nov 25 · Order by Sun, Nov 15 at c-chospitality.com/promotions",
  591: "🦃 Thanksgiving to-go: 8-person package $225, 12-person $300, or à la carte · Pickup Wed, Nov 25 · Order by Sun, Nov 15 at c-chospitality.com/promotions",
};

const PAGES = [
  {
    slug: "restaurants-open-thanksgiving-myrtle-beach",
    title: "Restaurants Open on Thanksgiving 2026 in Myrtle Beach",
    h1: "Restaurants open on Thanksgiving 2026 in Myrtle Beach",
    desc: "Local Myrtle Beach and Grand Strand restaurants open on Thanksgiving Day, Thursday, November 26, 2026, with holiday hours, prices and to-go options.",
    intro: "Not cooking this year? These local Grand Strand restaurants are open on Thanksgiving Day, Thursday, November 26, 2026. We only list a spot once the restaurant has posted its own 2026 Thanksgiving plans, and we add more as they come in. Book early, because holiday tables fill up fast. Last checked November 9, 2026.",
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
      {h: "What kinds of waterfront restaurants are on the Grand Strand?", p: [
        "<strong>You can eat by the ocean, on the Murrells Inlet MarshWalk, along the Intracoastal Waterway, or by the water in Little River and Garden City.</strong> Each one suits a different kind of night out.",
        "<strong>The ocean.</strong> Along the Myrtle Beach oceanfront you'll find beach bars and grills right on the sand, rooftop decks, and spots by the Boardwalk and the piers. Expect a breeze, a lively crowd and casual food like burgers, fish tacos and fried shrimp. Sea Captain's House and Pier 14 are good picks when you want a real sit-down meal with the ocean in view.",
        "<strong>The Murrells Inlet MarshWalk.</strong> A boardwalk along the salt marsh, lined with restaurants and bars with open decks. Drunken Jack's, Wahoo's Fish House, Creek Ratz, Dead Dog Saloon and The Claw House are all on it. Many have live music on summer evenings, and it's easy to walk the boardwalk between dinner and a drink. More inlet favorites, like Wicked Tuna and The Claw House, sit just off the MarshWalk on the same water.",
        "<strong>The Intracoastal Waterway.</strong> A calmer view of boats and marsh, away from the beach crowds. In North Myrtle Beach, Barefoot Landing has several restaurants on the waterway, and Boathouse Waterway Bar & Grill has a big outdoor deck on the water.",
        "<strong>Little River and Garden City.</strong> At the north end, Little River is an old fishing village with seafood spots like Captain Archie's on the waterfront. At the south end, Gulfstream Cafe in Garden City looks out over the inlet and is a favorite for a dressier dinner at sunset.",
      ]},
      {h: "When is the best time to eat at a waterfront restaurant?", p: [
        "<strong>Go before 5 PM or after 8 PM, and pick spring or fall if you can.</strong> Sunset is the busiest time at almost every place on this list. From late May through Labor Day, a 45-minute or longer wait at prime time is normal at the popular inlet and oceanfront spots. Eating at 4:30 or 5 PM, or after 8, makes a big difference.",
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
    guide: [
      {h: "What seafood should I order on the Grand Strand?", p: [
        "<strong>Try Calabash-style fried seafood, shrimp and grits, she-crab soup, a Lowcountry boil, or the fresh catch of the day.</strong> Here's what each one is.",
        "<strong>Calabash-style seafood.</strong> Shrimp, flounder, oysters and scallops in a light, thin breading, fried fast and served in big platters with hushpuppies and slaw. The style is named for Calabash, North Carolina, a fishing town just over the state line from Little River, and you'll see \"Calabash\" on menus all up and down the coast.",
        "<strong>Shrimp and grits.</strong> A Lowcountry staple. Every kitchen does it a little differently, usually with a gravy of sausage or bacon, peppers and onions over creamy stone-ground grits.",
        "<strong>She-crab soup.</strong> A rich, creamy crab soup from the South Carolina coast, traditionally finished with a splash of sherry. Most local seafood spots have their own version.",
        "<strong>Lowcountry boil.</strong> Also called Frogmore stew: shrimp, smoked sausage, corn on the cob and red potatoes boiled together with seasoning. It's a great order for a group.",
        "<strong>Fresh catch.</strong> Many places list a fish of the day, often grouper, flounder, mahi-mahi, tuna or wahoo, grilled, blackened or fried. Ask your server what came in locally that day.",
      ]},
      {h: "Should I pick a seafood buffet, a sit-down restaurant or a raw bar?", p: [
        "<strong>Pick a buffet for big eaters and families, a sit-down restaurant for the freshest fish, and a raw bar for a casual night of oysters and cold beer.</strong>",
        "<strong>Seafood buffets</strong> are a Myrtle Beach tradition, with crab legs, fried and steamed seafood, and a long dessert table. Captain George's, The Giant Crab and Crabby Mike's Calabash Seafood are local, family-run options. They're a good deal for big eaters and groups with kids, but they cost more per person than a single platter, so they're not the best pick for a light appetite.",
        "<strong>Sit-down seafood restaurants</strong> are where you'll find the fresh catch, shrimp and grits and she-crab soup done well. The Murrells Inlet waterfront is the best-known stretch for this, and Wicked Tuna, Drunken Jack's and The Claw House are all there. In Myrtle Beach, Sea Captain's House and Hook and Barrel are popular for a nicer dinner.",
        "<strong>Raw bars and crab houses</strong> are the most casual of the three: oysters on the half shell, steamed shrimp by the pound, crab legs and cold beer. Rockefellers Raw Bar in North Myrtle Beach and Inlet Crab House & Raw Bar in Murrells Inlet are on our map.",
      ]},
      {h: "What seafood is in season in South Carolina?", p: [
        "<strong>Local white shrimp are best in late summer and fall, oysters run from fall through spring, and offshore fish like mahi-mahi and tuna show up most in late spring and summer.</strong> South Carolina's wild shrimp are caught from late spring through early winter, and local white shrimp are at their best in late summer and fall. Wild oyster season on the South Carolina coast usually runs from fall through spring, and oyster roasts are a cool-weather tradition. Offshore fish like mahi-mahi, tuna and wahoo are most common on menus in late spring and summer.",
        "Not everything on a beach menu is local, especially in the busy summer months. If that matters to you, ask what's local today. Good seafood spots are happy to tell you.",
      ]},
    ],
    tips: [
      "\"MP\" on a menu means market price, which changes with the catch. Ask before you order if you're on a budget.",
      "In summer, eat early. Many seafood spots don't take reservations, and 6 to 8 PM waits can be long.",
      "Hushpuppies come free with most platters, and refills are often free too. Just ask.",
      "Order fried seafood \"Calabash style\" if you want it lightly breaded instead of heavy batter.",
      "Buffets usually charge less for kids, often by age or height. Check the price board before you sit down.",
    ],
    faq: [
      ["What is Calabash-style seafood?", "It's seafood, usually shrimp, flounder, oysters or scallops, in a thin, light breading, quickly fried and served in big platters with hushpuppies and slaw. It's named after Calabash, North Carolina, just north of Little River."],
      ["Where is the best seafood near Myrtle Beach?", "Murrells Inlet, about 25 minutes south, is the area best known for seafood, with many restaurants along the inlet and the MarshWalk. Myrtle Beach and North Myrtle Beach also have plenty of local seafood spots, from buffets to raw bars."],
      ["Are Myrtle Beach seafood buffets worth it?", "They can be for big eaters and families, since you get crab legs, fried and steamed seafood and desserts in one price. For a lighter meal or the freshest local fish, a sit-down seafood restaurant is usually the better choice."],
    ],
    match: p => /seafood/i.test(p.c),
    stay: ["Myrtle Beach", "Murrells Inlet", "North Myrtle Beach"],
  },
  {
    slug: "breakfast-myrtle-beach",
    title: "Best Local Breakfast Spots in Myrtle Beach",
    h1: "Local breakfast spots in Myrtle Beach",
    desc: "Local breakfast and brunch restaurants in Myrtle Beach, Market Common and nearby, no chains. Prices, websites and directions.",
    intro: "Pancake houses are a Myrtle Beach tradition, but the local diners and cafés are where the regulars go. Here are the independent breakfast spots in and around Myrtle Beach on our map. Morning hours change by season, so check before you go.",
    guide: [
      {h: "Why does Myrtle Beach have so many pancake houses?", p: [
        "<strong>Families on beach vacations wanted a big, affordable breakfast before a long day on the sand, and local pancake houses opened along Kings Highway to serve them.</strong> Drive down Kings Highway and you'll pass one pancake house after another. Myrtle Beach has had a big breakfast culture since the early days of beach vacations, when families wanted a full meal before a long day on the sand. Some of the local pancake houses have been family-run for decades.",
        "A classic pancake house breakfast means big stacks of buttermilk pancakes, Belgian waffles, omelettes, bacon and sausage, and bottomless coffee, at prices that are easy on a family budget. Donald's Pancake House and Pan American Pancake & Omelette House are two long-running local spots on our map, and Pan American opens early for people heading out to fish or golf.",
      ]},
      {h: "Where can I get Southern breakfast or brunch in Myrtle Beach?", p: [
        "<strong>Blueberry's Grill and Mimosa Restaurant are good local picks, and Sea Captain's House serves breakfast with an ocean view.</strong> For something more Southern, look for biscuits and gravy, a side of grits, country ham, and shrimp and grits on brunch menus. Blueberry's Grill is a popular local breakfast and lunch spot, and Mimosa Restaurant is a good pick when you want brunch with a mimosa to match the name.",
        "Want breakfast with an ocean view? Sea Captain's House serves breakfast in its oceanfront dining room, and it's one of the few places where you can watch the waves over a plate of eggs.",
      ]},
      {h: "Where can I get coffee before the beach in Myrtle Beach?", p: [
        "<strong>Local coffee shops like Grand Strand Coffee and HiFi Coffeebar are good for a latte and a pastry before the beach.</strong> They're a nice pick if you're not a big-breakfast person. Check their hours before you go, since some open later in the morning.",
      ]},
    ],
    tips: [
      "Go before 8 AM or after 10:30 AM in summer. The busiest time at pancake houses is 8:30 to 10 on weekends.",
      "Most breakfast spots close by early afternoon, often around 1:30 or 2 PM, so this isn't a late-brunch town.",
      "Big groups should arrive early or split up. Large tables are the hardest to get during the summer rush.",
      "Hours change in the off-season. Several spots close one day a week in winter, so check before you drive over.",
    ],
    faq: [
      ["Why are there so many pancake houses in Myrtle Beach?", "Breakfast has been a big part of a Myrtle Beach vacation for generations. Families wanted a filling, affordable meal before a day at the beach, and many local, family-run pancake houses opened along Kings Highway to serve them."],
      ["What time do breakfast places open in Myrtle Beach?", "Most open between 6 and 7:30 AM and close in the early afternoon, around 1:30 to 2:30 PM. Coffee shops often open a little later and stay open longer."],
      ["Where can I eat breakfast on the ocean in Myrtle Beach?", "Sea Captain's House serves breakfast in its oceanfront dining room. It's popular, so arrive early in summer."],
    ],
    match: p => p.tags.includes("breakfast") && MB_AREAS.includes(p.area),
    stay: ["Myrtle Beach"],
  },
  {
    slug: "murrells-inlet-restaurants",
    title: "Murrells Inlet Restaurants: Local Seafood & the MarshWalk",
    h1: "Murrells Inlet restaurants",
    desc: "Every local (non-chain) restaurant in Murrells Inlet on our map, including the MarshWalk, with prices, vibes and directions.",
    intro: "Murrells Inlet calls itself the seafood capital of South Carolina, and the MarshWalk boardwalk is lined with restaurants looking out over the marsh. Below is every local spot in Murrells Inlet on our map, MarshWalk places first.",
    guide: [
      {h: "What makes Murrells Inlet restaurants different?", p: [
        "<strong>Murrells Inlet is an old fishing village where most restaurants are local, family-run places with decks over the water, not chains.</strong> It sits about 15 miles south of Myrtle Beach. The town wraps around a saltwater inlet and marsh, and boats still head out from here for fishing charters and deep-sea trips. That's a big part of why it calls itself the seafood capital of South Carolina.",
        "Most of the restaurants sit along Business 17, which runs right beside the inlet. You won't find big resort hotels or a strip of chain restaurants here. It's mostly local, family-run places, and a lot of them have decks looking out over the water.",
        "<strong>The MarshWalk</strong> is the heart of it all. It's a wooden boardwalk along the marsh, lined with restaurants and bars. Drunken Jack's, Wahoo's Fish House, Creek Ratz, Dead Dog Saloon and The Claw House all open onto it, so you can walk from one to the next. On warm evenings there's often live music, and it's a fun place to watch the sunset and the boats coming in.",
      ]},
      {h: "Where else can I eat in Murrells Inlet besides the MarshWalk?", p: [
        "<strong>Wicked Tuna, The Claw House and Hot Fish Club all sit on the same water just off the boardwalk.</strong> More of the inlet's best-known seafood spots sit just off the boardwalk on the same stretch of water. Wicked Tuna, The Claw House and Hot Fish Club all have water views, and Wicked Tuna and Hot Fish Club are good picks for a date night.",
        "For a plain, roll-up-your-sleeves seafood meal, try Crab Daddy's Seafood or Inlet Crab House & Raw Bar. Harvest, J Peters Grill & Bar and Inlet Prohibition Company are a few more local options along the main road.",
        "Not every meal here has to be seafood. There's O'Keefe's Irish Pub, River City Cafe for burgers, and Southern buffet cooking at Judy Boone's. Carolina Food Park brings in a rotating lineup of food trucks. Suck Bang Blow is a well-known biker bar, and it gets packed during bike rally weeks.",
      ]},
      {h: "How far is Murrells Inlet from Myrtle Beach, and when should I go?", p: [
        "<strong>It's about a 25 to 30 minute drive south on Highway 17, and spring and fall weeknights are the easiest time to get a table.</strong> Expect it to take longer on summer weekends. From Garden City and Surfside Beach it's only a few minutes.",
        "Summer evenings are the busiest. From late May through Labor Day, an hour wait at sunset is common at the waterfront spots. Spring and fall are lovely here: the marsh is green or gold, there are fewer bugs, and you can often walk right in on a weeknight.",
        "Want to make a day of it? Huntington Beach State Park and Brookgreen Gardens are both just south of the inlet on Highway 17, and they pair well with an early dinner on the water.",
      ]},
    ],
    tips: [
      "Walk the whole MarshWalk before you choose. It's short, and you can peek at each deck and see who has live music that night.",
      "Put your name in at one restaurant, then stroll the boardwalk while you wait.",
      "Parking near the MarshWalk fills up on summer nights. Come early or be ready to walk a few minutes.",
      "Bring bug spray for marsh-side tables around dusk.",
      "Ask your server what seafood came in fresh that day. Local catches change with the season.",
    ],
    faq: [
      ["Is Murrells Inlet worth the drive from Myrtle Beach?", "Yes, if you like seafood and water views. It's about 25 to 30 minutes south, and it's mostly local, family-run restaurants instead of chains. The MarshWalk lets you try more than one spot in a single night."],
      ["Where is the Murrells Inlet MarshWalk?", "It runs along the marsh side of Business 17 in Murrells Inlet. Restaurants like Drunken Jack's, Wahoo's Fish House, Creek Ratz, Dead Dog Saloon and The Claw House open right onto the boardwalk."],
      ["Is the MarshWalk good for kids?", "Yes, especially earlier in the evening. The boardwalk is free to walk, and family-friendly spots like Creek Ratz and Drunken Jack's welcome kids. Later at night the bars get louder with live music."],
    ],
    match: p => p.area === "Murrells Inlet" || p.area === "MarshWalk",
    stay: ["Murrells Inlet", "Garden City"],
  },
  {
    slug: "north-myrtle-beach-restaurants",
    title: "North Myrtle Beach Restaurants: Local Spots, No Chains",
    h1: "North Myrtle Beach restaurants",
    desc: "Local (non-chain) restaurants in North Myrtle Beach, from Cherry Grove to Barefoot Landing, with prices, vibes and directions.",
    intro: "North Myrtle Beach has a slower, more local feel than the main strip. Here is every independent restaurant in North Myrtle Beach on our map, starting with the spots we've checked by hand.",
    guide: [
      {h: "What are the different areas of North Myrtle Beach?", p: [
        "<strong>North Myrtle Beach is made up of Cherry Grove, Ocean Drive, Crescent Beach and Windy Hill, plus Barefoot Landing on the waterway.</strong> North Myrtle Beach is really four old beach towns that joined together in 1968: Cherry Grove, Ocean Drive, Crescent Beach and Windy Hill. Each one still has its own feel, and the restaurants change as you go.",
        "<strong>Cherry Grove</strong>, at the north end, has marsh channels behind the beach and the Cherry Grove Pier. <strong>Ocean Drive</strong>, or OD, is the old center of town around Main Street. It's where the shag, South Carolina's state dance, grew up in the beach clubs. <strong>Crescent Beach</strong> and <strong>Windy Hill</strong>, to the south, are quieter and mostly homes and condos.",
        "<strong>Barefoot Landing</strong> sits on the Intracoastal Waterway near the south end of town, with shops and several restaurants on the water. And just north of the city line, <strong>Little River</strong> is an old fishing village with seafood spots on the waterfront.",
      ]},
      {h: "What should I eat in North Myrtle Beach?", p: [
        "<strong>Seafood is the big draw, from buffets like Preston's and The Giant Crab to oysters at Rockefellers Raw Bar.</strong> Preston's and The Giant Crab are big seafood buffets, Flying Fish has water views, and Rockefellers Raw Bar is a casual pick for oysters. Snooky's Oceanfront puts you right by the ocean, with live music and a dog-friendly spot to sit.",
        "For a special night out, SeaBlue Restaurant and Wine Bar, 21 Main Prime Steakhouse, Bistro90 and Rioz Brazilian Steakhouse are some of the dressier choices. For Italian, try Villa Tuscanna or Benny's Trattoria.",
        "Breakfast is easy to find too. Hoskin's Restaurant serves Southern breakfast and lunch, and Hot Stacks Pancake House, Kitchen Table and Souffle's are local morning spots. Finish the day with a cone at Original Painter's Homemade Ice Cream.",
        "If you want to see the shag up close, O D Lounge is a classic place to watch beach-music dancing, and Molly Darcy's Irish Pub is a lively spot for a pint.",
      ]},
      {h: "How far is North Myrtle Beach from Myrtle Beach?", p: [
        "<strong>It's about 20 to 30 minutes north of downtown Myrtle Beach on Highway 17, depending on traffic.</strong> Main Street, Barefoot Landing and Cherry Grove are spread out, so you'll want a car to get between them.",
        "Summer is busy, but it usually feels calmer than the Myrtle Beach strip. In spring and fall, shag dancing gatherings bring big crowds to Main Street, so expect longer waits on those weekends.",
        "Many restaurants keep shorter hours from November through February, and a few close a day or two a week. Check before you drive over.",
      ]},
    ],
    tips: [
      "Main Street in Ocean Drive is the walkable part of town. Park once and walk between dinner, ice cream and the beach.",
      "Barefoot Landing is an easy pick with kids: shops, water views and several places to eat in one stop.",
      "Seafood buffets are busiest at peak dinner time in summer. Eating before 5 PM usually means a shorter line.",
      "Even if you don't dance, it's fun to watch the shag at a beach club on an early evening.",
      "Little River is only about 10 minutes north if you want more seafood on the water.",
    ],
    faq: [
      ["Is North Myrtle Beach a separate town from Myrtle Beach?", "Yes. North Myrtle Beach is its own city, made up of the old beach towns of Cherry Grove, Ocean Drive, Crescent Beach and Windy Hill. It's about 20 to 30 minutes north of downtown Myrtle Beach."],
      ["Where can I eat on the water in North Myrtle Beach?", "Barefoot Landing has several restaurants on the Intracoastal Waterway. For ocean views, try Snooky's Oceanfront or Pirate's Cove Rooftop. Flying Fish and Joe's Bar & Grill also have water views."],
      ["What is shag dancing?", "The shag is a laid-back partner dance done to beach music. It started in the beach clubs of the Carolinas, it's closely tied to Ocean Drive in North Myrtle Beach, and it's South Carolina's official state dance."],
    ],
    match: p => p.area === "North Myrtle Beach",
    stay: ["North Myrtle Beach"],
  },
  {
    slug: "surfside-beach-restaurants",
    title: "Surfside Beach Restaurants: Local Spots, No Chains",
    h1: "Surfside Beach restaurants",
    desc: "Local (non-chain) restaurants in Surfside Beach, SC, the family beach south of Myrtle Beach. Prices, vibes and directions.",
    intro: "Surfside Beach is known as \"The Family Beach,\" and its restaurants match: casual, friendly and close to the sand. Here is every independent restaurant in Surfside Beach on our map.",
    guide: [
      {h: "What are restaurants like in Surfside Beach?", p: [
        "<strong>They're casual, family-friendly and easy on the budget, and most are fine to walk into straight from the beach.</strong> Surfside Beach is a small town just south of Myrtle Beach, with Garden City on its other side. It's mostly beach homes, rentals and low-rise hotels, without a big amusement strip, which is how it earned the nickname The Family Beach.",
        "The restaurants fit that feel. Think pancake houses, diners, burger joints, pizza and seafood, at prices that work for a family on vacation. Most places are casual enough to walk in straight from the beach.",
        "The Surfside Beach Pier is the center of the beachfront, and most of the restaurants are a short drive away along Highway 17 and the roads that lead down to the ocean.",
      ]},
      {h: "Where should I eat in Surfside Beach?", p: [
        "<strong>Go to Surf Diner or Golden Egg Pancake House for breakfast, Crabby Mike's for seafood, and Hamburger Joe's or Pizza Hyena for a casual meal.</strong>",
        "<strong>Breakfast</strong> is a big deal here. Surf Diner, Golden Egg Pancake House, Johnny D's Waffles and Wooden Spoon are all local morning spots, and Wooden Spoon serves Southern cooking too.",
        "<strong>Seafood:</strong> Crabby Mike's Calabash Seafood is a big buffet with Calabash-style fried seafood, Pirate's Table is another seafood buffet, and Bubba's Fish Shack is a casual place for fried fish.",
        "<strong>Casual eats:</strong> Hamburger Joe's for burgers, Pizza Hyena for pizza, Mango Thai when you want something different, and Neal & Pam's Bar and Grill for a drink and bar food. Hamburger Joe's, Pizza Hyena and Neal & Pam's are marked dog-friendly on our map. End the night with a cone at Painter's Homemade Ice Cream.",
      ]},
      {h: "How far is Surfside Beach from Myrtle Beach?", p: [
        "<strong>Surfside is about 15 to 20 minutes south of downtown Myrtle Beach, and only a few minutes from Garden City and the MarshWalk.</strong> Staying here puts you close to both ends of the action.",
        "Summer weekends are busy, but waits are usually shorter than on the Myrtle Beach strip. Breakfast spots have the longest lines, mostly between 8:30 and 10 AM.",
        "In winter, a few places shorten their hours or close one day a week. It's a quiet, easy time to visit if you don't mind cooler beach days.",
      ]},
    ],
    tips: [
      "Eat breakfast early. The pancake houses fill up fast on summer mornings.",
      "Calabash-style means lightly breaded, fried seafood. It's a classic on this part of the coast.",
      "Several spots welcome dogs on their patios. Look for the dog-friendly tag below and call to check the rules.",
      "Beach parking near the pier fills up early in summer, and some of it is paid. Check the signs before you leave the car.",
      "Garden City and the MarshWalk are a short drive south if you want dinner on the water.",
    ],
    faq: [
      ["Why is Surfside Beach called The Family Beach?", "It's a small, quiet town with mostly homes, rentals and low-rise hotels, and its restaurants and shops lean casual and kid-friendly."],
      ["Where can I get breakfast in Surfside Beach?", "Surf Diner, Golden Egg Pancake House, Johnny D's Waffles and Wooden Spoon are local breakfast spots. Go before 8:30 AM on summer weekends to skip the longest waits."],
      ["How far is Surfside Beach from Myrtle Beach?", "About 15 to 20 minutes by car from downtown Myrtle Beach, depending on traffic. The Murrells Inlet MarshWalk is about 10 to 15 minutes south."],
    ],
    match: p => p.area === "Surfside Beach",
    stay: ["Surfside Beach"],
  },
  {
    slug: "romantic-restaurants-myrtle-beach",
    title: "Romantic Restaurants in Myrtle Beach: Local Date Night Spots",
    h1: "Romantic date night restaurants on the Grand Strand",
    desc: "Local (no chains) romantic restaurants for date night or an anniversary in Myrtle Beach, Murrells Inlet, Pawleys Island and North Myrtle Beach.",
    intro: "Planning an anniversary, a proposal or just a night out without the kids? These are the local spots on our map that we've marked as good for date night: quieter rooms, water views, good wine lists and food worth dressing up for. Most of them take reservations, and the best tables go first on summer weekends.",
    guide: [
      {h: "What's the best romantic restaurant in Myrtle Beach for my kind of night?", p: [
        "<strong>Pick Sea Captain's House or Gulfstream Cafe for a sunset water view, Aspen Grille or Thoroughbreds for a dressy dinner, and Toscana or Villa Romana for Italian.</strong>",
        "<strong>A water view at sunset.</strong> Sea Captain's House sits right on the ocean in Myrtle Beach. Gulfstream Cafe in Garden City looks out over the inlet. Wicked Tuna, Wahoo's Fish House and Hot Fish Club are all in Murrells Inlet, and Clark's Seafood and Chophouse is on the water in Little River. Joe's Bar & Grill in North Myrtle Beach is another water-view pick.",
        "<strong>A dressy, special-occasion dinner.</strong> Aspen Grille, Thoroughbreds, SeaBlue Restaurant and Wine Bar and 21 Main Prime Steakhouse are the most upscale spots on this list, with prices to match. Flamingo Grill and Hook and Barrel are good for steak and seafood in a nice room.",
        "<strong>Italian.</strong> Toscana Italian Kitchen and Bar, Villa Romana, Travinia Italian Kitchen, Villa Tuscanna, Benny's Trattoria and Angelo's Steak & Pasta all made our date-night list.",
        "<strong>Something a little different.</strong> Rioz Brazilian Steakhouse carves meat at your table. Co Sushi and Art Burger Sushi Bar are fun for a more relaxed date, Bistro90 is another good North Myrtle Beach choice, and Heirloom Bistro works well for a brunch date.",
      ]},
      {h: "How do I plan a special date night in Myrtle Beach?", p: [
        "<strong>Reserve early, especially for summer weekends and around Valentine's Day, and tell the restaurant if it's a birthday, anniversary or proposal.</strong> If a place doesn't take reservations, go early.",
        "Many restaurants will try to give you a better table for a birthday, anniversary or proposal.",
        "Dress on the Grand Strand is relaxed. Even at the nicer spots, resort casual is fine: a collared shirt or a sundress. Save the flip-flops for the beach bars.",
        "Plan a walk after dinner. The Murrells Inlet MarshWalk, the Myrtle Beach Boardwalk, Barefoot Landing and the Market Common all make an easy, pretty stroll.",
      ]},
    ],
    tips: [
      "Book ahead for Friday and Saturday nights from Memorial Day through Labor Day. Off-season weeknights are much easier.",
      "Ask for a window or patio table when you book if you want a water view. Those go first.",
      "Check sunset time before you go. Inlet and marsh views are at their best in the half hour before dark.",
      "Several of these are on the Murrells Inlet MarshWalk, where you can walk the boardwalk after dinner.",
      "Mention a birthday or anniversary when you reserve. It can make a difference in where you're seated.",
    ],
    faq: [
      ["What's the most romantic restaurant in Myrtle Beach?", "It depends on the night you want. For a sunset view, try Sea Captain's House on the ocean or Gulfstream Cafe on the inlet. For a dressy dinner, Aspen Grille or Thoroughbreds. For Italian, Toscana or Villa Romana."],
      ["Do I need a reservation for date night in Myrtle Beach?", "For Friday and Saturday nights in summer, yes, if the restaurant takes them. Off-season weeknights are much easier, and you can often walk in."],
      ["What should I wear to a nice dinner in Myrtle Beach?", "Resort casual works almost everywhere: nice shorts or slacks with a collared shirt, or a sundress. A few upscale spots lean dressier, so call ahead if you're unsure."],
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
    guide: [
      {h: "What kind of Italian restaurants are on the Grand Strand?", p: [
        "<strong>You'll find two main kinds: relaxed family places with big portions, and quieter date-night rooms.</strong> The Grand Strand has more Italian restaurants than you might expect at a seafood beach, and a lot of the local places lean toward hearty, red-sauce cooking with big portions, the kind of meal that's welcome after a long day in the sun.",
        "<strong>Family places</strong> like Luigi's Trattoria, Angelo's Steak & Pasta and Crave Italian Oven & Bar are relaxed, kid-friendly and easy on a group budget. <strong>Date-night rooms</strong> like Toscana Italian Kitchen and Bar, Villa Romana, Travinia Italian Kitchen, Villa Tuscanna and Benny's Trattoria are quieter and better for a slow dinner with a glass of wine.",
      ]},
      {h: "How do I choose an Italian restaurant in Myrtle Beach?", p: [
        "<strong>Choose by location first, then price, then the kind of night you want.</strong>",
        "<strong>Start with location.</strong> The Italian spots are spread from North Myrtle Beach down to the Market Common, and summer traffic on Kings Highway can turn a short trip into a long one. Villa Tuscanna, Benny's Trattoria and Crave are in North Myrtle Beach, Travinia is at the Market Common, and the rest are in Myrtle Beach.",
        "<strong>Check the price level.</strong> Each listing below shows dollar signs. One or two means a casual meal, and three means a nicer night out.",
        "<strong>Think about the night you want.</strong> With kids or a big group, pick a family spot and order a few platters to share. For an anniversary, book one of the quieter rooms and ask for a corner table.",
      ]},
      {h: "When are Italian restaurants in Myrtle Beach busiest?", p: [
        "<strong>Summer evenings from about 6 to 8 PM are the busiest, especially on weekends.</strong> Many places take reservations, and an early or late dinner makes a big difference.",
        "In the off-season, some smaller spots close a day or two a week. Call or check online before you drive over.",
      ]},
    ],
    tips: [
      "Many local Italian places do a lot of takeout. Ordering ahead is a good way to skip the summer wait.",
      "Family-style platters can feed a whole group for less than ordering one plate each.",
      "Some smaller spots close one or two days a week, often Sunday or Monday, especially in the off-season. Check hours before you go.",
      "Ask about the specials. Local spots often have dishes that aren't on the printed menu.",
      "Big group? Call ahead so the restaurant can set up a table for you.",
    ],
    faq: [
      ["Where can I find good Italian food in Myrtle Beach?", "For a nicer night out, try Toscana Italian Kitchen and Bar or Villa Romana in Myrtle Beach, or Travinia Italian Kitchen at the Market Common. For a casual family meal, Luigi's Trattoria and Angelo's Steak & Pasta are good picks."],
      ["Are there Italian restaurants in North Myrtle Beach?", "Yes. Villa Tuscanna, Benny's Trattoria and Crave Italian Oven & Bar are all in North Myrtle Beach."],
      ["Is there a kid-friendly Italian restaurant in Myrtle Beach?", "Luigi's Trattoria, Angelo's Steak & Pasta and Crave Italian Oven & Bar are relaxed family spots where kids fit right in."],
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
    guide: [
      {h: "What is the Market Common like?", p: [
        "<strong>The Market Common is a walkable neighborhood and shopping district in south Myrtle Beach, built on the former Myrtle Beach Air Force Base.</strong> Its main streets have shops and restaurants on the ground floor and apartments above, so it feels more like a small downtown than a mall.",
        "It's only a few minutes from the airport and the beach, but it has a very different feel from the oceanfront: newer, quieter and easy to walk. Locals come here for dinner and a stroll, and families like it for Grand Park next door.",
      ]},
      {h: "Where should I eat at the Market Common?", p: [
        "<strong>Travinia Italian Kitchen and Co Sushi are good choices for date night, and King Street Grille and Tidal Creek Brewhouse work well for families and dogs.</strong> King Street Grille is a sports bar that works for families and has a dog-friendly patio. Tidal Creek Brewhouse is a local brewery and café that serves breakfast too, and dogs are welcome there as well.",
        "For something quick and light, Bowled serves poke and grain bowls.",
        "Many restaurants here have sidewalk or patio seating, which is the best way to eat at the Market Common on a spring or fall evening.",
      ]},
      {h: "How far is the Market Common from downtown Myrtle Beach?", p: [
        "<strong>The Market Common is about 10 to 15 minutes south of downtown Myrtle Beach and just a few minutes from Myrtle Beach International Airport.</strong> Surfside Beach is a short drive farther south.",
        "It's busiest on Friday and Saturday evenings and during events in the district and at Grand Park. Weeknights are relaxed, and you can often walk right in.",
        "It's a good pick on a rainy day or in the off-season, when the beachfront is quiet but the Market Common still has people out walking and eating.",
      ]},
    ],
    tips: [
      "Parking is free in the lots and garages around the district.",
      "Grand Park, right next door, has a lake with a walking path. It's an easy after-dinner walk.",
      "It's a short drive from Myrtle Beach International Airport, so it works well for a first or last meal of a trip.",
      "Ask for a patio table on spring and fall evenings. They're the nicest seats in the district.",
      "Bringing the dog? Look for the dog-friendly tag below, and call ahead to check the patio rules.",
    ],
    faq: [
      ["What is the Market Common in Myrtle Beach?", "It's a walkable shopping, dining and residential district in south Myrtle Beach, built on the former Myrtle Beach Air Force Base, next to Grand Park."],
      ["How far is the Market Common from the Myrtle Beach airport?", "Only a few minutes by car, which makes it an easy stop for a meal on the way in or out of town."],
      ["Is the Market Common good for families?", "Yes. It's easy to walk, parking is free, and Grand Park next door has a lake with a walking path. Several restaurants there have family-friendly menus."],
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
    guide: [
      {h: "What is Garden City Beach like?", p: [
        "<strong>Garden City Beach is a laid-back beach town between Surfside Beach and Murrells Inlet, with beach houses, small hotels and casual places to eat.</strong> It's a narrow strip of land between the ocean and the back side of Murrells Inlet. It runs right into Surfside Beach to the north, and it feels a lot like it: beach houses, small hotels and casual places to eat.",
        "The Garden City Pier is the center of the beachfront, with arcades nearby and the Pier Snack Bar right there for burgers and breakfast. At the south end, the road runs out toward the inlet, and that's where you'll find Gulfstream Cafe, a dressier spot looking out over the water.",
      ]},
      {h: "Where should I eat in Garden City Beach?", p: [
        "<strong>Most Garden City restaurants are casual seafood, bar and grill, pizza, breakfast and ice cream spots, and Gulfstream Cafe is the local favorite for a sunset dinner.</strong> Many are a short walk or bike ride from the beach rentals, so you can skip the car for a night.",
        "Conch Cafe is a casual oceanfront seafood spot. It's closed for the season and plans to reopen in 2027, so check before you go.",
        "For a bigger choice of seafood restaurants, the Murrells Inlet MarshWalk is only a few minutes south.",
      ]},
      {h: "How far is Garden City Beach from Myrtle Beach?", p: [
        "<strong>Garden City is about 20 to 25 minutes south of downtown Myrtle Beach.</strong> Traffic on the roads into the beach can back up on summer Saturdays, when a lot of rentals turn over.",
        "In the off-season Garden City gets very quiet. Some beach spots close for weeks or months in winter, while restaurants along Highway 17 and in Murrells Inlet stay open.",
      ]},
    ],
    tips: [
      "Murrells Inlet and the MarshWalk are only a few minutes away if you want more seafood choices.",
      "Some beach spots keep shorter hours or close for part of the winter, so check before you drive over in the off-season.",
      "The south end looks out over the inlet, and sunset there is one of the prettiest on the Grand Strand. Ask for a window table.",
      "The pier makes an easy after-dinner walk.",
      "Rainy day? The arcades near the pier are a simple way to pass an hour with kids.",
    ],
    faq: [
      ["Where is Garden City Beach?", "Between Surfside Beach and Murrells Inlet, about 20 to 25 minutes south of downtown Myrtle Beach."],
      ["Is there a restaurant on the water in Garden City?", "Yes. Gulfstream Cafe looks out over the inlet at the south end, and the Pier Snack Bar is right at the Garden City Pier. Conch Cafe, on the oceanfront, is closed for the season until 2027."],
      ["Are Garden City restaurants open in winter?", "Many are, but some beach spots close for part of the winter or cut back their hours. Check before you go, or head a few minutes south to Murrells Inlet, where more places stay open."],
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
    guide: [
      {h: "Are there restaurants on Pawleys Island?", p: [
        "<strong>Very few. Pawleys Island is a small barrier island of old beach houses, and nearly all the restaurants are on the mainland along Highway 17.</strong> You reach it by two causeways over the marsh, and most of the island is homes and rentals.",
        "Those mainland restaurants sit in small shopping centers and old cottages, with Litchfield Beach just to the north. The Hammock Shops, where the well-known Pawleys Island rope hammocks are sold, are on the same stretch.",
        "The pace is slower than Myrtle Beach. Expect seafood, Southern cooking, a few dressier dinner spots, pizza, coffee and casual bars, most of them local.",
      ]},
      {h: "How do I choose a restaurant in Pawleys Island?", p: [
        "<strong>Pick a date-night spot for a nice dinner, a Highway 17 shopping center for a casual meal, or drive 15 minutes north to the MarshWalk for seafood on the water.</strong>",
        "<strong>For a nice dinner</strong>, look for the spots marked date night on our map. Pawleys has some quieter, more grown-up dining rooms, good for an anniversary or a night away from the beach crowd.",
        "<strong>For a casual meal</strong>, the shopping centers along Highway 17 have pizza, tacos, sandwiches and bar food, easy to grab after a beach day.",
        "<strong>For seafood on the water</strong>, the Murrells Inlet MarshWalk is about 15 minutes north, and plenty of Pawleys visitors make the drive for a sunset dinner.",
      ]},
      {h: "How far is Pawleys Island from Myrtle Beach?", p: [
        "<strong>Pawleys Island is about 30 to 40 minutes south of Myrtle Beach on Highway 17.</strong> Brookgreen Gardens and Huntington Beach State Park are on the way, so it's easy to make a day of it.",
        "Highway 17 is the main road along this part of the coast, so summer traffic can back up around lunch and dinner. Give yourself a few extra minutes.",
        "Summer is busy, but Pawleys stays calmer than Myrtle Beach. Spring and fall are lovely. Some restaurants close one or two days a week, especially in winter.",
      ]},
    ],
    tips: [
      "Most of the restaurants are along Highway 17, not on the island itself.",
      "It's about 30 minutes south of Myrtle Beach, and an easy day trip from Murrells Inlet.",
      "Historic Georgetown is about 15 minutes farther south if you want to make a day of it.",
      "Many spots are tucked into small shopping centers, so watch for signs from the highway.",
      "Staying on the island? Plan on a short drive to dinner, since the restaurants aren't within walking distance.",
    ],
    faq: [
      ["Are there restaurants on Pawleys Island itself?", "Very few. Almost all of them are on the mainland along Highway 17 and in Litchfield, a short drive over the causeway."],
      ["How far is Pawleys Island from Myrtle Beach?", "About 30 to 40 minutes south on Highway 17, depending on where you start and on summer traffic."],
      ["What can I do near Pawleys Island besides eat?", "Browse the Hammock Shops, visit Brookgreen Gardens or Huntington Beach State Park on the way down, or drive 15 minutes south to historic Georgetown."],
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
    guide: [
      {h: "What is Conway, SC like?", p: [
        "<strong>Conway is an old river town and the county seat of Horry County, about 20 minutes inland from Myrtle Beach.</strong> Big live oaks shade the streets, and the historic downtown sits right by the Waccamaw River.",
        "Downtown restaurants are mostly local: cafés, Southern cooking, bars, pizza and a few nicer dinner spots, many of them in older storefronts. Out along Highway 501 and near Coastal Carolina University you'll find more casual places and student favorites.",
      ]},
      {h: "Is Conway worth the drive from the beach for dinner?", p: [
        "<strong>Yes, if you want a break from the crowds. Conway makes a nice half-day trip from the beach.</strong> You trade the tourist crowds for a small Southern downtown where the people at the next table are more likely to be locals than visitors.",
        "Because Conway doesn't depend on summer visitors, its restaurants don't swing as much with the seasons as the beach spots do. It's a good choice in the off-season, when some beach restaurants cut back.",
        "Pair your meal with a walk on the <strong>Conway Riverwalk</strong>, a boardwalk along the Waccamaw River through cypress trees and river marsh. It's free, shaded and close to downtown.",
      ]},
      {h: "How far is Conway from Myrtle Beach?", p: [
        "<strong>Conway is about 20 to 25 minutes from Myrtle Beach on Highway 501.</strong> On summer Saturdays, traffic on 501 mostly backs up heading toward the beach, so driving inland in the afternoon is usually easy.",
        "Some downtown spots keep shorter hours, and a few close on Sundays or Mondays. Check hours before you drive in.",
        "Coastal Carolina University home football games and graduation weekends bring big crowds, so plan ahead on those dates.",
      ]},
    ],
    tips: [
      "Downtown Conway is small and walkable. Park once and walk to dinner and the Riverwalk.",
      "Coastal Carolina home games and graduation weekends get busy, so plan ahead on those dates.",
      "The Riverwalk is free and shaded. It's a good walk before or after a meal.",
      "Some downtown spots close early or take a day off on Sunday or Monday. Check hours first.",
      "Heading in from the beach? Go inland in the afternoon and drive back after dinner to miss the worst traffic.",
    ],
    faq: [
      ["How far is Conway from Myrtle Beach?", "About 20 to 25 minutes by car on Highway 501, depending on where you start and on traffic."],
      ["Is downtown Conway worth visiting?", "Yes, if you want a break from the beach. It's a small, walkable historic downtown with local restaurants, shops and the Riverwalk along the Waccamaw River."],
      ["What is the Conway Riverwalk?", "It's a boardwalk along the Waccamaw River near downtown Conway, with views of cypress trees and river marsh. It's free and makes an easy walk before or after a meal."],
    ],
    match: p => p.area === "Conway",
    stay: ["Conway"],
  },
];

// Things-to-do guides (todo.js) live in their own file.
PAGES.push(...require("./do-pages.js"));

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
  const meta = [p.area, p.c.replace(/ · /g, ", "), price(p), p.cost].filter(Boolean).join(" · ");
  if (p.d) note = [p.d, p.hn, p.tel ? "📞 " + p.tel.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3") : ""].filter(Boolean).join(" · ");
  const tags = p.tags.filter(t => TAG_LABEL[t]).map(t => `<span class="tag">${TAG_LABEL[t]}</span>`).join("");
  return `<li class="spot"><div class="em">${p.e}</div><div><h3>${esc(p.n)}</h3><div class="meta">${esc(meta)}</div>${note ? `<div class="hol">${esc(note)}</div>` : ""}${tags ? `<div class="tags">${tags}</div>` : ""}<div class="acts">${p.web ? `<a href="${esc(p.web)}" target="_blank" rel="noopener">Website</a>` : ""}<a href="${dir}" target="_blank" rel="noopener">Directions</a></div></div></li>`;
}

function page(cfg, spots) {
  const url = SITE + cfg.slug + "/";
  const others = PAGES.filter(o => o !== cfg).map(o => `<a href="../${o.slug}/">${esc(o.h1)}</a>`).join("");
  const ld = {
    "@context": "https://schema.org", "@type": "ItemList", name: cfg.h1, numberOfItems: spots.length,
    itemListElement: spots.map((p, i) => ({"@type": "ListItem", position: i + 1, item: {"@type": cfg.kind === "do" ? "TouristAttraction" : "Restaurant", name: p.n, ...(p.d ? {description: p.d} : {}), address: {"@type": "PostalAddress", addressLocality: p.area === "MarshWalk" ? "Murrells Inlet" : p.area, addressRegion: "SC"}, ...(p.web ? {url: p.web} : {})}})),
  };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(cfg.title)} | Grand Strand Eats</title>
<meta name="description" content="${esc(cfg.desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article"><meta property="og:site_name" content="Grand Strand Eats"><meta property="og:title" content="${esc(cfg.title)}"><meta property="og:description" content="${esc(cfg.desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}share-v2.png"><meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0e7c86">
<link rel="icon" href="../icon-192.png" type="image/png">
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
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1963548887313701" crossorigin="anonymous"></script>
</head>
<body>
<div class="wrap">
<header><a href="../"><span class="logo">🌅</span>Grand Strand Eats</a></header>
<h1>${esc(cfg.h1)}</h1>
<p class="intro">${esc(cfg.intro)}</p>
<a class="cta" href="../${cfg.kind === "do" ? "?do" : ""}">🗺 See them on the map</a>
<div class="count">${cfg.kind === "do" ? `${spots.length} things to do` : `${spots.length} local spots · no chains`}</div>
<ol>
${spots.map(p => spot(p, cfg.notes && cfg.notes[p.id])).join("\n")}
</ol>
${cfg.guide ? cfg.guide.map(s => `<section class="guide"><h2>${esc(s.h)}</h2>${s.p.map(t => `<p>${t}</p>`).join("")}</section>`).join("\n") : ""}
${cfg.tips ? `<div class="box tips"><h2>Local tips</h2><ul>${cfg.tips.map(t => `<li>${esc(t)}</li>`).join("")}</ul></div>` : ""}
${cfg.faq ? `<section class="guide faq"><h2>Common questions</h2>${cfg.faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join("")}</section>` : ""}
<div class="note">Hours, prices and vibes change, and some listings are still being checked. Call ahead or check the ${cfg.kind === "do" ? "attraction" : "restaurant"}'s website before you go. Know a local spot we're missing? Tell us on our <a href="https://www.facebook.com/profile.php?id=61596237747958">Facebook page</a>.</div>
<div class="box"><h2>${cfg.kind === "do" ? "Book tours, cruises & shows" : "After dinner: things to do on the Grand Strand"}</h2><div>${TODO.map(([e, label, q]) => `<a href="${GYG(q)}" target="_blank" rel="noopener sponsored">${e} ${label}</a>`).join("")}</div><p>Booked through GetYourGuide. Affiliate links.</p></div>
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
<p>This site uses Google AdSense to show ads. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. Google's use of advertising cookies lets it and its partners serve ads to you based on your visits to this and other sites. You can opt out of personalized advertising in <a href="https://www.google.com/settings/ads" rel="noopener">Google's Ads Settings</a>, or opt out of some other vendors' cookies at <a href="https://www.aboutads.info/choices/" rel="noopener">aboutads.info</a>.</p>
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
<meta property="og:type" content="website"><meta property="og:site_name" content="Grand Strand Eats"><meta property="og:title" content="${esc(cfg.title)}"><meta property="og:description" content="${esc(cfg.desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}share-v2.png">
<meta name="theme-color" content="#0e7c86">
<link rel="icon" href="../icon-192.png" type="image/png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
${style.replace("</style>", INFO_CSS + "\n</style>")}
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1963548887313701" crossorigin="anonymous"></script>
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
  let spots = cfg.kind === "do" ? THINGS.filter(cfg.match) : sortSpots(PLACES.filter(cfg.match));
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
