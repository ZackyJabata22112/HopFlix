document.addEventListener('DOMContentLoaded', async function() {
  await checkSession();
  if (!isLoggedIn()) { openAuthModal('login'); return; }
  buildNavbar('');
  buildFooter();
  loadHeader();
  loadContinue();
  loadHistory2();
  loadFavs();
  var hash = window.location.hash.replace('#', '');
  if (['continue','history','favourites'].includes(hash)) switchTab(hash);
  wireAvatarClick();
});

function wireAvatarClick() {
  var avWrap = document.getElementById('profile-av-wrap');
  if (!avWrap) return;
  avWrap.style.cursor = 'pointer';
  avWrap.addEventListener('mouseenter', function() {
    var overlay = document.getElementById('av-change-overlay');
    if (overlay) overlay.style.opacity = '1';
  });
  avWrap.addEventListener('mouseleave', function() {
    var overlay = document.getElementById('av-change-overlay');
    if (overlay) overlay.style.opacity = '0';
  });
  avWrap.addEventListener('click', function() {
    document.getElementById('av-click-input').click();
  });
}

function loadHeader() {
  var user = getCurrentUser();
  if (!user) return;
  var av = document.getElementById('profile-av');
  av.innerHTML = user.avatar ? '<img src="' + user.avatar + '" alt="' + user.username + '">' : user.username[0].toUpperCase();
  document.getElementById('profile-name').textContent  = user.username;
  document.getElementById('profile-email').innerHTML   = '<i class="fa-solid fa-envelope"></i> ' + user.email;
  document.getElementById('profile-joined').innerHTML  = '<i class="fa-solid fa-calendar"></i> Member since ' + (user.joinDate || '');
  document.getElementById('e-user').value  = user.username;
  document.getElementById('e-email').value = user.email;
  if (user.banner) document.getElementById('profile-banner').style.backgroundImage = 'url(' + user.banner + ')';
}

async function handleBannerUpload(input) {
  var file = input.files[0]; if (!file) return;
  var form = new FormData();
  form.append('file', file);
  var res  = await fetch('/HopFlix/api/upload.php?type=banner', {
    method: 'POST', credentials: 'same-origin', body: form
  });
  var data = await res.json();
  if (data.url) {
    document.getElementById('profile-banner').style.backgroundImage = 'url(' + data.url + ')';
    var rb = document.getElementById('banner-remove-btn');
    if (rb) rb.style.display = 'inline-flex';
  }
}

function removeBanner() {
  document.getElementById('profile-banner').style.backgroundImage = '';
  var rb = document.getElementById('banner-remove-btn');
  if (rb) rb.style.display = 'none';
  fetch('/HopFlix/api/auth.php?action=banner', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin', body: JSON.stringify({ banner_url: null })
  });
}

async function handleAvatarFile(input) {
  var file = input.files[0]; if (!file) return;
  var form = new FormData();
  form.append('file', file);
  var res  = await fetch('/HopFlix/api/upload.php?type=avatar', {
    method: 'POST', credentials: 'same-origin', body: form
  });
  var data = await res.json();
  if (data.url) {
    document.getElementById('profile-av').innerHTML = '<img src="' + data.url + '" alt="avatar">';
  }
}

function toggleEdit() {
  var p = document.getElementById('edit-panel');
  p.style.display = p.style.display === 'none' ? 'block' : 'none';
}

function togglePassSection() {
  var s = document.getElementById('pass-change-section');
  s.style.display = s.style.display === 'none' ? 'block' : 'none';
}

async function saveProfile() {
  var uname = document.getElementById('e-user').value.trim();
  var email = document.getElementById('e-email').value.trim();
  if (!uname || !email) { showEditMsg('Username and email are required.', 'error'); return; }
  if (uname.length < 3) { showEditMsg('Username must be at least 3 characters.', 'error'); return; }
  var body = { username: uname, email: email };
  var res  = await fetch('/HopFlix/api/auth.php?action=update', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin', body: JSON.stringify(body)
  });
  var data = await res.json();
  if (data.error) { showEditMsg(data.error, 'error'); return; }
  showEditMsg('Profile saved! ✓', 'success');
  setTimeout(toggleEdit, 1200);
}

