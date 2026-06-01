document.addEventListener('DOMContentLoaded', async function() {
  await checkSession();
  if (!isLoggedIn()) { openAuthModal('login'); return; }
  if (!isAdmin()) {
    document.body.innerHTML = '<div style="text-align:center;padding:100px 24px;color:var(--text-muted);">' +
      '<i class="fa-solid fa-ban" style="font-size:56px;color:var(--red);margin-bottom:16px;display:block;"></i>' +
      '<h2 style="color:var(--white);margin-bottom:8px;">Access Denied</h2>' +
      '<p>You need an admin account to view this page.</p>' +
      '<a href="/HopFlix/pages/home/home.html" style="display:inline-block;margin-top:20px;background:var(--purple);color:white;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:700;">Go Home</a>' +
    '</div>'; return;
  }
  buildNavbar('');
  buildFooter();
  populateManageTable();
  populateUsersTable();
});

function showSection(name, btn) {
  document.querySelectorAll('.admin-section').forEach(function(s) { s.style.display = 'none'; });
  document.querySelectorAll('.admin-nav-btn').forEach(function(b) { b.classList.remove('active'); });
  document.getElementById('sec-' + name).style.display = 'block';
  if (btn) btn.classList.add('active');
  if (name === 'manage') populateManageTable();
  if (name === 'users')   populateUsersTable();
}

function toggleSeriesFields() {
  var isSeries = document.getElementById('a-type').value === 'series';
  document.getElementById('a-seasons-wrap').style.display = isSeries ? 'block' : 'none';
  document.getElementById('a-eps-wrap').style.display = isSeries ? 'block' : 'none';
  document.getElementById('a-duration-wrap').style.display = isSeries ? 'none' : 'block';
}

async function addContent() {
  var title    = document.getElementById('a-title').value.trim();
  var type     = document.getElementById('a-type').value;
  var year     = parseInt(document.getElementById('a-year').value);
  var rating   = parseFloat(document.getElementById('a-rating').value);
  var desc     = document.getElementById('a-desc').value.trim();
  var genres   = document.getElementById('a-genres').value.split(',').map(function(g) { return g.trim(); }).filter(Boolean);
  var cover    = document.getElementById('a-cover').value.trim() || '/HopFlix/images/covers/placeholder.jpg';
  var trailer  = document.getElementById('a-trailer').value.trim() || '';
  var featured = document.getElementById('a-featured').checked;
  var views    = 100;
  var duration = document.getElementById('a-duration').value.trim();

  if (!title)               { showAddMsg('Title is required.', 'error'); return; }
  if (!year || year < 1900) { showAddMsg('Enter a valid year.', 'error'); return; }
  if (isNaN(rating) || rating < 0 || rating > 10) { showAddMsg('Rating 0-10.', 'error'); return; }
  if (!desc)                { showAddMsg('Description required.', 'error'); return; }
  if (!genres.length)       { showAddMsg('At least one genre.', 'error'); return; }

  var body = { title: title, type: type, year: year, rating: rating, description: desc,
    cover: cover, trailer: trailer, featured: featured, views: views, genres: genres };

  if (type === 'series') {
    var ns = parseInt(document.getElementById('a-seasons').value) || 1;
    var ne = parseInt(document.getElementById('a-eps').value) || 12;
    var ed = '42 min';
    body.seasons = [];
    for (var s = 1; s <= ns; s++) {
      var eps = [];
      for (var e = 1; e <= ne; e++) eps.push({ ep: e, title: 'Episode ' + e, duration: ed });
      body.seasons.push({ number: s, episodes: eps });
    }
  } else { body.duration = duration || '1h 30m'; }

  var res  = await fetch('/HopFlix/api/content.php?action=add', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin', body: JSON.stringify(body)
  });
  var data = await res.json();
  if (data.error) { showAddMsg(data.error, 'error'); return; }
  showAddMsg('"' + title + '" added! ID: ' + data.id, 'success');
  clearAddForm();
  populateManageTable();
}

