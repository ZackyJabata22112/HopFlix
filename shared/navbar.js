async function buildNavbar(activePage) {
  var genres = [];
  try { genres = await getAllGenres(); } catch(_) {}
  var genreLinks = genres.map(function(g) {
    return '<a href="/HopFlix/pages/genre/genre.html?genre=' + encodeURIComponent(g) + '">' + g + '</a>';
  }).join('');

  var isIndex = activePage === 'index';

  document.body.insertAdjacentHTML('afterbegin',
    '<nav class="navbar"><div class="navbar-inner">' +
      '<a href="/HopFlix/pages/index/index.html" class="nav-logo nav-logo--large">' +
        '<img src="/HopFlix/images/logo.png" alt="HopFlix logo">' +
        '<span class="nav-logo-text">Hop<span>Flix</span></span>' +
      '</a>' +
      '<ul class="nav-links">' +
        '<li><a href="/HopFlix/pages/home/home.html" class="' + (activePage==='home'?'active':'') + '">Home</a></li>' +
        '<li><a href="/HopFlix/pages/movies/movies.html" class="' + (activePage==='movies'?'active':'') + '">Movies</a></li>' +
        '<li><a href="/HopFlix/pages/tvseries/tvseries.html" class="' + (activePage==='tvseries'?'active':'') + '">TV Series</a></li>' +
        '<li class="nav-dropdown-wrap">' +
          '<button class="dropdown-btn" id="genre-btn">Genres <i class="fa-solid fa-chevron-down" style="font-size:9px;"></i></button>' +
          '<div class="genre-dropdown-menu" id="genre-menu">' + genreLinks + '</div>' +
        '</li>' +
      '</ul>' +
      '<div class="nav-right">' +
        (!isIndex ? '<div class="nav-search" id="nav-search-wrap" style="position:relative;">' +
          '<input type="text" id="nav-search-input" placeholder="Search..." autocomplete="off">' +
          '<button class="search-ico" onclick="doNavSearch()"><i class="fa-solid fa-magnifying-glass"></i></button>' +
          '<div class="nav-search-results" id="nav-search-results" style="display:none;position:absolute;top:calc(100% + 6px);left:0;right:0;"></div>' +
        '</div>' : '') +
        '<div id="nav-auth" class="nav-auth-desktop"></div>' +
      '</div>' +
      '<div class="hamburger" id="hamburger" onclick="toggleMobileMenu()"><span></span><span></span><span></span></div>' +
    '</div></nav>' +
    '<div class="mobile-menu" id="mobile-menu">' +
      '<a href="/HopFlix/pages/home/home.html">Home</a>' +
      '<a href="/HopFlix/pages/movies/movies.html">Movies</a>' +
      '<a href="/HopFlix/pages/tvseries/tvseries.html">TV Series</a>' +
      '<a href="/HopFlix/pages/genre/genre.html">Genres</a>' +
      '<div class="mobile-menu-auth" id="mobile-auth"></div>' +
    '</div>'
  );

  var genreBtn  = document.getElementById('genre-btn');
  var genreMenu = document.getElementById('genre-menu');
  genreBtn.addEventListener('click', function(e) { e.stopPropagation(); genreMenu.classList.toggle('open'); });
  document.addEventListener('click', function() { genreMenu.classList.remove('open'); });

  if (!isIndex) {
    var sinput = document.getElementById('nav-search-input');
    var sres   = document.getElementById('nav-search-results');
    sinput.addEventListener('input', async function() {
      var q = this.value.trim();
      if (q.length < 2) { sres.style.display = 'none'; return; }
      var results = await searchContent(q);
      results = results.slice(0, 6);
      if (!results.length) {
        sres.innerHTML = '<div style="padding:12px 14px;color:var(--text-muted);font-size:13px;">No results</div>';
      } else {
        sres.innerHTML = results.map(function(item) {
          return '<a href="/HopFlix/pages/watch/watch.html?id=' + item.id + '" class="nav-sr-item" onmousedown="event.preventDefault();" onclick="clearNavSearch()">' +
            '<img src="' + item.cover + '" alt="' + item.title + '" onerror="this.style.display=\'none\'">' +
            '<div><strong>' + item.title + '</strong>' +
            '<small>' + item.year + ' · ' + (item.type==='movie'?'Movie':'Series') + ' · ' + (item.genres[0]||'') + '</small></div>' +
          '</a>';
        }).join('');
      }
      sres.style.display = 'block';
    });
    sinput.addEventListener('blur', function() { setTimeout(function() { sres.style.display = 'none'; }, 200); });
    sinput.addEventListener('keydown', function(e) { if (e.key === 'Enter') doNavSearch(); });
  }

  updateNavAuth();

  window.addEventListener('resize', function() {
    if (window.innerWidth > 900) {
      var mm = document.getElementById('mobile-menu');
      if (mm) mm.classList.remove('open');
    }
  });
}

