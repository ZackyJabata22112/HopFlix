const API_AUTH = '/HopFlix/api/auth.php';
const API_USER = '/HopFlix/api/user.php';

let _currentUser  = null;
let _sessionReady = false;
let _favIds       = [];
let _historyCache = null;

async function apiPost(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(body || {})
  });
  return res.json();
}
async function apiGet(url) {
  const res = await fetch(url, { credentials: 'same-origin' });
  return res.json();
}

async function checkSession() {
  try {
    const data = await apiGet(API_AUTH + '?action=me');
    _currentUser  = data.user || null;
    _sessionReady = true;
    if (_currentUser) await loadFavIds();
  } catch(_) { _currentUser = null; _sessionReady = true; }
}

function getCurrentUser() { return _currentUser; }
function isLoggedIn()     { return !!_currentUser; }
function isAdmin()        { return _currentUser && _currentUser.role === 'admin'; }

async function loadFavIds() {
  try { const d = await apiGet(API_USER + '?action=favourites'); _favIds = d.ids || []; }
  catch(_) { _favIds = []; }
}
function isFavourite(cid) { return _favIds.includes(parseInt(cid)); }
function getFavourites()  { return _favIds.slice(); }

async function toggleFavourite(cid) {
  if (!isLoggedIn()) { openAuthModal('login'); return false; }
  const data = await apiPost(API_USER + '?action=favourite_toggle', { content_id: parseInt(cid) });
  if (data.added) { if (!_favIds.includes(parseInt(cid))) _favIds.push(parseInt(cid)); }
  else { _favIds = _favIds.filter(function(id){ return id !== parseInt(cid); }); }
  return data.added;
}

async function getHistory() {
  if (!isLoggedIn()) return [];
  if (_historyCache !== null) return _historyCache;
  try { const d = await apiGet(API_USER + '?action=history'); _historyCache = Array.isArray(d) ? d : []; }
  catch(_) { _historyCache = []; }
  return _historyCache;
}
async function addToHistory(cid, prog) {
  if (!isLoggedIn()) return;
  await apiPost(API_USER + '?action=history_add', { content_id: parseInt(cid), progress: prog || 0 });
  _historyCache = null;
}

async function loginUser(email, password) {
  const data = await apiPost(API_AUTH + '?action=login', { email: email, password: password });
  if (data.user) { _currentUser = data.user; _historyCache = null; await loadFavIds(); }
  return data;
}
async function logoutUser() {
  await apiPost(API_AUTH + '?action=logout');
  _currentUser = null; _favIds = []; _historyCache = null;
  updateNavAuth();
  var dd = document.getElementById('nav-dropdown');
  if (dd) dd.classList.remove('open');
  if (typeof updateMobileAuth === 'function') updateMobileAuth();
}
async function signupUser(username, email, password) {
  const data = await apiPost(API_AUTH + '?action=signup', { username: username, email: email, password: password });
  if (data.user) { _currentUser = data.user; _favIds = []; _historyCache = null; }
  return data;
}

function updateNavAuth() {
  const area = document.getElementById('nav-auth');
  if (!area) return;
  const user = getCurrentUser();
  if (user) {
    area.innerHTML =
      '<div class="nav-profile" id="nav-profile-btn">' +
        '<div class="nav-avatar" title="' + user.username + '">' +
          (user.avatar ? '<img src="' + user.avatar + '" alt="' + user.username + '">' : '<span>' + user.username[0].toUpperCase() + '</span>') +
        '</div>' +
        '<div class="nav-dropdown" id="nav-dropdown">' +
          '<div class="nav-dropdown-header"><strong>' + user.username + '</strong><small>' + user.email + '</small></div>' +
          '<a href="/HopFlix/pages/profile/profile.html"><i class="fa-solid fa-user"></i> My Profile</a>' +
          '<a href="/HopFlix/pages/profile/profile.html#history"><i class="fa-solid fa-clock-rotate-left"></i> Watch History</a>' +
          '<a href="/HopFlix/pages/profile/profile.html#favourites"><i class="fa-solid fa-heart"></i> Favourites</a>' +
          '<a href="/HopFlix/pages/profile/profile.html#continue"><i class="fa-solid fa-play"></i> Continue Watching</a>' +
          (isAdmin() ? '<a href="/HopFlix/pages/admin/admin.html"><i class="fa-solid fa-shield-halved"></i> Admin Panel</a>' : '') +
          '<hr>' +
          '<a href="#" onclick="logoutUser();return false;" class="logout-link"><i class="fa-solid fa-right-from-bracket"></i> Log Out</a>' +
        '</div>' +
      '</div>';
    document.getElementById('nav-profile-btn').addEventListener('click', function(e) {
      e.stopPropagation();
      document.getElementById('nav-dropdown').classList.toggle('open');
    });
    document.addEventListener('click', function() {
      var dd = document.getElementById('nav-dropdown');
      if (dd) dd.classList.remove('open');
    });
  } else {
    area.innerHTML =
      '<button class="btn-login" onclick="openAuthModal(\'login\')">Log In</button>' +
      '<button class="btn-signup" onclick="openAuthModal(\'signup\')">Sign Up</button>';
  }
}

