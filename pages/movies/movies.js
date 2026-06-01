var _moviesData    = {};
var _movieOffsets  = {};   
var _movieExpanded = {};  
var ITEMS_PER_PAGE = 24;

document.addEventListener('DOMContentLoaded', async function() {
  await checkSession();
  buildNavbar('movies');
  buildFooter();
  var movies = await getMovies();
  buildMoviesByGenre(movies);
  buildMovieTrending(movies);
});

function getVisibleCount() { return window.innerWidth <= 600 ? 3 : 6; }
function cssId(s) { return s.replace(/[^a-z0-9]/gi, '-').toLowerCase(); }

function buildMoviesByGenre(movies) {
  var main = document.getElementById('movies-main');
  var genreSet = {};
  movies.forEach(function(m) { m.genres.forEach(function(g) { genreSet[g] = true; }); });
  var genres = Object.keys(genreSet).sort();
  var html = '';
  var vis  = getVisibleCount();
  genres.forEach(function(genre) {
    var items = movies.filter(function(m) { return m.genres.includes(genre); });
    if (!items.length) return;
    _moviesData[genre]    = items;
    _movieOffsets[genre]  = 0;
    _movieExpanded[genre] = 0;
    var cid       = cssId(genre);
    var showRight = items.length > vis;
    html +=
      '<div class="genre-section" id="gsec-' + cid + '">' +
        '<div class="genre-section-header">' +
          '<h2 class="section-title">' + genre + '</h2>' +
          '<button class="view-more-link" onclick="expandGenre(\'' + genre + '\',1)">View All <i class="fa-solid fa-arrow-right"></i></button>' +
        '</div>' +
        '<div id="scroll-wrap-' + cid + '">' +
          '<div class="scroll-row-wrap">' +
            '<button class="scroll-arrow left"  id="arr-left-'  + cid + '" onclick="scrollRow(\'' + genre + '\',-1)" style="display:none"><i class="fa-solid fa-chevron-left"></i></button>' +
            '<div class="scroll-row" id="row-' + cid + '">' + items.slice(0, vis).map(buildCard).join('') + '</div>' +
            '<button class="scroll-arrow right" id="arr-right-' + cid + '" onclick="scrollRow(\'' + genre + '\',1)"  style="display:' + (showRight?'flex':'none') + '"><i class="fa-solid fa-chevron-right"></i></button>' +
          '</div>' +
        '</div>' +
        '<div id="expand-wrap-' + cid + '" style="display:none;">' +
          '<div class="cards-grid" id="expand-grid-' + cid + '"></div>' +
          '<div class="pagination" id="expand-pages-' + cid + '"></div>' +
          '<button class="view-more-link" style="margin-top:12px;" onclick="collapseGenre(\'' + genre + '\')"><i class="fa-solid fa-arrow-left"></i> Show Less</button>' +
        '</div>' +
      '</div>';
  });
  main.innerHTML = html;
}

function expandGenre(genre, page) {
  var cid    = cssId(genre);
  var items  = _moviesData[genre] || [];
  var total  = Math.ceil(items.length / ITEMS_PER_PAGE);
  page = Math.max(1, Math.min(page, total));
  _movieExpanded[genre] = page;

  document.getElementById('scroll-wrap-' + cid).style.display  = 'none';
  document.getElementById('expand-wrap-' + cid).style.display  = 'block';

  var slice = items.slice((page-1)*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE);
  document.getElementById('expand-grid-' + cid).innerHTML = slice.map(buildCard).join('');

  var pag = document.getElementById('expand-pages-' + cid);
  if (total <= 1) { pag.innerHTML = ''; }
  else {
    var html = '';
    if (page > 1) html += '<button class="page-btn" onclick="expandGenre(\'' + genre + '\',' + (page-1) + ')"><i class="fa-solid fa-chevron-left"></i></button>';
    for (var p = 1; p <= total; p++) html += '<button class="page-btn' + (p===page?' active':'') + '" onclick="expandGenre(\'' + genre + '\',' + p + ')">' + p + '</button>';
    if (page < total) html += '<button class="page-btn" onclick="expandGenre(\'' + genre + '\',' + (page+1) + ')"><i class="fa-solid fa-chevron-right"></i></button>';
    pag.innerHTML = html;
  }
  document.getElementById('gsec-' + cid).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function collapseGenre(genre) {
  var cid = cssId(genre);
  _movieExpanded[genre] = 0;
  document.getElementById('scroll-wrap-' + cid).style.display = 'block';
  document.getElementById('expand-wrap-' + cid).style.display = 'none';
  document.getElementById('gsec-' + cid).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scrollRow(genre, dir) {
  var items  = _moviesData[genre] || [];
  var vis    = getVisibleCount();
  var maxOff = Math.max(0, items.length - vis);
  var newOff = Math.min(maxOff, Math.max(0, (_movieOffsets[genre]||0) + dir*vis));
  _movieOffsets[genre]  = newOff;
  var cid = cssId(genre);
  var row = document.getElementById('row-' + cid);
  if (row) {
    var startX = dir > 0 ? 100 : -100;
    row.style.transition = 'none';
    row.style.transform  = 'translateX(' + startX + '%)';
    row.style.opacity    = '0';
    var slice = items.slice(newOff, newOff + vis);
    row.innerHTML = slice.map(buildCard).join('');
    requestAnimationFrame(function() {
      row.style.transition = 'transform 0.35s ease, opacity 0.35s ease';
      row.style.transform  = 'translateX(0)';
      row.style.opacity    = '1';
    });
  }
  var btnL = document.getElementById('arr-left-'  + cid);
  var btnR = document.getElementById('arr-right-' + cid);
  if (btnL) btnL.style.display = newOff > 0      ? 'flex' : 'none';
  if (btnR) btnR.style.display = newOff < maxOff ? 'flex' : 'none';
}

function buildMovieTrending(movies) {
  var list = document.getElementById('movie-trending');
  if (!list) return;
  list.innerHTML = movies.slice().sort(function(a,b){return b.views-a.views;}).slice(0,10).map(function(item,i){
    return '<a href="/HopFlix/pages/watch/watch.html?id=' + item.id + '" class="trending-item">' +
      '<span class="trending-rank">' + (i+1) + '</span>' +
      '<img src="' + item.cover + '" alt="' + item.title + '" onerror="this.style.display=\'none\'">' +
      '<div class="trending-info"><strong>' + item.title + '</strong>' +
      '<small>' + item.year + ' · &#11088; ' + item.rating + '</small></div></a>';
  }).join('');
}
