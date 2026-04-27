const ADMIN_CONTENT_KEY = "hopflix_admin_content";

document.addEventListener("DOMContentLoaded", () => {
  if (!isLoggedIn()) { openAuthModal("login"); return; }
  if (!isAdmin()) {
    document.body.innerHTML = `<div style="text-align:center;padding:100px 24px;color:var(--text-muted);">
      <i class="fa-solid fa-ban" style="font-size:56px;color:var(--red);margin-bottom:16px;display:block;"></i>
      <h2 style="color:var(--white);margin-bottom:8px;">Access Denied</h2>
      <p>You need an admin account to view this page.</p>
      <a href="/pages/home/home.html" style="display:inline-block;margin-top:20px;background:var(--purple);color:white;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:700;">Go Home</a>
    </div>`; return;
  }
  buildNavbar("");
  buildFooter();
  populateManageTable(HOPFLIX_DATA);
  populateUsersTable();
});

function showSection(name) {
  document.querySelectorAll(".admin-section").forEach(s => s.style.display="none");
  document.querySelectorAll(".admin-nav-btn").forEach(b => b.classList.remove("active"));
  document.getElementById(`section-${name}`).style.display="block";
  event.currentTarget.classList.add("active");
  if (name==="manage-content") populateManageTable(getAllContent());
  if (name==="manage-users")   populateUsersTable();
}

function toggleSeasons() {
  document.getElementById("series-options").style.display =
    document.getElementById("add-type").value==="series" ? "block" : "none";
}

function addContent() {
  const title   = document.getElementById("add-title").value.trim();
  const type    = document.getElementById("add-type").value;
  const year    = parseInt(document.getElementById("add-year").value);
  const rating  = parseFloat(document.getElementById("add-rating").value);
  const desc    = document.getElementById("add-desc").value.trim();
  const genres  = document.getElementById("add-genres").value.split(",").map(g=>g.trim()).filter(Boolean);
  const cover   = document.getElementById("add-cover").value.trim() || "/images/covers/placeholder.jpg";
  const trailer = document.getElementById("add-trailer").value.trim() || "";
  const featured= document.getElementById("add-featured").checked;
  const views   = parseInt(document.getElementById("add-views").value)||100;
  const duration= document.getElementById("add-duration").value.trim();

  if (!title) { showAddMsg("Title is required.","error"); return; }
  if (!year||year<1900) { showAddMsg("Enter a valid year.","error"); return; }
  if (isNaN(rating)||rating<0||rating>10) { showAddMsg("Rating 0-10.","error"); return; }
  if (!desc) { showAddMsg("Description required.","error"); return; }
  if (!genres.length) { showAddMsg("At least one genre.","error"); return; }

  const existing = getAllContent();
  const newId = Math.max(...existing.map(i=>i.id), 200) + 1;
  const newItem = {id:newId,title,type,year,genres,rating,description:desc,cover,trailer,featured,views};

  if (type==="series") {
    const ns=parseInt(document.getElementById("add-seasons").value)||1;
    const ne=parseInt(document.getElementById("add-eps").value)||12;
    const ed=document.getElementById("add-ep-dur").value.trim()||"42 min";
    newItem.seasons=Array.from({length:ns},(_,s)=>({number:s+1,episodes:Array.from({length:ne},(_,i)=>({ep:i+1,title:`Episode ${i+1}`,duration:ed}))}));
  } else { newItem.duration=duration||"1h 30m"; }

  const ac=JSON.parse(localStorage.getItem(ADMIN_CONTENT_KEY)||"[]");
  ac.push(newItem); localStorage.setItem(ADMIN_CONTENT_KEY,JSON.stringify(ac));
  HOPFLIX_DATA.push(newItem);
  showAddMsg(`"${title}" added! ID: ${newId}`,"success");
  clearAddForm();
}

function clearAddForm() {
  ["add-title","add-year","add-rating","add-desc","add-genres","add-cover","add-trailer","add-duration","add-seasons","add-eps","add-ep-dur"].forEach(id=>{const el=document.getElementById(id);if(el)el.value="";});
  document.getElementById("add-views").value="100";
  document.getElementById("add-featured").checked=false;
  document.getElementById("add-type").value="movie";
  document.getElementById("series-options").style.display="none";
}

function showAddMsg(text,type) {
  const el=document.getElementById("add-msg"); el.textContent=text; el.className=`admin-msg ${type}`; el.style.display="block";
  setTimeout(()=>{el.style.display="none";},4000);
}

function getAllContent() {
  const ac=JSON.parse(localStorage.getItem(ADMIN_CONTENT_KEY)||"[]");
  return [...HOPFLIX_DATA,...ac.filter(a=>!HOPFLIX_DATA.find(b=>b.id===a.id))];
}

function populateManageTable(items) {
  document.getElementById("manage-tbody").innerHTML=items.map(item=>`
    <tr>
      <td style="color:var(--text-muted);">${item.id}</td>
      <td><strong style="color:var(--white);">${item.title}</strong></td>
      <td><span class="tbl-type-badge ${item.type}">${item.type==="movie"?"Movie":"Series"}</span></td>
      <td>${item.year}</td>
      <td><span style="color:var(--gold);">⭐ ${item.rating}</span></td>
      <td>${item.views.toLocaleString()}</td>
      <td><button class="tbl-del-btn" onclick="deleteContent(${item.id})"><i class="fa-solid fa-trash"></i> Remove</button></td>
    </tr>`).join("");
}

function filterManage(q) {
  populateManageTable(getAllContent().filter(i=>i.title.toLowerCase().includes(q.toLowerCase())));
}

function deleteContent(id) {
  if(!confirm("Remove this content?")) return;
  let ac=JSON.parse(localStorage.getItem(ADMIN_CONTENT_KEY)||"[]");
  ac=ac.filter(i=>i.id!==id); localStorage.setItem(ADMIN_CONTENT_KEY,JSON.stringify(ac));
  const idx=HOPFLIX_DATA.findIndex(i=>i.id===id); if(idx!==-1) HOPFLIX_DATA.splice(idx,1);
  populateManageTable(getAllContent());
}

function populateUsersTable() {
  const builtin=[{id:1,username:"admin",email:"admin@hopflix.com",role:"admin",joinDate:"2024-01-01"},{id:2,username:"testuser",email:"test@hopflix.com",role:"user",joinDate:"2024-06-15"}];
  const reg=JSON.parse(localStorage.getItem("hopflix_users")||"[]");
  document.getElementById("users-tbody").innerHTML=[...builtin,...reg].map(u=>`
    <tr>
      <td style="color:var(--text-muted);">${u.id}</td>
      <td><strong style="color:var(--white);">${u.username}</strong></td>
      <td>${u.email}</td>
      <td><span class="tbl-type-badge ${u.role==='admin'?'series':'movie'}">${u.role}</span></td>
      <td>${u.joinDate}</td>
    </tr>`).join("");
}
