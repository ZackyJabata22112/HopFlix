function buildNavbar(activePage) {
  const genres = getAllGenres();
  const genreLinks = genres.map(g =>
    `<a href="/pages/genre/genre.html?genre=${encodeURIComponent(g)}">${g}</a>`
  ).join("");

  document.body.insertAdjacentHTML("afterbegin", `
    <nav class="navbar">
      <div class="navbar-inner">
        <a href="/pages/index/index.html" class="nav-logo nav-logo--large">
          <img src="/images/logo.png" alt="HopFlix logo">
          <span class="nav-logo-text">Hop<span>Flix</span></span>
        </a>

        <ul class="nav-links">
          <li><a href="/pages/home/home.html"         class="${activePage==='home'?'active':''}">Home</a></li>
          <li><a href="/pages/movies/movies.html"     class="${activePage==='movies'?'active':''}">Movies</a></li>
          <li><a href="/pages/tvseries/tvseries.html" class="${activePage==='tvseries'?'active':''}">TV Series</a></li>
          <li class="nav-dropdown-wrap">
            <button class="dropdown-btn" id="genre-btn">
              Genres <i class="fa-solid fa-chevron-down" style="font-size:9px;"></i>
            </button>
            <div class="genre-dropdown-menu" id="genre-menu">${genreLinks}</div>
          </li>
        </ul>

        <div class="nav-right">
          <div class="nav-search" id="nav-search-wrap" style="position:relative;">
            <input type="text" id="nav-search-input" placeholder="Search..." autocomplete="off">
            <button class="search-ico" onclick="doNavSearch()"><i class="fa-solid fa-magnifying-glass"></i></button>
            <div class="nav-search-results" id="nav-search-results" style="display:none;position:absolute;top:calc(100% + 6px);left:0;right:0;"></div>
          </div>
          <div id="nav-auth" class="nav-auth-desktop"></div>
        </div>

        <div class="hamburger" id="hamburger" onclick="toggleMobileMenu()">
          <span></span><span></span><span></span>
        </div>
      </div>
    </nav>

    <div class="mobile-menu" id="mobile-menu">
      <a href="/pages/home/home.html">Home</a>
      <a href="/pages/movies/movies.html">Movies</a>
      <a href="/pages/tvseries/tvseries.html">TV Series</a>
      <a href="/pages/genre/genre.html">Genres</a>
      <div class="mobile-menu-auth" id="mobile-auth"></div>
    </div>
  `);

  // Genre dropdown
  const genreBtn  = document.getElementById("genre-btn");
  const genreMenu = document.getElementById("genre-menu");
  genreBtn.addEventListener("click", e => { e.stopPropagation(); genreMenu.classList.toggle("open"); });
  document.addEventListener("click", () => genreMenu.classList.remove("open"));

  // Navbar search live results
  const sinput = document.getElementById("nav-search-input");
  const sres   = document.getElementById("nav-search-results");
  sinput.addEventListener("input", function() {
    const q = this.value.trim();
    if (q.length < 2) { sres.style.display="none"; return; }
    const results = searchContent(q).slice(0,6);
    if (!results.length) {
      sres.innerHTML=`<div style="padding:12px 14px;color:var(--text-muted);font-size:13px;">No results</div>`;
    } else {
      sres.innerHTML = results.map(item=>`
        <a href="/pages/watch/watch.html?id=${item.id}" class="nav-sr-item" onmousedown="event.preventDefault();" onclick="clearNavSearch()">
          <img src="${item.cover}" alt="${item.title}" onerror="this.style.display='none'">
          <div><strong>${item.title}</strong>
          <small>${item.year} · ${item.type==='movie'?'Movie':'Series'} · ${item.genres[0]}</small></div>
        </a>`).join("");
    }
    sres.style.display="block";
  });
  sinput.addEventListener("blur", ()=>setTimeout(()=>{sres.style.display="none";},200));
  sinput.addEventListener("keydown", e=>{ if(e.key==="Enter") doNavSearch(); });

  updateNavAuth();

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      const mm = document.getElementById("mobile-menu");
      if (mm) mm.classList.remove("open");
    }
  });
}

function clearNavSearch() {
  const si = document.getElementById("nav-search-input");
  if (si) si.value = "";
}

function doNavSearch() {
  const q = document.getElementById("nav-search-input").value.trim();
  if (q) {
    clearNavSearch();
    window.location.href = `/pages/home/home.html?search=${encodeURIComponent(q)}`;
  }
}

function toggleMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  menu.classList.toggle("open");
  updateMobileAuth();
}

