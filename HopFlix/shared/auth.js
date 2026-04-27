const DEMO_USERS = [
  {id:1,username:"admin",   email:"admin@hopflix.com",  password:"admin123",   role:"admin",avatar:null,joinDate:"2024-01-01"},
  {id:2,username:"testuser",email:"test@hopflix.com",   password:"password123",role:"user", avatar:null,joinDate:"2024-06-15"},
];

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem("hopflix_user"))||null; } catch { return null; }
}
function loginUser(u) { localStorage.setItem("hopflix_user",JSON.stringify(u)); }
function logoutUser() {
  localStorage.removeItem("hopflix_user");
  updateNavAuth();
  const dd = document.getElementById("nav-dropdown");
  if (dd) dd.classList.remove("open");
  if (typeof updateMobileAuth === "function") updateMobileAuth();
}
function isLoggedIn() { return !!getCurrentUser(); }
function isAdmin()    { const u=getCurrentUser(); return u&&u.role==="admin"; }

function addToHistory(cid,prog=0) {
  const u=getCurrentUser(); if(!u) return;
  const k=`hopflix_history_${u.id}`;
  const h=JSON.parse(localStorage.getItem(k)||"[]");
  const ex=h.find(x=>x.id===cid);
  if(ex){ex.progress=prog;ex.watchedAt=Date.now();}else h.push({id:cid,progress:prog,watchedAt:Date.now()});
  localStorage.setItem(k,JSON.stringify(h));
}
function getHistory() { const u=getCurrentUser();if(!u)return[];return JSON.parse(localStorage.getItem(`hopflix_history_${u.id}`)||"[]"); }

function toggleFavourite(cid) {
  const u=getCurrentUser(); if(!u){openAuthModal("login");return false;}
  const k=`hopflix_favs_${u.id}`;
  const f=JSON.parse(localStorage.getItem(k)||"[]");
  const i=f.indexOf(cid);
  if(i===-1)f.push(cid);else f.splice(i,1);
  localStorage.setItem(k,JSON.stringify(f));
  return i===-1;
}
function isFavourite(cid) { const u=getCurrentUser();if(!u)return false;return JSON.parse(localStorage.getItem(`hopflix_favs_${u.id}`)||"[]").includes(cid); }
function getFavourites() { const u=getCurrentUser();if(!u)return[];return JSON.parse(localStorage.getItem(`hopflix_favs_${u.id}`)||"[]"); }

function updateNavAuth() {
  const area = document.getElementById("nav-auth");
  if (!area) return;
  const user = getCurrentUser();
  if (user) {
    area.innerHTML = `
      <div class="nav-profile" id="nav-profile-btn">
        <div class="nav-avatar" title="${user.username}">
          ${user.avatar?`<img src="${user.avatar}" alt="${user.username}">`:`<span>${user.username[0].toUpperCase()}</span>`}
        </div>
        <div class="nav-dropdown" id="nav-dropdown">
          <div class="nav-dropdown-header">
            <strong>${user.username}</strong><small>${user.email}</small>
          </div>
          <a href="/pages/profile/profile.html"><i class="fa-solid fa-user"></i> My Profile</a>
          <a href="/pages/profile/profile.html#history"><i class="fa-solid fa-clock-rotate-left"></i> Watch History</a>
          <a href="/pages/profile/profile.html#favourites"><i class="fa-solid fa-heart"></i> Favourites</a>
          <a href="/pages/profile/profile.html#continue"><i class="fa-solid fa-play"></i> Continue Watching</a>
          ${isAdmin()?`<a href="/pages/admin/admin.html"><i class="fa-solid fa-shield-halved"></i> Admin Panel</a>`:""}
          <hr>
          <a href="#" onclick="logoutUser();return false;" class="logout-link"><i class="fa-solid fa-right-from-bracket"></i> Log Out</a>
        </div>
      </div>`;
    document.getElementById("nav-profile-btn").addEventListener("click", e=>{
      e.stopPropagation();
      document.getElementById("nav-dropdown").classList.toggle("open");
    });
    document.addEventListener("click", ()=>{
      const dd=document.getElementById("nav-dropdown"); if(dd) dd.classList.remove("open");
    });
  } else {
    area.innerHTML = `
      <button class="btn-login"  onclick="openAuthModal('login')">Log In</button>
      <button class="btn-signup" onclick="openAuthModal('signup')">Sign Up</button>`;
  }
}

