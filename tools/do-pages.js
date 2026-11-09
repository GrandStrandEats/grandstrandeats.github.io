// "Things to do" guide pages, built from todo.js by build-pages.js.
module.exports = [
  {
    slug: "things-to-do-myrtle-beach",
    kind: "do",
    title: "Things to Do in Myrtle Beach: Local Map & Guide",
    h1: "Things to do in Myrtle Beach",
    desc: "The best things to do in Myrtle Beach and the Grand Strand: state parks, piers, the Boardwalk, shows, museums and family attractions, on a free local map.",
    intro: "Myrtle Beach is more than the beach. Here are the attractions, parks, piers and shows worth your time along the Grand Strand, from free spots locals love to the big-ticket shows. Every one is on our free map, so you can see what's near you and pair it with a local place to eat.",
    guide: [
      {h: "What is there to do in Myrtle Beach besides the beach?", p: [
        "<strong>Plenty: state parks, fishing piers, an oceanfront boardwalk, an aquarium, dinner shows, live music theaters, gardens and history museums.</strong> Most of the big attractions sit along Highway 17 between North Myrtle Beach and Murrells Inlet.",
        "For a first visit, walk the <strong>Boardwalk</strong> and ride the <strong>SkyWheel</strong>, spend a rainy afternoon at <strong>Ripley's Aquarium</strong>, catch a show at the <strong>Carolina Opry</strong> or <strong>Alabama Theatre</strong>, and drive south to <strong>Brookgreen Gardens</strong> and <strong>Huntington Beach State Park</strong>.",
      ]},
      {h: "What is Myrtle Beach known for?", p: [
        "<strong>Myrtle Beach is known for 60 miles of beach, golf, seafood, live shows and family attractions.</strong> The Grand Strand runs from Little River near the North Carolina line down to Pawleys Island.",
        "North Myrtle Beach is the home of the shag, South Carolina's state dance, and Murrells Inlet calls itself the seafood capital of South Carolina.",
      ]},
      {h: "What can you do in Myrtle Beach in the off-season?", p: [
        "<strong>Shows, museums, the aquarium, state parks and the piers stay open in the cooler months.</strong> Some outdoor attractions, like the water park and amusement park, close for the winter.",
        "Christmas shows run from early November at the Carolina Opry, Alabama Theatre, Pirates Voyage and Legends in Concert. Fall and winter are also a great time for the state parks, with fewer bugs and smaller crowds.",
      ]},
    ],
    tips: [
      "Hours change a lot by season here. Check the attraction's website the day you go.",
      "Broadway at the Beach puts Ripley's Aquarium, WonderWorks and the Hollywood Wax Museum within walking distance of each other.",
      "Huntington Beach State Park, Atalaya and Brookgreen Gardens sit across the highway from each other. Make it one day trip.",
      "Book show tickets ahead in summer and during the holiday season.",
      "Summer Saturdays are check-in day for a lot of rentals, so Highway 17 and 501 get heavy traffic.",
    ],
    faq: [
      ["What is the most popular attraction in Myrtle Beach?", "The beach and the Boardwalk draw the most people. For a ticketed attraction, Ripley's Aquarium at Broadway at the Beach is one of the most popular, especially on rainy days."],
      ["Is Myrtle Beach good for families?", "Yes. Between the aquarium, mini golf, go-karts, state parks, piers and dinner shows, there is plenty for kids of every age."],
      ["What is there to do in Myrtle Beach at night?", "Walk the Boardwalk and ride the SkyWheel, see a show at the Carolina Opry, Alabama Theatre or Pirates Voyage, or head to the Murrells Inlet MarshWalk for live music on the water."],
    ],
    match: () => true,
    stay: ["Myrtle Beach", "North Myrtle Beach"],
  },
  {
    slug: "free-things-to-do-myrtle-beach",
    kind: "do",
    title: "Free Things to Do in Myrtle Beach (Local Guide)",
    h1: "Free things to do in Myrtle Beach",
    desc: "Free things to do in Myrtle Beach and the Grand Strand: the Boardwalk, the MarshWalk, free museums, parks, nature preserves and more, on a free local map.",
    intro: "A Myrtle Beach trip doesn't have to cost a fortune. These spots cost nothing to visit, from the oceanfront Boardwalk to a free history museum and a working early-1900s farm. All of them are on our free map.",
    guide: [
      {h: "What can you do in Myrtle Beach for free?", p: [
        "<strong>Walk the Boardwalk, stroll Broadway at the Beach or Barefoot Landing, watch the sunset on the Murrells Inlet MarshWalk, and visit the free Horry County Museum.</strong> The beach itself is free too, with public access points all along the Strand.",
        "Nature lovers can hike <strong>Lewis Ocean Bay Heritage Preserve</strong>, one of the few places where Venus flytraps grow wild, or walk the shaded <strong>Conway Riverwalk</strong>.",
      ]},
      {h: "Are there free things to do with kids in Myrtle Beach?", p: [
        "<strong>Yes. The L.W. Paul Living History Farm in Conway is free and has farm animals and demonstrations.</strong> The Horry County Museum is free too.",
        "Grand Park at Market Common has playgrounds and a lake, and Hurl Rock Park has the rocky tide pools kids love at low tide.",
      ]},
      {h: "Is the Myrtle Beach Boardwalk free?", p: [
        "<strong>Yes. Walking the Boardwalk is free any time.</strong> You only pay for the rides, arcades, shops and food along the way.",
      ]},
    ],
    tips: [
      "Parking near the Boardwalk and beach accesses is often paid in season. Check the signs.",
      "The Horry County Museum is open weekdays, so plan a weekday visit.",
      "Low tide is the best time for Hurl Rock Park's coquina rocks and tide pools.",
      "Bring bug spray to Lewis Ocean Bay, especially in warm months.",
    ],
    faq: [
      ["Is the beach free in Myrtle Beach?", "Yes. The beach is public and free. Some beach access lots charge for parking in season."],
      ["What is free to do in Myrtle Beach at night?", "Walk the Boardwalk, browse Broadway at the Beach, or stroll the MarshWalk in Murrells Inlet and listen to the live music."],
      ["Are there free museums near Myrtle Beach?", "Yes. The Horry County Museum in Conway and its L.W. Paul Living History Farm are both free."],
    ],
    match: p => p.cost === "Free",
    stay: ["Myrtle Beach"],
  },
  {
    slug: "things-to-do-myrtle-beach-with-kids",
    kind: "do",
    title: "Things to Do in Myrtle Beach With Kids (Family Guide)",
    h1: "Things to do in Myrtle Beach with kids",
    desc: "Family-friendly things to do in Myrtle Beach: the aquarium, WonderWorks, go-karts, mini golf, alligators, state parks, piers and kid-friendly shows, on a free map.",
    intro: "Traveling with kids? Here are the Myrtle Beach and Grand Strand attractions families love, from the aquarium and alligators to go-karts, mini golf and pirate shows. Every one is on our map, along with family-friendly restaurants nearby.",
    guide: [
      {h: "What is there for kids to do in Myrtle Beach?", p: [
        "<strong>Kids love Ripley's Aquarium, WonderWorks, Alligator Adventure, mini golf, go-karts and the Pirates Voyage dinner show.</strong> Many of them are clustered around Broadway at the Beach and Barefoot Landing.",
        "For outdoor time, the state parks have nature trails, marsh boardwalks and quieter beaches, and the piers are great for a first fishing trip.",
      ]},
      {h: "What can kids do in Myrtle Beach on a rainy day?", p: [
        "<strong>Ripley's Aquarium, WonderWorks and the Hollywood Wax Museum are all indoors at Broadway at the Beach.</strong> The dinner shows are indoors too.",
      ]},
      {h: "What is cheap to do with kids in Myrtle Beach?", p: [
        "<strong>The beach, the Boardwalk, the L.W. Paul Living History Farm and Grand Park cost nothing.</strong> A state park day costs a few dollars per person, and a Pelicans baseball game is one of the cheapest nights out in summer.",
      ]},
    ],
    tips: [
      "Buy aquarium and show tickets online ahead of busy weeks.",
      "Go to indoor attractions early on rainy days. Everyone else has the same idea by noon.",
      "Watch for alligators (from a distance!) along the Huntington Beach State Park causeway.",
      "Many go-kart and mini golf spots cut back hours in the off-season.",
    ],
    faq: [
      ["What is good to do in Myrtle Beach with toddlers?", "Ripley's Aquarium, the beach at Myrtle Beach State Park, and the farm animals at the free L.W. Paul Living History Farm are all good picks for little ones."],
      ["Is Myrtle Beach good for teenagers?", "Yes. Teens tend to like WonderWorks, the go-kart tracks, the SkyWheel and the Boardwalk at night."],
    ],
    match: p => p.tags.includes("kids"),
    stay: ["Myrtle Beach", "North Myrtle Beach"],
  },
  {
    slug: "rainy-day-things-to-do-myrtle-beach",
    kind: "do",
    title: "Rainy Day Things to Do in Myrtle Beach (Indoor Ideas)",
    h1: "Rainy day things to do in Myrtle Beach",
    desc: "Indoor things to do in Myrtle Beach when it rains: the aquarium, WonderWorks, shows, museums and more, on a free local map.",
    intro: "Rained out at the beach? Myrtle Beach has plenty of indoor attractions, from the aquarium to dinner shows and museums. Here's where to go when the weather turns, with local restaurants nearby on our map.",
    guide: [
      {h: "What can you do in Myrtle Beach when it rains?", p: [
        "<strong>Go to Ripley's Aquarium, WonderWorks or the Hollywood Wax Museum, catch a show, or visit a museum.</strong> Those three indoor attractions are all at Broadway at the Beach.",
        "Shows at the Carolina Opry, Alabama Theatre, Legends in Concert, Pirates Voyage and Medieval Times are a good way to wait out a storm.",
      ]},
      {h: "Do summer storms in Myrtle Beach last all day?", p: [
        "<strong>Often not. Summer storms on the Grand Strand tend to pop up in the afternoon and pass within an hour or two.</strong> Plan an indoor stop for mid-afternoon and you may get the beach back by evening.",
      ]},
    ],
    tips: [
      "Indoor attractions fill up fast on rainy days. Go early or buy tickets online.",
      "Lightning closes the beach and piers. Wait 30 minutes after the last thunder.",
      "The Horry County Museum in Conway is free and indoors on weekdays.",
    ],
    faq: [
      ["What is the best indoor attraction in Myrtle Beach?", "Ripley's Aquarium is one of the most popular, with an underwater tunnel full of sharks and sea turtles."],
      ["Are Myrtle Beach shows open year-round?", "Most of the big theaters run shows much of the year, with Christmas shows from early November. Check each theater's schedule."],
    ],
    match: p => p.tags.includes("rainy"),
    stay: ["Myrtle Beach"],
  },
  {
    slug: "myrtle-beach-fishing-piers",
    kind: "do",
    title: "Myrtle Beach Fishing Piers: Grand Strand Pier Guide",
    h1: "Myrtle Beach fishing piers",
    desc: "Fishing piers on the Grand Strand, from Cherry Grove to Garden City, with hours, phone numbers and a free map. Walk out for the view or drop a line.",
    intro: "The Grand Strand has a pier every few miles, and you don't have to fish to enjoy one. Here are the fishing piers from North Myrtle Beach to Garden City, with hours and contact info where the pier posts them.",
    guide: [
      {h: "Do you need a fishing license to fish from a pier in Myrtle Beach?", p: [
        "<strong>Usually not. South Carolina lets licensed piers cover their anglers, so you pay the pier's fishing fee instead of buying your own saltwater license.</strong> Ask at the pier house to be sure.",
      ]},
      {h: "Can you walk on Myrtle Beach piers without fishing?", p: [
        "<strong>Yes. Most piers let you walk out for a small fee or for free.</strong> They are great for sunrise, dolphin spotting and photos. Prices vary by pier and season.",
      ]},
    ],
    tips: [
      "Most piers rent rods and sell bait, so you don't need to bring gear.",
      "Fall is a favorite fishing season here, with cooler weather and fewer crowds.",
      "Piers close during storms and lightning.",
    ],
    faq: [
      ["What is the longest pier in Myrtle Beach?", "Apache Pier, at Apache Family Campground, bills itself as the longest wooden pier on the East Coast."],
      ["Which Myrtle Beach pier is best for families?", "The pier at Myrtle Beach State Park and the Surfside Beach Pier are quieter and easy with kids."],
    ],
    match: p => p.tags.includes("pier"),
    stay: ["Myrtle Beach", "Surfside Beach"],
  },
];