function clearNavSearch() {
  var si = document.getElementById('nav-search-input');
  if (si) si.value = '';
}

function doNavSearch() {
  var q = document.getElementById('nav-search-input').value.trim();
  if (q) { clearNavSearch(); window.location.href = '/HopFlix/pages/home/home.html?search=' + encodeURIComponent(q); }
}

function toggleMobileMenu() {
  var menu = document.getElementById('mobile-menu');
  menu.classList.toggle('open');
  updateMobileAuth();
}

function updateMobileAuth() {
  var mAuth = document.getElementById('mobile-auth');
  if (!mAuth) return;
  var user = getCurrentUser();
  if (user) {
    mAuth.innerHTML =
      '<a href="/HopFlix/pages/profile/profile.html">' + user.username + '</a>' +
      (isAdmin() ? '<a href="/HopFlix/pages/admin/admin.html"><i class="fa-solid fa-shield-halved"></i> Admin Panel</a>' : '') +
      '<a href="#" onclick="logoutUser();document.getElementById(\'mobile-menu\').classList.remove(\'open\');return false;">Log Out</a>';
  } else {
    mAuth.innerHTML =
      '<button class="btn-login" onclick="toggleMobileMenu();openAuthModal(\'login\')">Log In</button>' +
      '<button class="btn-signup" onclick="toggleMobileMenu();openAuthModal(\'signup\')">Sign Up</button>';
  }
}

function buildFooter() {
  var user = getCurrentUser();
  var accountLinks = user
    ? '<li><a href="/HopFlix/pages/profile/profile.html"><i class="fa-solid fa-user" style="margin-right:4px;"></i>My Profile</a></li>' +
      (isAdmin() ? '<li><a href="/HopFlix/pages/admin/admin.html">Admin Panel</a></li>' : '') +
      '<li><a href="#" onclick="logoutUser();return false;">Log Out</a></li>'
    : '<li><a href="#" onclick="openAuthModal(\'login\');return false;">Log In</a></li>' +
      '<li><a href="#" onclick="openAuthModal(\'signup\');return false;">Sign Up</a></li>';

  document.body.insertAdjacentHTML('beforeend',
    '<footer class="footer"><div class="footer-inner">' +
      '<div class="footer-brand">' +
        '<a href="/HopFlix/pages/home/home.html" class="nav-logo nav-logo--large" style="display:inline-flex;margin-bottom:10px;">' +
          '<img src="/HopFlix/images/logo.png" alt="HopFlix">' +
          '<span class="nav-logo-text">Hop<span>Flix</span></span>' +
        '</a>' +
        '<p>Your favourite place to watch movies &amp; TV shows.</p>' +
        '<div class="footer-social">' +
          '<a href="https://x.com/" target="_blank"><i class="fa-brands fa-x-twitter"></i></a>' +
          '<a href="https://www.instagram.com/" target="_blank"><i class="fa-brands fa-instagram"></i></a>' +
          '<a href="https://discord.com/" target="_blank"><i class="fa-brands fa-discord"></i></a>' +
          '<a href="https://www.youtube.com/" target="_blank"><i class="fa-brands fa-youtube"></i></a>' +
        '</div>' +
      '</div>' +
      '<div class="footer-col"><h4>Browse</h4><ul>' +
        '<li><a href="/HopFlix/pages/home/home.html">Home</a></li>' +
        '<li><a href="/HopFlix/pages/movies/movies.html">Movies</a></li>' +
        '<li><a href="/HopFlix/pages/tvseries/tvseries.html">TV Series</a></li>' +
        '<li><a href="/HopFlix/pages/genre/genre.html">Genres</a></li>' +
      '</ul></div>' +
      '<div class="footer-col"><h4>Account</h4><ul>' + accountLinks + '</ul></div>' +
    '</div>' +
    '<div class="footer-bottom"><p>&copy; 2026 HopFlix &middot; All rights reserved.</p></div>' +
    '</footer>'
  );
}