function clearAddForm() {
  ['a-title','a-year','a-rating','a-desc','a-genres','a-cover','a-trailer','a-duration','a-seasons','a-eps'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.value = '';
  });
  document.getElementById('a-featured').checked = false;
  document.getElementById('a-type').value = 'movie';
  toggleSeriesFields();
}

function showAddMsg(text, type) {
  var el = document.getElementById('add-msg');
  el.textContent = text; el.className = 'admin-msg ' + type; el.style.display = 'block';
  setTimeout(function() { el.style.display = 'none'; }, 4000);
}

async function populateManageTable(items) {
  if (!items) items = await fetch('/HopFlix/api/content.php?action=all', { credentials: 'same-origin' }).then(function(r) { return r.json(); });
  document.getElementById('manage-tbody').innerHTML = items.map(function(item) {
    return '<tr>' +
      '<td><img src="' + item.cover + '" style="width:36px;height:52px;object-fit:cover;border-radius:4px;" onerror="this.style.display=\'none\'"></td>' +
      '<td><strong style="color:var(--white);">' + item.title + '</strong><br><small style="color:var(--text-muted);">#' + item.id + '</small></td>' +
      '<td><span class="tbl-type-badge ' + item.type + '">' + (item.type === 'movie' ? 'Movie' : 'Series') + '</span></td>' +
      '<td style="color:var(--text);">' + item.year + '</td>' +
      '<td><span style="color:var(--gold);">&#11088; ' + item.rating + '</span></td>' +
      '<td style="color:var(--text);">' + item.views.toLocaleString() + '</td>' +
      '<td><button class="tbl-del-btn" onclick="deleteContent(' + item.id + ')"><i class="fa-solid fa-trash"></i> Remove</button></td>' +
    '</tr>';
  }).join('');
}

async function filterManage(q) {
  var items = await fetch('/HopFlix/api/content.php?action=all', { credentials: 'same-origin' }).then(function(r) { return r.json(); });
  var typeF = document.getElementById('manage-type-filter') ? document.getElementById('manage-type-filter').value : '';
  populateManageTable(items.filter(function(i) {
    var matchTitle = !q || i.title.toLowerCase().includes(q.toLowerCase());
    var matchType  = !typeF || i.type === typeF;
    return matchTitle && matchType;
  }));
}

async function deleteContent(id) {
  if (!confirm('Remove this content?')) return;
  await fetch('/HopFlix/api/content.php?action=delete', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin', body: JSON.stringify({ id: id })
  });
  populateManageTable();
}

async function populateUsersTable() {
  var res   = await fetch('/HopFlix/api/user.php?action=list', { credentials: 'same-origin' });
  var users = await res.json();
  if (!Array.isArray(users)) {
    document.getElementById('users-tbody').innerHTML = '<tr><td colspan="6" style="color:var(--text-muted);">Error loading users.</td></tr>';
    return;
  }
  document.getElementById('users-tbody').innerHTML = users.map(function(u) {
    return '<tr>' +
      '<td style="color:var(--text-muted);">' + u.id + '</td>' +
      '<td><strong style="color:var(--white);">' + u.username + '</strong></td>' +
      '<td style="color:var(--text);">' + u.email + '</td>' +
      '<td><span class="tbl-type-badge ' + (u.role === 'admin' ? 'series' : 'movie') + '">' + u.role + '</span></td>' +
      '<td style="color:var(--text);">' + u.joinDate + '</td>' +
      '<td>' + (u.role !== 'admin' ? '<button class="tbl-del-btn" onclick="deleteUser(' + u.id + ',\'' + u.username + '\')"><i class="fa-solid fa-user-minus"></i> Delete</button>' : '<span style="color:var(--text-muted);font-size:11px;">Admin</span>') + '</td>' +
    '</tr>';
  }).join('');
}

async function deleteUser(id, username) {
  if (!confirm('Delete user "' + username + '"? This cannot be undone.')) return;
  var res  = await fetch('/HopFlix/api/user.php?action=delete', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin', body: JSON.stringify({ id: id })
  });
  var data = await res.json();
  if (data.error) { alert('Error: ' + data.error); return; }
  populateUsersTable();
}