async function savePassword() {
  var oldPass = document.getElementById('e-old-pass').value;
  var newPass = document.getElementById('e-new-pass').value;
  var confirm = document.getElementById('e-confirm-pass').value;
  if (!oldPass || !newPass) { showEditMsg('Both current and new password are required.', 'error'); return; }
  if (newPass.length < 8) { showEditMsg('New password must be at least 8 characters.', 'error'); return; }
  if (newPass !== confirm) { showEditMsg('Passwords do not match.', 'error'); return; }
  var body = { username: getCurrentUser().username, email: getCurrentUser().email, old_password: oldPass, new_password: newPass };
  var res  = await fetch('/HopFlix/api/auth.php?action=update', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin', body: JSON.stringify(body)
  });
  var data = await res.json();
  if (data.error) { showEditMsg(data.error, 'error'); return; }
  showEditMsg('Password changed! ✓', 'success');
  document.getElementById('e-old-pass').value = '';
  document.getElementById('e-new-pass').value = '';
  document.getElementById('e-confirm-pass').value = '';
  setTimeout(function() { document.getElementById('pass-change-section').style.display = 'none'; }, 1200);
}

function showEditMsg(txt, type) {
  var el = document.getElementById('edit-msg');
  el.textContent = txt; el.className = 'edit-msg ' + type; el.style.display = 'block';
}
function togglePass(id, btn) {
  var inp = document.getElementById(id); var isP = inp.type === 'password';
  inp.type = isP ? 'text' : 'password';
  btn.innerHTML = isP ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
}

function switchTab(name) {
  document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.toggle('active', b.dataset.tab === name); });
  document.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.toggle('active', p.id === 'tab-' + name); });
  history.replaceState(null, '', '#' + name);
}

async function loadContinue() {
  var grid = document.getElementById('continue-grid');
  var hist = await getHistory();
  hist = hist.filter(function(h) { return h.progress > 0 && h.progress < 100; });
  hist.sort(function(a, b) { return b.watchedAt - a.watchedAt; });
  if (!hist.length) { grid.innerHTML = emptyEl('fa-play', 'Nothing to continue yet.', 'Start watching!', '/HopFlix/pages/home/home.html'); return; }
  var allData = await Promise.all(hist.map(function(h) { return getById(h.id); }));
  grid.innerHTML = hist.map(function(h, idx) {
    var item = allData[idx]; if (!item || item.error) return '';
    return '<a href="/HopFlix/pages/watch/watch.html?id=' + item.id + '" class="content-card">' +
      '<span class="card-type-badge">' + (item.type === 'movie' ? 'Movie' : 'Series') + '</span>' +
      '<img class="card-poster" src="' + item.cover + '" alt="' + item.title + '" loading="lazy" onerror="this.src=\'/HopFlix/images/covers/placeholder.jpg\'">' +
      '<div class="card-info"><div class="card-title">' + item.title + '</div>' +
      '<div class="card-meta"><span>' + item.year + '</span><span class="rating">&#11088; ' + item.rating + '</span></div></div>' +
      '<div class="card-prog-bar"><div class="card-prog-fill" style="width:' + h.progress + '%"></div></div>' +
    '</a>';
  }).join('');
}

async function loadHistory2() {
  var grid = document.getElementById('history-grid');
  var hist = await getHistory();
  hist.sort(function(a, b) { return b.watchedAt - a.watchedAt; });
  if (!hist.length) { grid.innerHTML = emptyEl('fa-clock-rotate-left', 'No watch history yet.', 'Browse something!', '/HopFlix/pages/home/home.html'); return; }
  var allData = await Promise.all(hist.map(function(h) { return getById(h.id); }));
  grid.innerHTML = allData.filter(function(i) { return i && !i.error; }).map(buildCard).join('');
}

async function loadFavs() {
  var grid = document.getElementById('fav-grid');
  var ids  = getFavourites();
  if (!ids.length) { grid.innerHTML = emptyEl('fa-heart', 'No favourites yet.', 'Add something you love!', '/HopFlix/pages/home/home.html'); return; }
  var allData = await Promise.all(ids.map(function(id) { return getById(id); }));
  grid.innerHTML = allData.filter(function(i) { return i && !i.error; }).map(buildCard).join('');
}

function emptyEl(icon, msg, link, href) {
  return '<div style="grid-column:1/-1;" class="empty-state">' +
    '<i class="fa-solid ' + icon + '"></i><p>' + msg + '</p>' +
    (link ? '<a href="' + href + '">' + link + '</a>' : '') + '</div>';
}

window.addEventListener('hashchange', function() {
  var hash = window.location.hash.replace('#', '');
  if (['continue','history','favourites'].includes(hash)) switchTab(hash);
});
