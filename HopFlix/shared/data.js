const HOPFLIX_DATA = [

     /* ------------------------ TV SERIES ------------------------ */

  {
    id: 1, title: "Amphibia", type: "series", year: 2019, genres: ["Animation","Adventure","Comedy","Family"],
    rating: 8.1, description: "A self-centered teenager is magically transported to Amphibia, a rural marshland full of frog people, and must learn what it means to be a hero.",
    cover: "/images/covers/amphibia.jpg", trailer: "https://www.youtube.com/embed/TUDpzDSEZ2E",
    featured: false, views: 1420,
    seasons: [
      { number:1, episodes: ep(20,"23 min") },
      { number:2, episodes: ep(22,"23 min") },
      { number:3, episodes: ep(18,"23 min") }
    ]
  },
  {
    id: 2, title: "Gravity Falls", type: "series", year: 2012, genres: ["Animation","Mystery","Comedy","Family"],
    rating: 8.9, description: "Twin siblings Dipper and Mabel Pines spend the summer at their great-uncle's tourist trap in the mysterious Gravity Falls, Oregon.",
    cover: "/images/covers/gravity-falls.jpg", trailer: "https://www.youtube.com/embed/2-UE94bYEqY",
    featured: true, views: 3800,
    seasons: [
      { number:1, episodes: ep(20,"22 min") },
      { number:2, episodes: ep(20,"22 min") }
    ]
  },
  {
    id: 3, title: "The Neighbourhood", type: "series", year: 2018, genres: ["Comedy","Drama"],
    rating: 6.8, description: "A friendly family from the Midwest moves to a not-so-friendly neighbourhood in Los Angeles where cultures and personalities clash.",
    cover: "/images/covers/the-neighbourhood.jpg", trailer: "https://www.youtube.com/embed/placeholder",
    featured: false, views: 970,
    seasons: [
      { number:1, episodes: ep(22,"22 min") },
      { number:2, episodes: ep(22,"22 min") }
    ]
  },
  {
    id: 4, title: "Grey's Anatomy", type: "series", year: 2005, genres: ["Drama","Romance","Medical"],
    rating: 7.6, description: "A drama centered on the personal and professional lives of five surgical interns and their supervisors at a Seattle hospital.",
    cover: "/images/covers/greys-anatomy.jpg", trailer: "https://www.youtube.com/embed/4Yak-NSlR2c",
    featured: true, views: 5100,
    seasons: Array.from({length:20},(_,s)=>({ number:s+1, episodes:ep(24,"43 min") }))
  },
  {
    id: 5, title: "Helluva Boss", type: "series", year: 2020, genres: ["Animation","Comedy","Horror","Adult"],
    rating: 8.4, description: "An imp named Blitzo starts a business specializing in assassinations for souls damned to Hell, assisted by his chaotic staff.",
    cover: "/images/covers/helluva-boss.jpeg", trailer: "https://www.youtube.com/embed/el_PChGfJN8",
    featured: true, views: 4200,
    seasons: [
      { number:1, episodes: ep(8,"25 min") },
      { number:2, episodes: ep(8,"25 min") }
    ]
  },
  {
    id: 6, title: "Hazbin Hotel", type: "series", year: 2024, genres: ["Animation","Comedy","Musical","Adult"],
    rating: 8.0, description: "Charlie, princess of Hell, opens a hotel to rehabilitate demons believing they can be redeemed and sent to Heaven.",
    cover: "/images/covers/hazbin-hotel.jpeg", trailer: "https://www.youtube.com/embed/UuZlBFnEfnI",
    featured: true, views: 4600,
    seasons: [{ number:1, episodes: ep(8,"30 min") }]
  },
  {
    id: 7, title: "The Amazing Digital Circus", type: "series", year: 2023, genres: ["Animation","Comedy","Horror","Fantasy"],
    rating: 8.6, description: "Humans find themselves trapped inside a mysterious digital circus, struggling to maintain their sanity as they try to escape.",
    cover: "/images/covers/amazing-digital-circus.jpeg", trailer: "https://www.youtube.com/embed/RNElbWREOaI",
    featured: true, views: 5300,
    seasons: [{ number:1, episodes: ep(4,"20 min") }]
  },
  {
    id: 8, title: "Murder Drones", type: "series", year: 2023, genres: ["Animation","Sci-Fi","Horror","Action"],
    rating: 8.3, description: "Murder Drones are sent to exterminate the last Worker Drones on a cold, abandoned planet in this action-packed animated series.",
    cover: "/images/covers/murder-drones.jpeg", trailer: "https://www.youtube.com/embed/qHqhFB9Dgko",
    featured: false, views: 3100,
    seasons: [{ number:1, episodes: ep(8,"22 min") }]
  },
  {
    id: 9, title: "Avatar: The Last Airbender", type: "series", year: 2005, genres: ["Animation","Adventure","Fantasy","Action"],
    rating: 9.3, description: "In a world where people can manipulate the four elements, a young Avatar must master them all to bring peace to the nations.",
    cover: "/images/covers/avatar-tla.jpg", trailer: "https://www.youtube.com/embed/d1EnW4575Os",
    featured: true, views: 7800,
    seasons: [
      { number:1, episodes: ep(20,"23 min") },
      { number:2, episodes: ep(20,"23 min") },
      { number:3, episodes: ep(21,"23 min") }
    ]
  },
  {
    id: 10, title: "Ghosts", type: "series", year: 2021, genres: ["Comedy","Fantasy"],
    rating: 7.8, description: "A couple inherits a rundown mansion and discovers it's haunted by ghosts from different historical eras who only they can see.",
    cover: "/images/covers/ghosts.jpeg", trailer: "https://www.youtube.com/embed/gRnfBWqMWcE",
    featured: false, views: 1600,
    seasons: [
      { number:1, episodes: ep(18,"22 min") },
      { number:2, episodes: ep(22,"22 min") }
    ]
  },
  {
    id: 11, title: "The Rookie", type: "series", year: 2018, genres: ["Drama","Crime","Action"],
    rating: 8.0, description: "Middle-aged man John Nolan becomes the oldest rookie at the LAPD and must prove himself to skeptical colleagues.",
    cover: "/images/covers/the-rookie.jpeg", trailer: "https://www.youtube.com/embed/placeholder",
    featured: false, views: 2300,
    seasons: [
      { number:1, episodes: ep(20,"43 min") },
      { number:2, episodes: ep(20,"43 min") },
      { number:3, episodes: ep(14,"43 min") }
    ]
  },
  {
    id: 12, title: "Arcane", type: "series", year: 2021, genres: ["Animation","Action","Fantasy","Drama"],
    rating: 9.0, description: "Set in Piltover and the oppressed underground of Zaun, following the origins of two iconic League of Legends champions — Vi and Jinx.",
    cover: "/images/covers/arcane.jpg", trailer: "https://www.youtube.com/embed/4Ps6nV4wiCE",
    featured: true, views: 8200,
    seasons: [
      { number:1, episodes: ep(9,"40 min") },
      { number:2, episodes: ep(9,"40 min") }
    ]
  },
  {
    id: 13, title: "The Last of Us", type: "series", year: 2023, genres: ["Drama","Horror","Action","Sci-Fi"],
    rating: 8.8, description: "Joel, a hardened survivor, is tasked with smuggling Ellie, a teenage girl immune to a deadly fungal infection, across a post-apocalyptic United States.",
    cover: "/images/covers/the-last-of-us.jpg", trailer: "https://www.youtube.com/embed/uLtkt8BonwM",
    featured: true, views: 9100,
    seasons: [
      { number:1, episodes: ep(9,"55 min") },
      { number:2, episodes: ep(7,"55 min") }
    ]
  },
  {
    id: 14, title: "The Walking Dead", type: "series", year: 2010, genres: ["Drama","Horror","Action"],
    rating: 8.1, description: "Sheriff's deputy Rick Grimes wakes from a coma to find a world overrun by zombies and leads a group of survivors.",
    cover: "/images/covers/the-walking-dead.jpeg", trailer: "https://www.youtube.com/embed/jAnDAdBYJL4",
    featured: false, views: 4300,
    seasons: Array.from({length:11},(_,s)=>({ number:s+1, episodes:ep(16,"44 min") }))
  },
  {
    id: 15, title: "Alice in Borderland", type: "series", year: 2020, genres: ["Action","Sci-Fi","Thriller","Drama"],
    rating: 7.7, description: "A gamer and his friends find themselves in a dystopian Tokyo where they must compete in deadly games to survive.",
    cover: "/images/covers/alice-in-borderland.jpg", trailer: "https://www.youtube.com/embed/9fEpS_JEzvE",
    featured: true, views: 6400,
    seasons: [
      { number:1, episodes: ep(8,"50 min") },
      { number:2, episodes: ep(8,"50 min") }
    ]
  },
  // Additional series
  {
    id: 16, title: "Breaking Bad", type: "series", year: 2008, genres: ["Drama","Crime","Thriller"],
    rating: 9.5, description: "A chemistry teacher diagnosed with cancer partners with a former student to cook methamphetamine to secure his family's financial future.",
    cover: "/images/covers/breaking-bad.jpeg", trailer: "https://www.youtube.com/embed/HhesaQXLuRY",
    featured: true, views: 12000,
    seasons: Array.from({length:5},(_,s)=>({ number:s+1, episodes:ep(13,"47 min") }))
  },
  {
    id: 17, title: "Stranger Things", type: "series", year: 2016, genres: ["Sci-Fi","Horror","Drama","Mystery"],
    rating: 8.7, description: "When a boy disappears, his friends, family and local police uncover a series of extraordinary mysteries involving secret experiments and supernatural forces.",
    cover: "/images/covers/stranger-things.jpg", trailer: "https://www.youtube.com/embed/b9EkMc79ZSU",
    featured: true, views: 11000,
    seasons: [
      { number:1, episodes: ep(8,"51 min") },
      { number:2, episodes: ep(9,"55 min") },
      { number:3, episodes: ep(8,"52 min") },
      { number:4, episodes: ep(9,"77 min") }
    ]
  },
  {
    id: 18, title: "Wednesday", type: "series", year: 2022, genres: ["Comedy","Horror","Mystery","Fantasy"],
    rating: 8.1, description: "Wednesday Addams is sent to Nevermore Academy where she tries to master her psychic powers while uncovering a monstrous killing spree.",
    cover: "/images/covers/wednesday.jpeg", trailer: "https://www.youtube.com/embed/Di310WS8zLk",
    featured: false, views: 8500,
    seasons: [{ number:1, episodes: ep(8,"48 min") }]
  },
  {
    id: 19, title: "One Piece", type: "series", year: 1999, genres: ["Animation","Adventure","Action","Comedy"],
    rating: 8.9, description: "Monkey D. Luffy and his crew sail the seas in search of the legendary treasure One Piece to become the King of the Pirates.",
    cover: "/images/covers/one-piece.jpg", trailer: "https://www.youtube.com/embed/placeholder",
    featured: false, views: 7200,
    seasons: Array.from({length:21},(_,s)=>({ number:s+1, episodes:ep(24,"24 min") }))
  },
  {
    id: 20, title: "Demon Slayer", type: "series", year: 2019, genres: ["Animation","Action","Fantasy","Drama"],
    rating: 8.7, description: "Tanjiro Kamado becomes a demon slayer after his family is slaughtered and his sister is turned into a demon.",
    cover: "/images/covers/demon-slayer.jpg", trailer: "https://www.youtube.com/embed/VQGCKyvzIM4",
    featured: true, views: 9300,
    seasons: [
      { number:1, episodes: ep(26,"24 min") },
      { number:2, episodes: ep(18,"24 min") },
      { number:3, episodes: ep(11,"24 min") }
    ]
  },
  {
    id: 21, title: "Jujutsu Kaisen", type: "series", year: 2020, genres: ["Animation","Action","Horror","Fantasy"],
    rating: 8.6, description: "A high school student swallows a cursed talisman and joins a secret organization of Jujutsu Sorcerers to kill a powerful Curse.",
    cover: "/images/covers/jujutsu-kaisen.jpg", trailer: "https://www.youtube.com/embed/4A_X-Dvl0ws",
    featured: false, views: 8800,
    seasons: [
      { number:1, episodes: ep(24,"24 min") },
      { number:2, episodes: ep(23,"24 min") }
    ]
  },
  {
    id: 22, title: "The Bear", type: "series", year: 2022, genres: ["Drama","Comedy"],
    rating: 8.7, description: "A young chef from the fine dining world returns to Chicago to run his family's sandwich shop after a tragedy.",
    cover: "/images/covers/the-bear.jpg", trailer: "https://www.youtube.com/embed/QywHyWBoHHY",
    featured: false, views: 5600,
    seasons: [
      { number:1, episodes: ep(8,"30 min") },
      { number:2, episodes: ep(10,"35 min") }
    ]
  },
  {
    id: 23, title: "Succession", type: "series", year: 2018, genres: ["Drama","Comedy"],
    rating: 8.9, description: "The Roy family controls one of the biggest media and entertainment conglomerates in the world. Their future is in question as the aging patriarch considers his succession.",
    cover: "/images/covers/succession.jpg", trailer: "https://www.youtube.com/embed/OrmHXXhJpYc",
    featured: false, views: 6100,
    seasons: Array.from({length:4},(_,s)=>({ number:s+1, episodes:ep(10,"60 min") }))
  },

  /* ------------------------ MOVIES ------------------------ */

  {
    id: 101, title: "The Goat", type: "movie", year: 2023, genres: ["Comedy","Drama"],
    rating: 6.5, description: "A lighthearted comedy about unexpected encounters and life's little surprises.",
    cover: "/images/covers/the-goat.jpg", trailer: "https://www.youtube.com/embed/placeholder",
    featured: false, views: 890, duration: "1h 45m"
  },
  {
    id: 102, title: "Inside Out", type: "movie", year: 2015, genres: ["Animation","Adventure","Comedy","Family"],
    rating: 8.2, description: "After young Riley is uprooted from her Midwest life and moved to San Francisco, her emotions — Joy, Fear, Anger, Disgust and Sadness — conflict on how best to navigate a new city.",
    cover: "/images/covers/inside-out.jpg", trailer: "https://www.youtube.com/embed/yRUAzGQ3nSY",
    featured: true, views: 6700, duration: "1h 35m"
  },
  {
    id: 103, title: "Inside Out 2", type: "movie", year: 2024, genres: ["Animation","Adventure","Comedy","Family"],
    rating: 7.8, description: "Riley enters adolescence and a new emotion — Anxiety — joins her existing emotions, causing upheaval inside her mind.",
    cover: "/images/covers/inside-out-2.jpg", trailer: "https://www.youtube.com/embed/LEjhY15eCx0",
    featured: true, views: 7200, duration: "1h 40m"
  },
  {
    id: 104, title: "Hoppers", type: "movie", year: 2024, genres: ["Adventure","Comedy"],
    rating: 7.0, description: "An adventure film about leaping through unexpected places and finding yourself.",
    cover: "/images/covers/hoppers.jpeg", trailer: "https://www.youtube.com/embed/placeholder",
    featured: false, views: 1100, duration: "1h 52m"
  },
  {
    id: 105, title: "Hacksaw Ridge", type: "movie", year: 2016, genres: ["Drama","History","War"],
    rating: 8.2, description: "The true story of Desmond Doss, who served in WWII and became the first conscientious objector to be awarded the Medal of Honor.",
    cover: "/images/covers/hacksaw-ridge.jpeg", trailer: "https://www.youtube.com/embed/s2-1hz1juBI",
    featured: true, views: 4100, duration: "2h 19m"
  },
  {
    id: 106, title: "The Black Phone", type: "movie", year: 2021, genres: ["Horror","Thriller","Drama"],
    rating: 7.4, description: "A boy abducted by a sadistic killer discovers a disconnected phone in the basement that lets him communicate with previous victims.",
    cover: "/images/covers/the-black-phone.jpg", trailer: "https://www.youtube.com/embed/4OOK_ynMeJk",
    featured: false, views: 2800, duration: "1h 43m"
  },
  {
    id: 107, title: "Avatar", type: "movie", year: 2009, genres: ["Action","Adventure","Sci-Fi","Fantasy"],
    rating: 7.9, description: "A paraplegic marine on the moon Pandora becomes torn between following orders and protecting the world he feels is his home.",
    cover: "/images/covers/avatar-1.jpg", trailer: "https://www.youtube.com/embed/5PSNL1qE6VY",
    featured: true, views: 8900, duration: "2h 42m"
  },
  {
    id: 108, title: "Avatar: The Way of Water", type: "movie", year: 2022, genres: ["Action","Adventure","Sci-Fi","Fantasy"],
    rating: 7.6, description: "Jake Sully and Ney'tiri have formed a family and must leave their home and explore the ocean regions of Pandora.",
    cover: "/images/covers/avatar-2.jpeg", trailer: "https://www.youtube.com/embed/d9MyW72ELq0",
    featured: false, views: 5600, duration: "3h 12m"
  },
  {
    id: 109, title: "Avatar 3", type: "movie", year: 2025, genres: ["Action","Adventure","Sci-Fi","Fantasy"],
    rating: 7.8, description: "The next chapter in the epic Avatar saga continues on the world of Pandora.",
    cover: "/images/covers/avatar-3.jpeg", trailer: "https://www.youtube.com/embed/placeholder",
    featured: true, views: 6900, duration: "2h 58m"
  },
  {
    id: 110, title: "Blue Beetle", type: "movie", year: 2023, genres: ["Action","Adventure","Sci-Fi"],
    rating: 6.8, description: "Jaime Reyes suddenly finds himself in possession of an alien relic that bestows him with an incredible suit of armor.",
    cover: "/images/covers/blue-beetle.jpeg", trailer: "https://www.youtube.com/embed/vS58qM_4bDU",
    featured: false, views: 2100, duration: "2h 7m"
  },
  {
    id: 111, title: "Zootopia", type: "movie", year: 2016, genres: ["Animation","Adventure","Comedy","Family"],
    rating: 8.0, description: "In a city of anthropomorphic animals, a rookie bunny cop and a cynical con artist fox must work together to uncover a conspiracy.",
    cover: "/images/covers/zootopia.jpeg", trailer: "https://www.youtube.com/embed/jWM0ct-OLsM",
    featured: true, views: 5400, duration: "1h 48m"
  },
  {
    id: 112, title: "Spider-Man: Across the Spider-Verse", type: "movie", year: 2023, genres: ["Animation","Action","Adventure","Sci-Fi"],
    rating: 8.7, description: "Miles Morales catapults across the Multiverse, encountering a team of Spider-People charged with protecting its very existence.",
    cover: "/images/covers/spiderman-across.jpg", trailer: "https://www.youtube.com/embed/cqGjhVJWtEg",
    featured: true, views: 9500, duration: "2h 20m"
  },
  {
    id: 113, title: "Spider-Man: Into the Spider-Verse", type: "movie", year: 2018, genres: ["Animation","Action","Adventure","Sci-Fi"],
    rating: 8.4, description: "Teen Miles Morales becomes Spider-Man and crosses paths with counterparts from other dimensions to stop a threat to the Multiverse.",
    cover: "/images/covers/spiderman-into.jpg", trailer: "https://www.youtube.com/embed/tg52up16eq0",
    featured: true, views: 8700, duration: "1h 57m"
  },
  // Additional movies
  {
    id: 114, title: "Interstellar", type: "movie", year: 2014, genres: ["Sci-Fi","Drama","Adventure"],
    rating: 8.7, description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    cover: "/images/covers/interstellar.jpg", trailer: "https://www.youtube.com/embed/zSWdZVtXT7E",
    featured: true, views: 9200, duration: "2h 49m"
  },
  {
    id: 115, title: "Inception", type: "movie", year: 2010, genres: ["Sci-Fi","Action","Thriller"],
    rating: 8.8, description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into someone's mind.",
    cover: "/images/covers/inception.jpg", trailer: "https://www.youtube.com/embed/YoHD9XEInc0",
    featured: false, views: 8600, duration: "2h 28m"
  },
  {
    id: 116, title: "The Dark Knight", type: "movie", year: 2008, genres: ["Action","Crime","Drama"],
    rating: 9.0, description: "Batman faces a criminal mastermind known as the Joker who unleashes chaos on the people of Gotham City.",
    cover: "/images/covers/the-dark-knight.jpg", trailer: "https://www.youtube.com/embed/EXeTwQWrcwY",
    featured: true, views: 10500, duration: "2h 32m"
  },
  {
    id: 117, title: "Dune", type: "movie", year: 2021, genres: ["Sci-Fi","Adventure","Drama"],
    rating: 8.0, description: "Paul Atreides leads nomadic tribes in a revolt against the galactic emperor on the desert planet Arrakis.",
    cover: "/images/covers/dune.jpeg", trailer: "https://www.youtube.com/embed/n9xhJrPXop4",
    featured: false, views: 7400, duration: "2h 35m"
  },
  {
    id: 118, title: "Dune: Part Two", type: "movie", year: 2024, genres: ["Sci-Fi","Adventure","Drama"],
    rating: 8.5, description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    cover: "/images/covers/dune-part-2.jpeg", trailer: "https://www.youtube.com/embed/Way9Dexny3w",
    featured: true, views: 8100, duration: "2h 46m"
  },
  {
    id: 119, title: "Oppenheimer", type: "movie", year: 2023, genres: ["Drama","History","Thriller"],
    rating: 8.3, description: "The story of J. Robert Oppenheimer and the development of the atomic bomb during World War II.",
    cover: "/images/covers/oppenheimer.jpg", trailer: "https://www.youtube.com/embed/uYPbbksJxIY",
    featured: false, views: 7800, duration: "3h"
  },
  {
    id: 120, title: "Barbie", type: "movie", year: 2023, genres: ["Comedy","Fantasy","Adventure"],
    rating: 6.9, description: "Barbie and Ken are having the time of their lives in Barbieland. When they go to the real world, they discover the joys and perils of living among humans.",
    cover: "/images/covers/barbie.jpg", trailer: "https://www.youtube.com/embed/pBk4NYhWNMM",
    featured: false, views: 6500, duration: "1h 54m"
  },
];

