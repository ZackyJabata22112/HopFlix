/* profile.js */

document.addEventListener("DOMContentLoaded",()=>{
  if(!isLoggedIn()){ openAuthModal("login"); return; }
  buildNavbar("");
  buildFooter();
  loadHeader();
  loadContinue();
  loadHistory2();
  loadFavs();
  // Check URL hash
  const hash = window.location.hash.replace("#","");
  if(["continue","history","favourites"].includes(hash)) switchTab(hash);
});

function loadHeader() {
  const user = getCurrentUser();
  if(!user) return;
  const av = document.getElementById("profile-av");
  av.innerHTML = user.avatar ? `<img src="${user.avatar}" alt="${user.username}">` : user.username[0].toUpperCase();
  document.getElementById("profile-name").textContent   = user.username;
  document.getElementById("profile-email").innerHTML    = `<i class="fa-solid fa-envelope"></i> ${user.email}`;
  document.getElementById("profile-joined").innerHTML   = `<i class="fa-solid fa-calendar"></i> Member since ${user.joinDate}`;
  document.getElementById("e-user").value  = user.username;
  document.getElementById("e-email").value = user.email;

  // Restore saved banner
  const savedBanner = localStorage.getItem(`hopflix_banner_${user.id}`);
  if(savedBanner) {
    document.getElementById("profile-banner").style.backgroundImage = `url(${savedBanner})`;
    const rb = document.getElementById("banner-remove-btn");
    if(rb) rb.style.display = "inline-flex";
  }
}

function handleBannerUpload(input) {
  const file = input.files[0];
  if(!file) return;
  const user = getCurrentUser();
  if(!user) return;
  const reader = new FileReader();
  reader.onload = e => {
    const url = e.target.result;
    document.getElementById("profile-banner").style.backgroundImage = `url(${url})`;
    // Store banner keyed by username (simulates /images/user-banners/<username>.jpg)
    localStorage.setItem(`hopflix_banner_${user.id}`, url);
    // Show the remove button
    const removeBtn = document.getElementById("banner-remove-btn");
    if(removeBtn) removeBtn.style.display = "inline-flex";
  };
  reader.readAsDataURL(file);
}

function removeBanner() {
  const user = getCurrentUser();
  if(!user) return;
  localStorage.removeItem(`hopflix_banner_${user.id}`);
  document.getElementById("profile-banner").style.backgroundImage = "";
  const removeBtn = document.getElementById("banner-remove-btn");
  if(removeBtn) removeBtn.style.display = "none";
}

function handleAvatarFile(input) {
  const file = input.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const user = getCurrentUser();
    if(!user) return;
    const updated = {...user, avatar: e.target.result};
    loginUser(updated);
    const av = document.getElementById("profile-av");
    av.innerHTML = `<img src="${e.target.result}" alt="${user.username}">`;
  };
  reader.readAsDataURL(file);
}

function toggleEdit() {
  const p = document.getElementById("edit-panel");
  p.style.display = p.style.display==="none" ? "block" : "none";
}

function saveProfile() {
  const user    = getCurrentUser();
  const uname   = document.getElementById("e-user").value.trim();
  const email   = document.getElementById("e-email").value.trim();
  const oldPass = document.getElementById("e-old-pass").value;
  const newPass = document.getElementById("e-new-pass").value;

  if(!uname||!email){ showEditMsg("Username and email are required.","error"); return; }
  if(uname.length<3){ showEditMsg("Username must be at least 3 characters.","error"); return; }

  // Password change
  if(newPass) {
    // Find user in storage to check old password
    const allRegistered = JSON.parse(localStorage.getItem("hopflix_users")||"[]");
    const DEMO = [{email:"admin@hopflix.com",password:"admin123"},{email:"test@hopflix.com",password:"password123"}];
    const all = [...DEMO, ...allRegistered];
    const stored = all.find(u=>u.email===user.email);
    if(!oldPass){ showEditMsg("Please enter your current password to change it.","error"); return; }
    if(!stored || stored.password !== oldPass){ showEditMsg("Current password is incorrect.","error"); return; }
    if(newPass.length<8){ showEditMsg("New password must be at least 8 characters.","error"); return; }
    // Update password in registered users
    const idx = allRegistered.findIndex(u=>u.id===user.id);
    if(idx!==-1){ allRegistered[idx].password = newPass; localStorage.setItem("hopflix_users",JSON.stringify(allRegistered)); }
  }

  const updated = {...user, username:uname, email};
  loginUser(updated);
  const allR = JSON.parse(localStorage.getItem("hopflix_users")||"[]");
  const idx2 = allR.findIndex(u=>u.id===user.id);
  if(idx2!==-1){ allR[idx2]={...allR[idx2],...updated}; localStorage.setItem("hopflix_users",JSON.stringify(allR)); }

  loadHeader();
  showEditMsg("Profile saved! ✓","success");
  setTimeout(toggleEdit,1200);
}

