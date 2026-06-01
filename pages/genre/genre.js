var _genreMovies = [];
var _genreSeries = [];
var _genreMovOff = 0;
var _genreSerOff = 0;
var _genreMovPage = 0;
var _genreSerPage = 0;
var ITEMS_PER_PAGE = 24;

document.addEventListener('DOMContentLoaded', async function() {
  await checkSession();
  buildNavbar('');
  buildFooter();
  var params = new URLSearchParams(window.location.search);
  var genre  = params.get('genre') || 'All';
  document.title = 'HopFlix — ' + genre;
  document.getElementById('genre-title').textContent = genre;
  document.getElementById('genre-sub').textContent   = 'All movies and TV shows in the ' + genre + ' genre';
  var items = await getByGenre(genre);
  buildGenreContent(genre, items);
  buildGenreTrending(items);
  buildAllGenresList(genre);
});

function getVisibleCountG() { return window.innerWidth <= 600 ? 3 : 6; }

function buildGenreContent(genre, items) {
  var main   = document.getElementById('genre-main');
  _genreMovies = items.filter(function(i) { return i.type === 'movie'; });
  _genreSeries = items.filter(function(i) { return i.type === 'series'; });
  var vis = getVisibleCountG();

  if (!items.length) {
    main.innerHTML = '<div style="text-align:center;padding:80px 0;color:var(--text-muted);">' +
      '<i class="fa-solid fa-film" style="font-size:48px;margin-bottom:12px;display:block;opacity:0.3;"></i>' +
      '<p>No content found for <strong style="color:white">' + genre + '</strong> yet.</p></div>';
    return;
  }

  var html = '';

  if (_genreMovies.length) {
    var showR = _genreMovies.length > vis;
    html +=
      '<div class="genre-section" id="gm-section">' +
        '<div class="genre-section-header">' +
          '<h2 class="section-title"><i class="fa-solid fa-film"></i> Movies</h2>' +
          '<button class="view-more-link" onclick="expandGenreType(\'movie\',1)">View All Movies <i class="fa-solid fa-arrow-right"></i></button>' +
        '</div>' +
        '<div id="gm-scroll-wrap">' +
          '<div class="scroll-row-wrap">' +
            '<button class="scroll-arrow left"  id="gm-arr-left"  onclick="scrollGenreType(\'movie\',-1)" style="display:none"><i class="fa-solid fa-chevron-left"></i></button>' +
            '<div class="scroll-row" id="gm-row">' + _genreMovies.slice(0,vis).map(buildCard).join('') + '</div>' +
            '<button class="scroll-arrow right" id="gm-arr-right" onclick="scrollGenreType(\'movie\',1)"  style="display:' + (showR?'flex':'none') + '"><i class="fa-solid fa-chevron-right"></i></button>' +
          '</div>' +
        '</div>' +
        '<div id="gm-expand-wrap" style="display:none;">' +
          '<div class="cards-grid" id="gm-expand-grid"></div>' +
          '<div class="pagination" id="gm-expand-pages"></div>' +
          '<button class="view-more-link" style="margin-top:12px;" onclick="collapseGenreType(\'movie\')"><i class="fa-solid fa-arrow-left"></i> Show Less</button>' +
        '</div>' +
      '</div>';
  }

  if (_genreSeries.length) {
    var showRS = _genreSeries.length > vis;
    html +=
      '<div class="genre-section" id="gs-section">' +
        '<div class="genre-section-header">' +
          '<h2 class="section-title"><i class="fa-solid fa-tv"></i> TV Series</h2>' +
          '<button class="view-more-link" onclick="expandGenreType(\'series\',1)">View All Series <i class="fa-solid fa-arrow-right"></i></button>' +
        '</div>' +
        '<div id="gs-scroll-wrap">' +
          '<div class="scroll-row-wrap">' +
            '<button class="scroll-arrow left"  id="gs-arr-left"  onclick="scrollGenreType(\'series\',-1)" style="display:none"><i class="fa-solid fa-chevron-left"></i></button>' +
            '<div class="scroll-row" id="gs-row">' + _genreSeries.slice(0,vis).map(buildCard).join('') + '</div>' +
            '<button class="scroll-arrow right" id="gs-arr-right" onclick="scrollGenreType(\'series\',1)"  style="display:' + (showRS?'flex':'none') + '"><i class="fa-solid fa-chevron-right"></i></button>' +
          '</div>' +
        '</div>' +
        '<div id="gs-expand-wrap" style="display:none;">' +
          '<div class="cards-grid" id="gs-expand-grid"></div>' +
          '<div class="pagination" id="gs-expand-pages"></div>' +
          '<button class="view-more-link" style="margin-top:12px;" onclick="collapseGenreType(\'series\')"><i class="fa-solid fa-arrow-left"></i> Show Less</button>' +
        '</div>' +
      '</div>';
  }

  main.innerHTML = html;
}