function updateMobileAuth() {
  const mAuth = document.getElementById("mobile-auth");
  if (!mAuth) return;
  const user = getCurrentUser();
  if (user) {
    mAuth.innerHTML = `
      <a href="/pages/profile/profile.html">${user.username}</a>
      <a href="#" onclick="logoutUser();document.getElementById('mobile-menu').classList.remove('open');return false;">Log Out</a>`;
  } else {
    mAuth.innerHTML = `
      <button class="btn-login"  onclick="toggleMobileMenu();openAuthModal('login')">Log In</button>
      <button class="btn-signup" onclick="toggleMobileMenu();openAuthModal('signup')">Sign Up</button>`;
  }
}

function buildFooter() {
  document.body.insertAdjacentHTML("beforeend", `
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <a href="/pages/home/home.html" class="nav-logo nav-logo--large" style="display:inline-flex;margin-bottom:10px;">
            <img src="/images/logo.png" alt="HopFlix">
            <span class="nav-logo-text">Hop<span>Flix</span></span>
          </a>
          <p>Your favourite place to watch movies &amp; TV shows.</p>
          <div class="footer-social">
            <a href="#"><i class="fa-brands fa-x-twitter"></i></a>
            <a href="#"><i class="fa-brands fa-instagram"></i></a>
            <a href="#"><i class="fa-brands fa-discord"></i></a>
            <a href="#"><i class="fa-brands fa-youtube"></i></a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Browse</h4>
          <ul>
            <li><a href="/pages/home/home.html">Home</a></li>
            <li><a href="/pages/movies/movies.html">Movies</a></li>
            <li><a href="/pages/tvseries/tvseries.html">TV Series</a></li>
            <li><a href="/pages/genre/genre.html">Genres</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Account</h4>
          <ul>
            <li><a href="#" onclick="openAuthModal('login');return false;">Log In</a></li>
            <li><a href="#" onclick="openAuthModal('signup');return false;">Sign Up</a></li>
            <li><a href="/pages/profile/profile.html">My Profile</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 HopFlix &middot; All rights reserved.</p>
      </div>
    </footer>
  `);
}

function buildCard(item) {
  const fav   = typeof isFavourite==="function" ? isFavourite(item.id) : false;
  const stars = buildStars(item.rating);
  const meta  = item.type==="movie" ? item.duration : `${item.seasons.length}S`;
  return `
    <a href="/pages/watch/watch.html?id=${item.id}" class="content-card">
      <span class="card-type-badge">${item.type==="movie"?"Movie":"Series"}</span>
      <button class="card-fav-btn ${fav?'active':''}"
        onclick="event.preventDefault();event.stopPropagation();handleCardFav(this,${item.id});"
        title="Favourite"><i class="fa-${fav?'solid':'regular'} fa-heart"></i></button>
      <img class="card-poster" src="${item.cover}" alt="${item.title}" loading="lazy"
        onerror="this.src='/images/covers/placeholder.jpg'">
      <div class="card-overlay">
        <div class="card-play-circle"><i class="fa-solid fa-play" style="margin-left:2px;"></i></div>
        <div class="card-stars">${stars}<span style="color:var(--text-muted);font-size:11px;margin-left:3px;">${item.rating}</span></div>
        <div class="card-overlay-desc">${item.description}</div>
      </div>
      <div class="card-info">
        <div class="card-title">${item.title}</div>
        <div class="card-meta">
          <span>${item.year}</span>
          <span class="rating" style="color:var(--gold);">&#11088; ${item.rating}</span>
          <span class="card-genre-pill">${item.genres[0]}</span>
          <span>${meta}</span>
        </div>
      </div>
    </a>`;
}

function buildStars(rating) {
  const half5     = rating / 2;
  const fullStars = Math.floor(half5);
  const remainder = half5 - fullStars;
  const hasHalf   = remainder >= 0.25 && remainder < 0.75;
  const roundUp   = remainder >= 0.75;
  const full      = fullStars + (roundUp ? 1 : 0);
  const half      = hasHalf ? 1 : 0;
  const empty     = 5 - full - half;
  const s  = 'style="color:var(--gold);font-size:11px;"';
  const se = 'style="color:var(--gold);font-size:11px;opacity:0.4;"';
  return `<i class="fa-solid fa-star" ${s}></i>`.repeat(Math.max(0,full))
       + (half ? `<i class="fa-solid fa-star-half-stroke" ${s}></i>` : "")
       + `<i class="fa-regular fa-star" ${se}></i>`.repeat(Math.max(0,empty));
}

function handleCardFav(btn, id) {
  if (typeof toggleFavourite!=="function") return;
  const added = toggleFavourite(id);
  btn.innerHTML = added ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';
  btn.classList.toggle("active", added);
}
