var _seriesData    = {};
var _seriesOffsets = {};
var _seriesExpanded= {};
var ITEMS_PER_PAGE = 24;

document.addEventListener('DOMContentLoaded', async function() {
  await checkSession();
  buildNavbar('tvseries');
  buildFooter();
  var series = await getSeries();
  buildSeriesByGenre(series);
  buildSeriesTrending(series);
});

function getVisibleCountS() { return window.innerWidth <= 600 ? 3 : 6; }
function cssIdS(s) { return s.replace(/[^a-z0-9]/gi, '-').toLowerCase(); }

function buildSeriesByGenre(series) {
  var main = document.getElementById('series-main');
  var genreSet = {};
  series.forEach(function(s) { s.genres.forEach(function(g) { genreSet[g] = true; }); });
  var genres = Object.keys(genreSet).sort();
  var html = '';
  var vis  = getVisibleCountS();
  genres.forEach(function(genre) {
    var items = series.filter(function(s) { return s.genres.includes(genre); });
    if (!items.length) return;
    _seriesData[genre]    = items;
    _seriesOffsets[genre] = 0;
    _seriesExpanded[genre]= 0;
    var cid       = cssIdS(genre);
    var showRight = items.length > vis;
    html +=
      '<div class="genre-section" id="sgsec-' + cid + '">' +
        '<div class="genre-section-header">' +
          '<h2 class="section-title">' + genre + '</h2>' +
          '<button class="view-more-link" onclick="expandSeriesGenre(\'' + genre + '\',1)">View All <i class="fa-solid fa-arrow-right"></i></button>' +
        '</div>' +
        '<div id="sscroll-wrap-' + cid + '">' +
          '<div class="scroll-row-wrap">' +
            '<button class="scroll-arrow left"  id="sarr-left-'  + cid + '" onclick="scrollSeriesRow(\'' + genre + '\',-1)" style="display:none"><i class="fa-solid fa-chevron-left"></i></button>' +
            '<div class="scroll-row" id="srow-' + cid + '">' + items.slice(0, vis).map(buildCard).join('') + '</div>' +
            '<button class="scroll-arrow right" id="sarr-right-' + cid + '" onclick="scrollSeriesRow(\'' + genre + '\',1)"  style="display:' + (showRight?'flex':'none') + '"><i class="fa-solid fa-chevron-right"></i></button>' +
          '</div>' +
        '</div>' +
        '<div id="sexpand-wrap-' + cid + '" style="display:none;">' +
          '<div class="cards-grid" id="sexpand-grid-' + cid + '"></div>' +
          '<div class="pagination" id="sexpand-pages-' + cid + '"></div>' +
          '<button class="view-more-link" style="margin-top:12px;" onclick="collapseSeriesGenre(\'' + genre + '\')"><i class="fa-solid fa-arrow-left"></i> Show Less</button>' +
        '</div>' +
      '</div>';
  });
  main.innerHTML = html;
}

function expandSeriesGenre(genre, page) {
  var cid   = cssIdS(genre);
  var items = _seriesData[genre] || [];
  var total = Math.ceil(items.length / ITEMS_PER_PAGE);
  page = Math.max(1, Math.min(page, total));
  _seriesExpanded[genre] = page;
  document.getElementById('sscroll-wrap-' + cid).style.display = 'none';
  document.getElementById('sexpand-wrap-' + cid).style.display = 'block';
  var slice = items.slice((page-1)*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE);
  document.getElementById('sexpand-grid-' + cid).innerHTML = slice.map(buildCard).join('');
  var pag = document.getElementById('sexpand-pages-' + cid);
  if (total <= 1) { pag.innerHTML = ''; }
  else {
    var html = '';
    if (page > 1) html += '<button class="page-btn" onclick="expandSeriesGenre(\'' + genre + '\',' + (page-1) + ')"><i class="fa-solid fa-chevron-left"></i></button>';
    for (var p = 1; p <= total; p++) html += '<button class="page-btn' + (p===page?' active':'') + '" onclick="expandSeriesGenre(\'' + genre + '\',' + p + ')">' + p + '</button>';
    if (page < total) html += '<button class="page-btn" onclick="expandSeriesGenre(\'' + genre + '\',' + (page+1) + ')"><i class="fa-solid fa-chevron-right"></i></button>';
    pag.innerHTML = html;
  }
  document.getElementById('sgsec-' + cid).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function collapseSeriesGenre(genre) {
  var cid = cssIdS(genre);
  _seriesExpanded[genre] = 0;
  document.getElementById('sscroll-wrap-' + cid).style.display = 'block';
  document.getElementById('sexpand-wrap-' + cid).style.display = 'none';
  document.getElementById('sgsec-' + cid).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scrollSeriesRow(genre, dir) {
  var items  = _seriesData[genre] || [];
  var vis    = getVisibleCountS();
  var maxOff = Math.max(0, items.length - vis);
  var newOff = Math.min(maxOff, Math.max(0, (_seriesOffsets[genre]||0) + dir*vis));
  _seriesOffsets[genre] = newOff;
  var cid = cssIdS(genre);
  var row = document.getElementById('srow-' + cid);
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
  var btnL = document.getElementById('sarr-left-'  + cid);
  var btnR = document.getElementById('sarr-right-' + cid);
  if (btnL) btnL.style.display = newOff > 0      ? 'flex' : 'none';
  if (btnR) btnR.style.display = newOff < maxOff ? 'flex' : 'none';
}

function buildSeriesTrending(series) {
  var list = document.getElementById('series-trending');
  if (!list) return;
  list.innerHTML = series.slice().sort(function(a,b){return b.views-a.views;}).slice(0,10).map(function(item,i){
    return '<a href="/HopFlix/pages/watch/watch.html?id=' + item.id + '" class="trending-item">' +
      '<span class="trending-rank">' + (i+1) + '</span>' +
      '<img src="' + item.cover + '" alt="' + item.title + '" onerror="this.style.display=\'none\'">' +
      '<div class="trending-info"><strong>' + item.title + '</strong>' +
      '<small>' + item.year + ' · &#11088; ' + item.rating + '</small></div></a>';
  }).join('');
}
