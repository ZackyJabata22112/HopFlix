let currentSlide = 0, autoTimer = null;
let currentFilter = 'all', currentPage = 1;
const ITEMS_PER_PAGE = 24;
let featuredItems = [];
let _allContent = [];

document.addEventListener('DOMContentLoaded', async function() {
  await checkSession();
  buildNavbar('home');
  buildFooter();

  _allContent = await getAllContent();

  var params = new URLSearchParams(window.location.search);
  var q = params.get('search');
  if (q) {
    document.getElementById('carousel-section').style.display = 'none';
    var sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.style.display = 'none';
    showSearch(q);
    var ni = document.getElementById('nav-search-input');
    if (ni) ni.value = '';
  } else {
    buildCarousel();
  }
  buildBrowse();
  buildTrending();
});

function buildCarousel() {
  var all = _allContent.filter(function(i) { return i.featured; });
  featuredItems = all.sort(function() { return Math.random() - 0.5; }).slice(0, 6);
  if (!featuredItems.length) { document.getElementById('carousel-section').style.display = 'none'; return; }
  var el   = document.getElementById('carousel');
  var dots = document.getElementById('carousel-dots');
  el.innerHTML = featuredItems.map(function(item) {
    var coverFile   = item.cover.split('/').pop();
    var bannerSrc   = '/HopFlix/images/carousel-banners/' + coverFile;
    return '<div class="carousel-slide">' +
      '<img class="slide-bg" src="' + bannerSrc + '" alt="' + item.title + '" onerror="this.parentElement.style.background=\'var(--dark2)\';this.style.display=\'none\'">' +
      '<div class="slide-info">' +
        '<span class="slide-badge">' + (item.type === 'movie' ? 'Movie' : 'Series') + '</span>' +
        '<h2 class="slide-title">' + item.title + '</h2>' +
        '<p class="slide-desc">' + item.description + '</p>' +
        '<div class="slide-meta">' +
          '<span>' + item.year + '</span><span>·</span>' +
          '<span class="rating">&#11088; ' + item.rating + '</span><span>·</span>' +
          '<span>' + item.genres.slice(0, 2).join(', ') + '</span>' +
          (item.type === 'series'
            ? '<span>· ' + (item.seasons ? item.seasons.length : 0) + 'S</span>'
            : '<span>· ' + (item.duration || '') + '</span>') +
        '</div>' +
        '<a href="/HopFlix/pages/watch/watch.html?id=' + item.id + '" class="slide-btn"><i class="fa-solid fa-play"></i> Watch Now</a>' +
      '</div>' +
    '</div>';
  }).join('');
  dots.innerHTML = featuredItems.map(function(_, i) {
    return '<button class="carousel-dot ' + (i === 0 ? 'active' : '') + '" onclick="goSlide(' + i + ')"></button>';
  }).join('');
  currentSlide = 0;
  startAuto();
}

function goSlide(i) {
  var n = featuredItems.length; if (!n) return;
  currentSlide = ((i % n) + n) % n;
  document.getElementById('carousel').style.transform = 'translateX(-' + currentSlide * 100 + '%)';
  document.querySelectorAll('.carousel-dot').forEach(function(d, j) { d.classList.toggle('active', j === currentSlide); });
}
function carouselPrev() { goSlide(currentSlide - 1); resetAuto(); }
function carouselNext() { goSlide(currentSlide + 1); resetAuto(); }
function startAuto() { autoTimer = setInterval(function() { goSlide(currentSlide + 1); }, 5500); }
function resetAuto() { clearInterval(autoTimer); startAuto(); }

function setFilter(f, btn) {
  currentFilter = f; currentPage = 1;
  document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.toggle('active', b.dataset.filter === f); });
  buildBrowse();
}

function buildBrowse() {
  var all = currentFilter === 'all'
    ? _allContent.slice().sort(function() { return Math.random() - 0.5; })
    : _allContent.filter(function(i) { return i.type === currentFilter; });
  var total = Math.ceil(all.length / ITEMS_PER_PAGE);
  var page  = all.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  document.getElementById('browse-grid').innerHTML = page.map(buildCard).join('');
  var pag = document.getElementById('browse-pages');
  if (total <= 1) { pag.innerHTML = ''; return; }
  var html = '';
  if (currentPage > 1) html += '<button class="page-btn" onclick="goPage(' + (currentPage - 1) + ')"><i class="fa-solid fa-chevron-left"></i></button>';
  for (var p = 1; p <= total; p++) html += '<button class="page-btn ' + (p === currentPage ? 'active' : '') + '" onclick="goPage(' + p + ')">' + p + '</button>';
  if (currentPage < total) html += '<button class="page-btn" onclick="goPage(' + (currentPage + 1) + ')"><i class="fa-solid fa-chevron-right"></i></button>';
  pag.innerHTML = html;
}
function goPage(p) { currentPage = p; buildBrowse(); document.getElementById('browse-section').scrollIntoView({ behavior: 'smooth' }); }

function showSearch(q) {
  document.getElementById('browse-section').style.display = 'none';
  document.getElementById('search-section').style.display = 'block';
  var results = _allContent.filter(function(i) { return i.title.toLowerCase().includes(q.toLowerCase()); });
  document.getElementById('search-title').innerHTML = 'Results for: <em>' + q + '</em> <span style="color:var(--text-muted);font-size:14px;font-weight:400;">(' + results.length + ' found)</span>';
  document.getElementById('search-grid').innerHTML = results.length
    ? results.map(buildCard).join('')
    : '<div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--text-muted);"><i class="fa-solid fa-magnifying-glass" style="font-size:40px;margin-bottom:12px;display:block;"></i>No results for "<strong style="color:white">' + q + '"</strong></div>';
}

function buildTrending() {
  var sorted = _allContent.slice().sort(function(a, b) { return b.views - a.views; }).slice(0, 10);
  document.getElementById('trending-list').innerHTML = sorted.map(function(item, i) {
    return '<a href="/HopFlix/pages/watch/watch.html?id=' + item.id + '" class="trending-item">' +
      '<span class="trending-rank">' + (i + 1) + '</span>' +
      '<img src="' + item.cover + '" alt="' + item.title + '" onerror="this.src=\'/HopFlix/images/covers/placeholder.jpg\'">' +
      '<div class="trending-info"><strong>' + item.title + '</strong>' +
      '<small>' + (item.type === 'movie' ? 'Movie' : 'Series') + ' &middot; ' + item.views.toLocaleString() + ' views</small></div>' +
    '</a>';
  }).join('');
}