function openAuthModal(mode="login") {
  let modal = document.getElementById("auth-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "auth-modal";
    modal.innerHTML = getAuthModalHTML();
    document.body.appendChild(modal);
    modal.addEventListener("click", e=>{ if(e.target===modal) closeAuthModal(); });
  }
  modal.style.display="flex";
  document.body.style.overflow="hidden";
  switchAuthTab(mode);
}
function closeAuthModal() {
  const m=document.getElementById("auth-modal");
  if(m){m.style.display="none";document.body.style.overflow="";}
}
function switchAuthTab(tab) {
  const lp=document.getElementById("auth-login-panel");
  const sp=document.getElementById("auth-signup-panel");
  const fp=document.getElementById("auth-forgot-panel");
  if(lp) lp.style.display=tab==="login"?"block":"none";
  if(sp) sp.style.display=tab==="signup"?"block":"none";
  if(fp) fp.style.display="none";
  document.querySelectorAll(".auth-tab-btn").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
}
function getAuthModalHTML() {
  return `<div class="auth-modal-overlay">
    <div class="auth-modal-card">
      <button class="auth-modal-close" onclick="closeAuthModal()"><i class="fa-solid fa-xmark"></i></button>
      <div class="auth-modal-logo">
        <img src="/images/logo.png" alt="HopFlix" onerror="this.style.display='none'">
        <span class="auth-brand">Hop<span>Flix</span></span>
      </div>
      <div class="auth-tabs">
        <button class="auth-tab-btn active" data-tab="login"  onclick="switchAuthTab('login')">Log In</button>
        <button class="auth-tab-btn"        data-tab="signup" onclick="switchAuthTab('signup')">Sign Up</button>
      </div>
      <div class="auth-msg" id="auth-modal-msg" style="display:none;"></div>
      <div id="auth-login-panel">
        <div class="auth-field"><label>Email</label>
          <input type="email" id="modal-login-email" placeholder="you@example.com" autocomplete="email"></div>
        <div class="auth-field"><label>Password <a href="#" class="forgot-link" onclick="showForgotInModal();return false;">Forgot?</a></label>
          <div class="pass-wrap">
            <input type="password" id="modal-login-pass" placeholder="Password" autocomplete="current-password" onkeydown="if(event.key==='Enter')doModalLogin()">
            <button class="show-pass" onclick="togglePass('modal-login-pass',this)" type="button"><i class="fa-solid fa-eye"></i></button>
          </div></div>
        <button class="auth-submit-btn" onclick="doModalLogin()" id="modal-login-btn">Log In</button>
        <p class="auth-switch-link">Don't have an account? <a href="#" onclick="switchAuthTab('signup');return false;">Sign Up</a></p>
      </div>
      <div id="auth-signup-panel" style="display:none;">
        <div class="auth-field"><label>Username</label>
          <input type="text" id="modal-su-user" placeholder="coolname123" maxlength="30"></div>
        <div class="auth-field"><label>Email</label>
          <input type="email" id="modal-su-email" placeholder="you@example.com"></div>
        <div class="auth-field"><label>Password</label>
          <div class="pass-wrap">
            <input type="password" id="modal-su-pass" placeholder="At least 8 characters" oninput="checkStrength(this.value)" onkeydown="if(event.key==='Enter')doModalSignup()">
            <button class="show-pass" onclick="togglePass('modal-su-pass',this)" type="button"><i class="fa-solid fa-eye"></i></button>
          </div>
          <div class="strength-bar"><div class="strength-fill" id="modal-strength-fill"></div></div>
          <span class="strength-lbl" id="modal-strength-lbl"></span></div>
        <div class="auth-field"><label>Confirm Password</label>
          <div class="pass-wrap">
            <input type="password" id="modal-su-confirm" placeholder="Repeat password" onkeydown="if(event.key==='Enter')doModalSignup()">
            <button class="show-pass" onclick="togglePass('modal-su-confirm',this)" type="button"><i class="fa-solid fa-eye"></i></button>
          </div></div>
        <label class="terms-check"><input type="checkbox" id="modal-terms"> I agree to the <a href="#">Terms of Use</a></label>
        <button class="auth-submit-btn" onclick="doModalSignup()" id="modal-signup-btn">Create Account</button>
        <p class="auth-switch-link">Have an account? <a href="#" onclick="switchAuthTab('login');return false;">Log In</a></p>
      </div>
      <div id="auth-forgot-panel" style="display:none;">
        <p style="color:var(--text-muted);font-size:13px;margin-bottom:14px;">Enter your email to receive a reset link.</p>
        <div class="auth-field"><label>Email</label>
          <input type="email" id="modal-forgot-email" placeholder="you@example.com"></div>
        <button class="auth-submit-btn" onclick="doForgot()">Send Reset Link</button>
        <p class="auth-switch-link"><a href="#" onclick="switchAuthTab('login');return false;">← Back to Log In</a></p>
      </div>
    </div></div>`;
}
function showForgotInModal() {
  document.getElementById("auth-login-panel").style.display="none";
  document.getElementById("auth-forgot-panel").style.display="block";
}
function showModalMsg(t,type) {
  const el=document.getElementById("auth-modal-msg");
  el.textContent=t; el.className=`auth-msg ${type}`; el.style.display="block";
}
function doModalLogin() {
  const email=document.getElementById("modal-login-email").value.trim();
  const pass =document.getElementById("modal-login-pass").value;
  const btn  =document.getElementById("modal-login-btn");
  if(!email||!pass){showModalMsg("Please fill all fields.","error");return;}
  btn.disabled=true; btn.textContent="Logging in...";
  setTimeout(()=>{
    const reg=JSON.parse(localStorage.getItem("hopflix_users")||"[]");
    const all=[...DEMO_USERS,...reg];
    const user=all.find(u=>u.email.toLowerCase()===email.toLowerCase()&&u.password===pass);
    if(user){
      loginUser({id:user.id,username:user.username,email:user.email,role:user.role,avatar:user.avatar||null,joinDate:user.joinDate});
      showModalMsg("Welcome back, "+user.username+"! ✓","success");
      setTimeout(()=>{closeAuthModal();updateNavAuth();},700);
    } else {
      showModalMsg("Incorrect email or password. Try: test@hopflix.com / password123","error");
      btn.disabled=false; btn.textContent="Log In";
    }
  },500);
}
function doModalSignup() {
  const username=document.getElementById("modal-su-user").value.trim();
  const email   =document.getElementById("modal-su-email").value.trim();
  const pass    =document.getElementById("modal-su-pass").value;
  const confirm =document.getElementById("modal-su-confirm").value;
  const terms   =document.getElementById("modal-terms").checked;
  const btn     =document.getElementById("modal-signup-btn");
  if(!username||!email||!pass||!confirm){showModalMsg("Please fill all fields.","error");return;}
  if(username.length<3){showModalMsg("Username must be at least 3 characters.","error");return;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){showModalMsg("Invalid email.","error");return;}
  if(pass.length<8){showModalMsg("Password must be at least 8 characters.","error");return;}
  if(pass!==confirm){showModalMsg("Passwords do not match.","error");return;}
  if(!terms){showModalMsg("Please agree to the Terms of Use.","error");return;}
  btn.disabled=true; btn.textContent="Creating...";
  setTimeout(()=>{
    const reg=JSON.parse(localStorage.getItem("hopflix_users")||"[]");
    const all=[...DEMO_USERS,...reg];
    if(all.find(u=>u.email.toLowerCase()===email.toLowerCase())){showModalMsg("Email already registered.","error");btn.disabled=false;btn.textContent="Create Account";return;}
    if(all.find(u=>u.username.toLowerCase()===username.toLowerCase())){showModalMsg("Username taken.","error");btn.disabled=false;btn.textContent="Create Account";return;}
    const nu={id:Date.now(),username,email,password:pass,role:"user",avatar:null,joinDate:new Date().toISOString().split("T")[0]};
    reg.push(nu); localStorage.setItem("hopflix_users",JSON.stringify(reg));
    loginUser({id:nu.id,username,email,role:"user",avatar:null,joinDate:nu.joinDate});
    showModalMsg("Account created! Welcome "+username+" 🐸","success");
    setTimeout(()=>{closeAuthModal();updateNavAuth();},700);
  },500);
}
function doForgot() {
  const email=document.getElementById("modal-forgot-email").value.trim();
  if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){showModalMsg("Enter a valid email.","error");return;}
  showModalMsg("Reset link sent to "+email+" (demo — not a real email).","success");
}
function togglePass(inputId,btn) {
  const inp=document.getElementById(inputId); const isP=inp.type==="password";
  inp.type=isP?"text":"password";
  btn.innerHTML=isP?'<i class="fa-solid fa-eye-slash"></i>':'<i class="fa-solid fa-eye"></i>';
}
function checkStrength(pass) {
  const fill=document.getElementById("modal-strength-fill");
  const lbl =document.getElementById("modal-strength-lbl");
  if(!fill) return;
  let s=0;
  if(pass.length>=8)s++; if(/[A-Z]/.test(pass))s++; if(/[0-9]/.test(pass))s++; if(/[^a-zA-Z0-9]/.test(pass))s++;
  const lv=[{w:"0%",c:"transparent",l:""},{w:"25%",c:"#e53e3e",l:"Weak"},{w:"50%",c:"#ed8936",l:"Fair"},{w:"75%",c:"#ecc94b",l:"Good"},{w:"100%",c:"#38a169",l:"Strong"}];
  const v=pass.length===0?lv[0]:lv[s]||lv[0];
  fill.style.width=v.w; fill.style.background=v.c; lbl.textContent=v.l; lbl.style.color=v.c;
}
