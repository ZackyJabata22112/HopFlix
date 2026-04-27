let currentSlide=0, autoTimer=null;
let currentFilter="all", currentPage=1;
const ITEMS_PER_PAGE=24;
let featuredItems=[];

document.addEventListener("DOMContentLoaded", ()=>{
  buildNavbar("home");
  buildFooter();
  loadAdminContent();

  const params=new URLSearchParams(window.location.search);
  const q=params.get("search");
  if(q){
    document.getElementById("carousel-section").style.display="none";
    const sidebar = document.querySelector(".sidebar");
    if(sidebar) sidebar.style.display="none";
    showSearch(q);
    const ni=document.getElementById("nav-search-input");
    if(ni) ni.value="";
  } else {
    buildCarousel();
  }
  buildBrowse();
  buildTrending();
});

function loadAdminContent() {
  const ac=JSON.parse(localStorage.getItem("hopflix_admin_content")||"[]");
  ac.forEach(item=>{ if(!HOPFLIX_DATA.find(d=>d.id===item.id)) HOPFLIX_DATA.push(item); });
}

function buildCarousel() {
  const all = HOPFLIX_DATA.filter(i=>i.featured);
  featuredItems = all.sort(()=>Math.random()-0.5).slice(0,6);
  if(!featuredItems.length) { document.getElementById("carousel-section").style.display="none"; return; }
  const el   = document.getElementById("carousel");
  const dots = document.getElementById("carousel-dots");
  el.innerHTML = featuredItems.map((item,idx)=>{
    const bannerSrc = `/images/carousel-banners/${item.id}.jpg`;
    return `
    <div class="carousel-slide">
      <img class="slide-bg" src="${bannerSrc}" alt="${item.title}"
           onerror="this.src='${item.cover}'">
      <div class="slide-info">
        <span class="slide-badge">${item.type==="movie"?"Movie":"Series"}</span>
        <h2 class="slide-title">${item.title}</h2>
        <p class="slide-desc">${item.description}</p>
        <div class="slide-meta">
          <span>${item.year}</span><span>·</span>
          <span class="rating">&#11088; ${item.rating}</span><span>·</span>
          <span>${item.genres.slice(0,2).join(", ")}</span>
          ${item.type==="series"?`<span>· ${item.seasons.length}S</span>`:`<span>· ${item.duration}</span>`}
        </div>
        <a href="/pages/watch/watch.html?id=${item.id}" class="slide-btn"><i class="fa-solid fa-play"></i> Watch Now</a>
      </div>
    </div>`;
  }).join("");
  dots.innerHTML = featuredItems.map((_,i)=>
    `<button class="carousel-dot ${i===0?'active':''}" onclick="goSlide(${i})"></button>`
  ).join("");
  currentSlide=0;
  startAuto();
}

function goSlide(i) {
  const n=featuredItems.length; if(!n) return;
  currentSlide=((i%n)+n)%n;
  document.getElementById("carousel").style.transform=`translateX(-${currentSlide*100}%)`;
  document.querySelectorAll(".carousel-dot").forEach((d,j)=>d.classList.toggle("active",j===currentSlide));
}
function carouselPrev(){goSlide(currentSlide-1);resetAuto();}
function carouselNext(){goSlide(currentSlide+1);resetAuto();}
function startAuto(){autoTimer=setInterval(()=>goSlide(currentSlide+1),5500);}
function resetAuto(){clearInterval(autoTimer);startAuto();}

function setFilter(f,btn){
  currentFilter=f; currentPage=1;
  document.querySelectorAll(".filter-btn").forEach(b=>b.classList.toggle("active",b.dataset.filter===f));
  buildBrowse();
}

function buildBrowse(){
  let all;
  if(currentFilter==="all"){
    // Interleave movies and series
    all = [...HOPFLIX_DATA].sort(()=>Math.random()-0.5);
  } else {
    all = HOPFLIX_DATA.filter(i=>i.type===currentFilter);
  }
  const total=Math.ceil(all.length/ITEMS_PER_PAGE);
  const page=all.slice((currentPage-1)*ITEMS_PER_PAGE,currentPage*ITEMS_PER_PAGE);
  document.getElementById("browse-grid").innerHTML=page.map(buildCard).join("");
  const pag=document.getElementById("browse-pages");
  if(total<=1){pag.innerHTML="";return;}
  let html="";
  if(currentPage>1) html+=`<button class="page-btn" onclick="goPage(${currentPage-1})"><i class="fa-solid fa-chevron-left"></i></button>`;
  for(let p=1;p<=total;p++) html+=`<button class="page-btn ${p===currentPage?'active':''}" onclick="goPage(${p})">${p}</button>`;
  if(currentPage<total) html+=`<button class="page-btn" onclick="goPage(${currentPage+1})"><i class="fa-solid fa-chevron-right"></i></button>`;
  pag.innerHTML=html;
}
function goPage(p){currentPage=p;buildBrowse();document.getElementById("browse-section").scrollIntoView({behavior:"smooth"});}

function showSearch(q){
  document.getElementById("browse-section").style.display="none";
  document.getElementById("search-section").style.display="block";
  const results=searchContent(q);
  document.getElementById("search-title").innerHTML=`Results for: <em>${q}</em> <span style="color:var(--text-muted);font-size:14px;font-weight:400;">(${results.length} found)</span>`;
  document.getElementById("search-grid").innerHTML=results.length
    ?results.map(buildCard).join("")
    :`<div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--text-muted);">
       <i class="fa-solid fa-magnifying-glass" style="font-size:40px;margin-bottom:12px;display:block;"></i>
       No results for "<strong style="color:white">${q}</strong>"</div>`;
}

function buildTrending(){
  document.getElementById("trending-list").innerHTML=getTrending(10).map((item,i)=>`
    <a href="/pages/watch/watch.html?id=${item.id}" class="trending-item">
      <span class="trending-rank">${i+1}</span>
      <img src="${item.cover}" alt="${item.title}" onerror="this.src='/images/covers/placeholder.jpg'">
      <div class="trending-info">
        <strong>${item.title}</strong>
        <small>${item.type==="movie"?"Movie":"Series"} &middot; ${item.views.toLocaleString()} views</small>
      </div>
    </a>`).join("");
}
