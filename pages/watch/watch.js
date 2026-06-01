var currentItem = null, currentSeason = 1, currentEp = 1, subsOn = false, ctrlTimer = null;

document.addEventListener('DOMContentLoaded', async function() {
  await checkSession();
  buildNavbar('');
  buildFooter();
  var id = new URLSearchParams(window.location.search).get('id');
  if (!id) { showErr('No content ID in URL.'); return; }
  currentItem = await getById(parseInt(id));
  if (!currentItem || currentItem.error) { showErr('Content not found.'); return; }
  document.title = 'HopFlix — ' + currentItem.title;
  incrementView(currentItem.id);
  initPlayer();
  loadInfo();
  loadSimilar();
  if (currentItem.type === 'series') { loadSeasonSel(); loadEps(1, 1); }
  wirePlayerEvents();
  showCtrl(); resetCtrlTimer();
  if (isLoggedIn()) addToHistory(currentItem.id, 0);
});

function initPlayer() {
  var v = document.getElementById('main-player');
  v.removeAttribute('poster');
  var item = currentItem;
  if (item.type === 'movie') {
    var slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    v.src = '/HopFlix/media/movies/' + slug + '/' + slug + '.mp4';
  }

}

function wirePlayerEvents() {
  var v   = document.getElementById('main-player');
  var btn = document.getElementById('play-btn');
  v.addEventListener('timeupdate', function() {
    var p = v.duration ? (v.currentTime / v.duration) * 100 : 0;
    document.getElementById('prog-fill').style.width = p + '%';
    document.getElementById('t-current').textContent = fmt(v.currentTime);
    if (Math.floor(v.currentTime) % 10 === 0 && isLoggedIn()) addToHistory(currentItem.id, Math.round(p));
  });
  v.addEventListener('progress', function() {
    if (v.duration && v.buffered.length > 0) {
      document.getElementById('prog-buf').style.width = (v.buffered.end(v.buffered.length - 1) / v.duration * 100) + '%';
    }
  });
  v.addEventListener('loadedmetadata', function() { document.getElementById('t-total').textContent = fmt(v.duration); });
  v.addEventListener('play',  function() { btn.innerHTML = '<i class="fa-solid fa-pause"></i>'; flashPlay(false); });
  v.addEventListener('pause', function() { btn.innerHTML = '<i class="fa-solid fa-play"></i>';  flashPlay(true); });
  document.getElementById('prog-wrap').addEventListener('click', function(e) {
    if (!v.duration) return;
    var r = this.getBoundingClientRect();
    v.currentTime = ((e.clientX - r.left) / r.width) * v.duration;
  });
  document.addEventListener('keydown', function(e) {
    if (['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)) return;
    if (e.key === ' ' || e.key === 'k') { e.preventDefault(); togglePlay(); }
    else if (e.key === 'ArrowRight') skipFwd();
    else if (e.key === 'ArrowLeft')  skipBack();
    else if (e.key === 'ArrowUp')    { e.preventDefault(); setVol(Math.min(1, v.volume + 0.1)); document.getElementById('vol-slider').value = v.volume; }
    else if (e.key === 'ArrowDown')  { e.preventDefault(); setVol(Math.max(0, v.volume - 0.1)); document.getElementById('vol-slider').value = v.volume; }
    else if (e.key === 'f') toggleFS();
    else if (e.key === 'm') toggleMute();
  });
  document.getElementById('player-wrap').addEventListener('mousemove', function() { showCtrl(); resetCtrlTimer(); });
}

function flashPlay(show) {
  var el = document.getElementById('play-flash');
  el.classList.toggle('show', show);
  if (show) setTimeout(function() { el.classList.remove('show'); }, 600);
}
function showCtrl() { document.getElementById('player-controls').classList.add('show'); }
function resetCtrlTimer() {
  clearTimeout(ctrlTimer);
  ctrlTimer = setTimeout(function() {
    var v = document.getElementById('main-player');
    if (!v.paused) document.getElementById('player-controls').classList.remove('show');
  }, 3000);
}
function togglePlay()  { var v = document.getElementById('main-player'); v.paused ? v.play().catch(function(){}) : v.pause(); }
function skipFwd()     { var v = document.getElementById('main-player'); v.currentTime = Math.min(v.duration || 0, v.currentTime + 10); }
function skipBack()    { var v = document.getElementById('main-player'); v.currentTime = Math.max(0, v.currentTime - 10); }
function setVol(val) {
  var v = document.getElementById('main-player'); v.volume = parseFloat(val);
  var b = document.getElementById('vol-btn');
  b.innerHTML = v.volume === 0 ? '<i class="fa-solid fa-volume-xmark"></i>' : v.volume < 0.5 ? '<i class="fa-solid fa-volume-low"></i>' : '<i class="fa-solid fa-volume-high"></i>';
}
function toggleMute() {
  var v = document.getElementById('main-player'); v.muted = !v.muted;
  document.getElementById('vol-btn').innerHTML = v.muted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
  document.getElementById('vol-slider').value = v.muted ? 0 : v.volume;
}
function toggleSubs() {
  var v = document.getElementById('main-player'); subsOn = !subsOn;
  if (v.textTracks.length > 0) v.textTracks[0].mode = subsOn ? 'showing' : 'hidden';
  var b = document.getElementById('sub-btn');
  b.style.color = subsOn ? 'var(--purple-light)' : '';
  b.style.background = subsOn ? 'rgba(109,40,217,0.3)' : '';
}
function setSpeed(val) { document.getElementById('main-player').playbackRate = parseFloat(val); }
function toggleFS() {
  var w = document.getElementById('player-wrap');
  if (!document.fullscreenElement) w.requestFullscreen().catch(function(){});
  else document.exitFullscreen();
}

function loadSeasonSel() {
  document.getElementById('eps-section').style.display = 'block';
  var sel = document.getElementById('season-sel');
  sel.innerHTML = currentItem.seasons.map(function(s) {
    return '<option value="' + s.number + '">Season ' + s.number + '</option>';
  }).join('');
}
function loadSeason(n) { currentSeason = parseInt(n); loadEps(currentSeason, 1); }
function loadEps(sn, activeEp) {
  var season = currentItem.seasons.find(function(s) { return s.number === sn; });
  if (!season) return;
  document.getElementById('eps-list').innerHTML = season.episodes.map(function(ep) {
    return '<div class="ep-item ' + (ep.ep === activeEp ? 'active' : '') + '" onclick="playEp(' + sn + ',' + ep.ep + ')">' +
      '<span class="ep-num">E' + ep.ep + '</span>' +
      '<div class="ep-info"><strong>' + ep.title + '</strong>' +
      '<small>Season ' + sn + ' · Episode ' + ep.ep + ' · ' + ep.duration + '</small></div>' +
      '<button class="ep-play"><i class="fa-solid fa-play" style="margin-left:1px;font-size:10px;"></i></button>' +
    '</div>';
  }).join('');
}
function playEp(sn, ep) {
  currentSeason = sn; currentEp = ep; loadEps(sn, ep);
  var v    = document.getElementById('main-player');
  var slug = currentItem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  v.src = '/HopFlix/media/tv-shows/' + slug + '/season' + sn + '/ep' + ep + '.mp4';
  v.play().catch(function(){});
  document.getElementById('player-wrap').scrollIntoView({ behavior: 'smooth' });
}

function loadInfo() {
  var item = currentItem;
  document.getElementById('info-poster').src = item.cover;
  document.getElementById('info-poster').alt = item.title;
  document.getElementById('info-title').textContent = item.title;
  var sc = item.seasons ? item.seasons.length : 0;
  var te = item.seasons ? item.seasons.reduce(function(t, s) { return t + s.episodes.length; }, 0) : 0;
  document.getElementById('info-meta').innerHTML =
    '<span class="info-badge">' + (item.type === 'movie' ? 'Movie' : 'Series') + '</span>' +
    '<span>' + item.year + '</span>' +
    '<span class="rating-big">&#11088; ' + item.rating + '/10</span>' +
    (item.type === 'movie'
      ? '<span class="info-badge"><i class="fa-solid fa-clock"></i> ' + (item.duration || '') + '</span>'
      : '<span class="info-badge">' + sc + ' Season' + (sc > 1 ? 's' : '') + '</span><span class="info-badge">' + te + ' Episodes</span>');
  document.getElementById('info-desc').textContent = item.description;
  document.getElementById('info-tags').innerHTML = item.genres.map(function(g) {
    return '<a href="/HopFlix/pages/genre/genre.html?genre=' + encodeURIComponent(g) + '" class="info-tag">' + g + '</a>';
  }).join('');
  updateFavBtn();
}
function updateFavBtn() {
  var btn = document.getElementById('fav-btn');
  if (!btn || !currentItem) return;
  var fav = isFavourite(currentItem.id);
  btn.innerHTML = fav ? '<i class="fa-solid fa-heart"></i> In Favourites' : '<i class="fa-regular fa-heart"></i> Add to Favourites';
  btn.classList.toggle('active', fav);
}
async function handleFav() {
  if (!isLoggedIn()) { openAuthModal('login'); return; }
  await toggleFavourite(currentItem.id);
  updateFavBtn();
}

async function loadSimilar() {
  var grid    = document.getElementById('similar-grid');
  var similar = await getSimilar(currentItem.id, 6);
  if (!similar || !similar.length) { grid.parentElement.style.display = 'none'; return; }
  grid.innerHTML = similar.map(buildCard).join('');
}

function playTrailer() {
  if (!currentItem || !currentItem.trailer || currentItem.trailer.includes('placeholder')) return;
  
  var url = currentItem.trailer;
  var embedUrl = url
    .replace(/https?:\/\/(www\.)?youtube\.com\/watch\?v=([^&]+).*/, 'https://www.youtube.com/embed/$2')
    .replace(/https?:\/\/youtu\.be\/([^?]+).*/, 'https://www.youtube.com/embed/$1');
  document.getElementById('trailer-iframe').src = embedUrl + (embedUrl.includes('?') ? '&autoplay=1' : '?autoplay=1');
  document.getElementById('trailer-modal').classList.add('open');
}
function closeTrailer() {
  document.getElementById('trailer-iframe').src = '';
  document.getElementById('trailer-modal').classList.remove('open');
}

function fmt(s) {
  if (!s || isNaN(s)) return '0:00';
  var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
  return h > 0 ? h + ':' + String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0') : m + ':' + String(sec).padStart(2, '0');
}
function showErr(msg) {
  document.querySelector('.player-section').innerHTML =
    '<div style="text-align:center;padding:80px 24px;color:var(--text-muted);margin-top:var(--nav-height);">' +
    '<i class="fa-solid fa-circle-exclamation" style="font-size:48px;margin-bottom:14px;display:block;"></i>' +
    '<h2 style="color:var(--white);margin-bottom:8px;">Oops!</h2><p>' + msg + '</p>' +
    '<a href="/HopFlix/pages/home/home.html" style="display:inline-block;margin-top:16px;background:var(--purple);color:white;padding:10px 22px;border-radius:7px;text-decoration:none;font-weight:700;">Back to Home</a>' +
    '</div>';
}