function showEditMsg(txt,type){
  const el=document.getElementById("edit-msg");
  el.textContent=txt; el.className="edit-msg "+type; el.style.display="block";
}

function togglePass(id,btn){
  const inp=document.getElementById(id);
  const isP=inp.type==="password";
  inp.type=isP?"text":"password";
  btn.innerHTML=isP?'<i class="fa-solid fa-eye-slash"></i>':'<i class="fa-solid fa-eye"></i>';
}

/* ── Tab switching ── */
function switchTab(name) {
  document.querySelectorAll(".tab-btn").forEach(b=>b.classList.toggle("active",b.dataset.tab===name));
  document.querySelectorAll(".tab-panel").forEach(p=>p.classList.toggle("active",p.id==="tab-"+name));
  history.replaceState(null,"","#"+name);
}

/* ── Continue Watching ── */
function loadContinue() {
  const grid = document.getElementById("continue-grid");
  const hist = getHistory().filter(h=>h.progress>0&&h.progress<100).sort((a,b)=>b.watchedAt-a.watchedAt);
  if(!hist.length){ grid.innerHTML=emptyEl("fa-play","Nothing to continue yet.","Start watching!","/pages/home/home.html"); return; }
  grid.innerHTML = hist.map(h=>{
    const item=getById(h.id); if(!item) return "";
    return `<a href="/pages/watch/watch.html?id=${item.id}" class="content-card">
      <span class="card-type-badge">${item.type==="movie"?"Movie":"Series"}</span>
      <img class="card-poster" src="${item.cover}" alt="${item.title}" loading="lazy" onerror="this.src='/images/covers/placeholder.jpg'">
      <div class="card-info"><div class="card-title">${item.title}</div>
        <div class="card-meta"><span>${item.year}</span><span class="rating">⭐ ${item.rating}</span></div>
      </div>
      <div class="card-prog-bar"><div class="card-prog-fill" style="width:${h.progress}%"></div></div>
    </a>`;
  }).join("");
}

/* ── Watch History ── */
function loadHistory2() {
  const grid = document.getElementById("history-grid");
  const hist = getHistory().sort((a,b)=>b.watchedAt-a.watchedAt);
  if(!hist.length){ grid.innerHTML=emptyEl("fa-clock-rotate-left","No watch history yet.","Browse something!","/pages/home/home.html"); return; }
  const items = hist.map(h=>getById(h.id)).filter(Boolean);
  grid.innerHTML = items.map(buildCard).join("");
}

/* ── Favourites ── */
function loadFavs() {
  const grid = document.getElementById("fav-grid");
  const ids  = getFavourites();
  if(!ids.length){ grid.innerHTML=emptyEl("fa-heart","No favourites yet.","Add something you love!","/pages/home/home.html"); return; }
  const items = ids.map(id=>getById(id)).filter(Boolean);
  grid.innerHTML = items.map(buildCard).join("");
}

function emptyEl(icon,msg,link,href){
  return `<div style="grid-column:1/-1;" class="empty-state">
    <i class="fa-solid ${icon}"></i><p>${msg}</p>
    ${link?`<a href="${href}">${link}</a>`:""}
  </div>`;
}

// FIX: also switch tab when hash changes (e.g. clicking navbar profile links)
window.addEventListener("hashchange", () => {
  const hash = window.location.hash.replace("#","");
  if (["continue","history","favourites"].includes(hash)) switchTab(hash);
});