/* ══════════════════════════════════════
   HELPER FUNCTIONS
══════════════════════════════════════ */

/** Generate episodes array for a season */
function ep(count, duration) {
  return Array.from({length:count}, (_,i) => ({
    ep: i+1,
    title: `Episode ${i+1}`,
    duration,
    videoSrc: "" // placeholder — add real video paths here
  }));
}

function getAllGenres() {
  const g = new Set();
  HOPFLIX_DATA.forEach(i => i.genres.forEach(x => g.add(x)));
  return [...g].sort();
}
function getMovies()   { return HOPFLIX_DATA.filter(i => i.type === "movie"); }
function getSeries()   { return HOPFLIX_DATA.filter(i => i.type === "series"); }
function getFeatured() { return HOPFLIX_DATA.filter(i => i.featured); }
function getTrending(n=10) { return [...HOPFLIX_DATA].sort((a,b)=>b.views-a.views).slice(0,n); }
function getByGenre(genre) { return HOPFLIX_DATA.filter(i => i.genres.includes(genre)); }
function searchContent(q) {
  const lq = q.toLowerCase().trim();
  if (!lq) return [];
  return HOPFLIX_DATA.filter(i => i.title.toLowerCase().includes(lq));
}
function getById(id) { return HOPFLIX_DATA.find(i => i.id === parseInt(id)); }
function getSimilar(id, limit=6) {
  const item = getById(id);
  if (!item) return [];
  return HOPFLIX_DATA.filter(i => i.id !== item.id && i.genres.some(g => item.genres.includes(g)))
    .sort((a,b)=>b.views-a.views).slice(0,limit);
}
function getRandomFeatured(n=6) {
  const f = getFeatured();
  return f.sort(() => Math.random()-0.5).slice(0, n);
}