function openAuthModal(mode) {
  if (!mode) mode = 'login';
  var modal = document.getElementById('auth-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.innerHTML = getAuthModalHTML();
    document.body.appendChild(modal);
    modal.addEventListener('click', function(e) { if (e.target === modal) closeAuthModal(); });
  }
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  switchAuthTab(mode);
}
function closeAuthModal() {
  var m = document.getElementById('auth-modal');
  if (m) { m.style.display = 'none'; document.body.style.overflow = ''; }
}
function switchAuthTab(tab) {
  var lp = document.getElementById('auth-login-panel');
  var sp = document.getElementById('auth-signup-panel');
  var fp = document.getElementById('auth-forgot-panel');
  if (lp) lp.style.display = tab === 'login'  ? 'block' : 'none';
  if (sp) sp.style.display = tab === 'signup' ? 'block' : 'none';
  if (fp) fp.style.display = 'none';
  document.querySelectorAll('.auth-tab-btn').forEach(function(b) { b.classList.toggle('active', b.dataset.tab === tab); });
}
function getAuthModalHTML() {
  return '<div class="auth-modal-overlay"><div class="auth-modal-card">' +
    '<button class="auth-modal-close" onclick="closeAuthModal()"><i class="fa-solid fa-xmark"></i></button>' +
    '<div class="auth-modal-logo"><img src="/HopFlix/images/logo.png" alt="HopFlix" onerror="this.style.display=\'none\'">' +
    '<span class="auth-brand">Hop<span>Flix</span></span></div>' +
    '<div class="auth-tabs">' +
    '<button class="auth-tab-btn active" data-tab="login" onclick="switchAuthTab(\'login\')">Log In</button>' +
    '<button class="auth-tab-btn" data-tab="signup" onclick="switchAuthTab(\'signup\')">Sign Up</button></div>' +
    '<div class="auth-msg" id="auth-modal-msg" style="display:none;"></div>' +
    '<div id="auth-login-panel">' +
    '<div class="auth-field"><label>Email</label><input type="email" id="modal-login-email" placeholder="you@example.com" autocomplete="email"></div>' +
    '<div class="auth-field"><label>Password <a href="#" class="forgot-link" onclick="showForgotInModal();return false;">Forgot?</a></label>' +
    '<div class="pass-wrap"><input type="password" id="modal-login-pass" placeholder="Password" autocomplete="current-password" onkeydown="if(event.key===\'Enter\')doModalLogin()">' +
    '<button class="show-pass" onclick="togglePass(\'modal-login-pass\',this)" type="button"><i class="fa-solid fa-eye"></i></button></div></div>' +
    '<button class="auth-submit-btn" onclick="doModalLogin()" id="modal-login-btn">Log In</button>' +
    '<p class="auth-switch-link">Don\'t have an account? <a href="#" onclick="switchAuthTab(\'signup\');return false;">Sign Up</a></p></div>' +
    '<div id="auth-signup-panel" style="display:none;">' +
    '<div class="auth-field"><label>Username</label><input type="text" id="modal-su-user" placeholder="coolname123" maxlength="30"></div>' +
    '<div class="auth-field"><label>Email</label><input type="email" id="modal-su-email" placeholder="you@example.com"></div>' +
    '<div class="auth-field"><label>Password</label><div class="pass-wrap">' +
    '<input type="password" id="modal-su-pass" placeholder="At least 8 characters" oninput="checkStrength(this.value)" onkeydown="if(event.key===\'Enter\')doModalSignup()">' +
    '<button class="show-pass" onclick="togglePass(\'modal-su-pass\',this)" type="button"><i class="fa-solid fa-eye"></i></button></div>' +
    '<div class="strength-bar"><div class="strength-fill" id="modal-strength-fill"></div></div>' +
    '<span class="strength-lbl" id="modal-strength-lbl"></span></div>' +
    '<div class="auth-field"><label>Confirm Password</label><div class="pass-wrap">' +
    '<input type="password" id="modal-su-confirm" placeholder="Repeat password" onkeydown="if(event.key===\'Enter\')doModalSignup()">' +
    '<button class="show-pass" onclick="togglePass(\'modal-su-confirm\',this)" type="button"><i class="fa-solid fa-eye"></i></button></div></div>' +
    '<label class="terms-check"><input type="checkbox" id="modal-terms"> I agree to the <a href="#">Terms of Use</a></label>' +
    '<button class="auth-submit-btn" onclick="doModalSignup()" id="modal-signup-btn">Create Account</button>' +
    '<p class="auth-switch-link">Have an account? <a href="#" onclick="switchAuthTab(\'login\');return false;">Log In</a></p></div>' +
    '<div id="auth-forgot-panel" style="display:none;">' +
    '<p style="color:var(--text-muted);font-size:13px;margin-bottom:14px;">Enter your email to receive a reset link.</p>' +
    '<div class="auth-field"><label>Email</label><input type="email" id="modal-forgot-email" placeholder="you@example.com"></div>' +
    '<button class="auth-submit-btn" onclick="doForgot()">Send Reset Link</button>' +
    '<p class="auth-switch-link"><a href="#" onclick="switchAuthTab(\'login\');return false;">← Back to Log In</a></p>' +
    '</div></div></div>';
}
function showForgotInModal() {
  document.getElementById('auth-login-panel').style.display = 'none';
  document.getElementById('auth-forgot-panel').style.display = 'block';
}
function showModalMsg(t, type) {
  var el = document.getElementById('auth-modal-msg');
  el.textContent = t; el.className = 'auth-msg ' + type; el.style.display = 'block';
}
async function doModalLogin() {
  var email = document.getElementById('modal-login-email').value.trim();
  var pass  = document.getElementById('modal-login-pass').value;
  var btn   = document.getElementById('modal-login-btn');
  if (!email || !pass) { showModalMsg('Please fill all fields.', 'error'); return; }
  btn.disabled = true; btn.textContent = 'Logging in...';
  var data = await loginUser(email, pass);
  if (data.user) {
    showModalMsg('Welcome back, ' + data.user.username + '! ✓', 'success');
    setTimeout(function() { closeAuthModal(); updateNavAuth(); }, 700);
  } else {
    showModalMsg(data.error || 'Incorrect email or password.', 'error');
    btn.disabled = false; btn.textContent = 'Log In';
  }
}
async function doModalSignup() {
  var username = document.getElementById('modal-su-user').value.trim();
  var email    = document.getElementById('modal-su-email').value.trim();
  var pass     = document.getElementById('modal-su-pass').value;
  var confirm  = document.getElementById('modal-su-confirm').value;
  var terms    = document.getElementById('modal-terms').checked;
  var btn      = document.getElementById('modal-signup-btn');
  
  if (!username || !email || !pass || !confirm) { showModalMsg('Please fill all fields.', 'error'); return; }
  if (username.length < 3) { showModalMsg('Username must be at least 3 characters.', 'error'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showModalMsg('Invalid email.', 'error'); return; }
  if (pass.length < 8) { showModalMsg('Password must be at least 8 characters.', 'error'); return; }
  if (pass !== confirm) { showModalMsg('Passwords do not match.', 'error'); return; }
  if (!terms) { showModalMsg('Please agree to the Terms of Use.', 'error'); return; }
  btn.disabled = true; btn.textContent = 'Creating...';
  var data = await signupUser(username, email, pass);
  if (data.user) {
    showModalMsg('Account created! Welcome ' + data.user.username + ' 🐸', 'success');
    setTimeout(function() { closeAuthModal(); updateNavAuth(); }, 700);
  } else {
    showModalMsg(data.error || 'Could not create account.', 'error');
    btn.disabled = false; btn.textContent = 'Create Account';
  }
}

function doForgot() {
  var email = document.getElementById('modal-forgot-email').value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showModalMsg('Enter a valid email.', 'error'); return; }
  showModalMsg('Reset link sent to ' + email + ' (demo).', 'success');
}

function togglePass(inputId, btn) {
  var inp = document.getElementById(inputId);
  var isP = inp.type === 'password';
  inp.type = isP ? 'text' : 'password';
  btn.innerHTML = isP ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
}

function checkStrength(pass) {
  var fill = document.getElementById('modal-strength-fill');
  var lbl  = document.getElementById('modal-strength-lbl');
  if (!fill) return;
  var s = 0;
  if (pass.length >= 8) s++; if (/[A-Z]/.test(pass)) s++;
  if (/[0-9]/.test(pass)) s++; if (/[^a-zA-Z0-9]/.test(pass)) s++;
  var lv = [{w:'0%',c:'transparent',l:''},{w:'25%',c:'#e53e3e',l:'Weak'},{w:'50%',c:'#ed8936',l:'Fair'},{w:'75%',c:'#ecc94b',l:'Good'},{w:'100%',c:'#38a169',l:'Strong'}];
  var v = pass.length === 0 ? lv[0] : (lv[s] || lv[0]);
  fill.style.width = v.w; fill.style.background = v.c;
  lbl.textContent = v.l; lbl.style.color = v.c;
}