function expandGenreType(type, page) {
  var items  = type === 'movie' ? _genreMovies : _genreSeries;
  var prefix = type === 'movie' ? 'gm' : 'gs';
  var total  = Math.ceil(items.length / ITEMS_PER_PAGE);
  page = Math.max(1, Math.min(page, total));
  if (type === 'movie') _genreMovPage = page; else _genreSerPage = page;

  document.getElementById(prefix + '-scroll-wrap').style.display = 'none';
  document.getElementById(prefix + '-expand-wrap').style.display = 'block';

  var slice = items.slice((page-1)*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE);
  document.getElementById(prefix + '-expand-grid').innerHTML = slice.map(buildCard).join('');

  var pag = document.getElementById(prefix + '-expand-pages');
  if (total <= 1) { pag.innerHTML = ''; }
  else {
    var html = '';
    if (page > 1) html += '<button class="page-btn" onclick="expandGenreType(\'' + type + '\',' + (page-1) + ')"><i class="fa-solid fa-chevron-left"></i></button>';
    for (var p = 1; p <= total; p++) html += '<button class="page-btn' + (p===page?' active':'') + '" onclick="expandGenreType(\'' + type + '\',' + p + ')">' + p + '</button>';
    if (page < total) html += '<button class="page-btn" onclick="expandGenreType(\'' + type + '\',' + (page+1) + ')"><i class="fa-solid fa-chevron-right"></i></button>';
    pag.innerHTML = html;
  }
  document.getElementById(prefix + '-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function collapseGenreType(type) {
  var prefix = type === 'movie' ? 'gm' : 'gs';
  if (type === 'movie') _genreMovPage = 0; else _genreSerPage = 0;
  document.getElementById(prefix + '-scroll-wrap').style.display = 'block';
  document.getElementById(prefix + '-expand-wrap').style.display = 'none';
  document.getElementById(prefix + '-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scrollGenreType(type, dir) {
  var items  = type === 'movie' ? _genreMovies : _genreSeries;
  var vis    = getVisibleCountG();
  var off    = type === 'movie' ? _genreMovOff : _genreSerOff;
  var maxOff = Math.max(0, items.length - vis);
  var newOff = Math.min(maxOff, Math.max(0, off + dir*vis));
  if (type === 'movie') _genreMovOff = newOff; else _genreSerOff = newOff;

  var prefix = type === 'movie' ? 'gm' : 'gs';
  var row    = document.getElementById(prefix + '-row');
  if (row) {
    var startX = dir > 0 ? 100 : -100;
    row.style.transition = 'none';
    row.style.transform  = 'translateX(' + startX + '%)';
    row.style.opacity    = '0';
    row.innerHTML = items.slice(newOff, newOff + vis).map(buildCard).join('');
    requestAnimationFrame(function() {
      row.style.transition = 'transform 0.35s ease, opacity 0.35s ease';
      row.style.transform  = 'translateX(0)';
      row.style.opacity    = '1';
    });
  }
  document.getElementById(prefix + '-arr-left').style.display  = newOff > 0      ? 'flex' : 'none';
  document.getElementById(prefix + '-arr-right').style.display = newOff < maxOff ? 'flex' : 'none';
}

function buildGenreTrending(items) {
  var list = document.getElementById('genre-trending');
  var top  = items.slice().sort(function(a,b){return b.views-a.views;}).slice(0,5);
  list.innerHTML = top.map(function(item,i){
    return '<a href="/HopFlix/pages/watch/watch.html?id=' + item.id + '" class="trending-item">' +
      '<span class="trending-rank">' + (i+1) + '</span>' +
      '<img src="' + item.cover + '" alt="' + item.title + '" onerror="this.style.background=\'var(--dark)\'">' +
      '<div class="trending-info"><strong>' + item.title + '</strong>' +
      '<small>' + (item.type==='movie'?'Movie':'Series') + ' · &#11088; ' + item.rating + '</small></div></a>';
  }).join('');
}

async function buildAllGenresList(current) {
  var wrap   = document.getElementById('all-genres');
  var genres = await getAllGenres();
  wrap.innerHTML = genres.map(function(g) {
    return '<a href="/HopFlix/pages/genre/genre.html?genre=' + encodeURIComponent(g) + '" class="genre-pill ' + (g===current?'active':'') + '">' + g + '</a>';
  }).join('');
}