function buildCard(item) {
  var fav   = typeof isFavourite === 'function' ? isFavourite(item.id) : false;
  var stars = buildStars(item.rating);
  var meta  = item.type === 'movie' ? (item.duration || '') : ((item.seasons ? item.seasons.length : 0) + 'S');
  return '<a href="/HopFlix/pages/watch/watch.html?id=' + item.id + '" class="content-card">' +
    '<span class="card-type-badge">' + (item.type === 'movie' ? 'Movie' : 'Series') + '</span>' +
    '<button class="card-fav-btn ' + (fav ? 'active' : '') + '"' +
      ' onclick="event.preventDefault();event.stopPropagation();handleCardFav(this,' + item.id + ');"' +
      ' title="Favourite"><i class="fa-' + (fav ? 'solid' : 'regular') + ' fa-heart"></i></button>' +
    '<img class="card-poster" src="' + item.cover + '" alt="' + item.title + '" loading="lazy"' +
      ' onerror="this.src=\'/HopFlix/images/covers/placeholder.jpg\'">' +
    '<div class="card-overlay">' +
      '<div class="card-play-circle"><i class="fa-solid fa-play" style="margin-left:2px;"></i></div>' +
      '<div class="card-stars">' + stars + '<span style="color:var(--text-muted);font-size:11px;margin-left:3px;">' + item.rating + '</span></div>' +
      '<div class="card-overlay-desc">' + item.description + '</div>' +
    '</div>' +
    '<div class="card-info">' +
      '<div class="card-title">' + item.title + '</div>' +
      '<div class="card-meta">' +
        '<span>' + item.year + '</span>' +
        '<span class="rating" style="color:var(--gold);">&#11088; ' + item.rating + '</span>' +
        '<span class="card-genre-pill">' + (item.genres[0] || '') + '</span>' +
        '<span>' + meta + '</span>' +
      '</div>' +
    '</div>' +
  '</a>';
}

function buildStars(rating) {
  var half5     = rating / 2;
  var fullStars = Math.floor(half5);
  var remainder = half5 - fullStars;
  var hasHalf   = remainder >= 0.25 && remainder < 0.75;
  var roundUp   = remainder >= 0.75;
  var full      = fullStars + (roundUp ? 1 : 0);
  var half      = hasHalf ? 1 : 0;
  var empty     = 5 - full - half;
  var s  = 'style="color:var(--gold);font-size:11px;"';
  var se = 'style="color:var(--gold);font-size:11px;opacity:0.4;"';
  var html = '';
  for (var i = 0; i < Math.max(0, full);  i++) html += '<i class="fa-solid fa-star" '  + s  + '></i>';
  if (half) html += '<i class="fa-solid fa-star-half-stroke" ' + s + '></i>';
  for (var j = 0; j < Math.max(0, empty); j++) html += '<i class="fa-regular fa-star" ' + se + '></i>';
  return html;
}

async function handleCardFav(btn, id) {
  if (typeof toggleFavourite !== 'function') return;
  var added = await toggleFavourite(id);
  btn.innerHTML = added ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';
  btn.classList.toggle('active', added);
}
