const genreOffsetsS = {};

document.addEventListener("DOMContentLoaded", () => {
  buildNavbar("tvseries");
  buildFooter();
  buildSeriesByGenre();
  buildSeriesTrending();
});

function buildSeriesByGenre() {
  const main   = document.getElementById("series-main");
  const series = getSeries();
  const genreSet = new Set();
  series.forEach(s => s.genres.forEach(g => genreSet.add(g)));
  const genres = [...genreSet].sort();
  let html = "";
  genres.forEach(genre => {
    const items = series.filter(s => s.genres.includes(genre));
    if (!items.length) return;
    genreOffsetsS[genre] = 0;
    const showRight = items.length > 6;
    html += `
      <div class="genre-section">
        <div class="genre-section-header">
          <h2 class="section-title">${genre}</h2>
          <a href="/pages/tvseries/tvseries.html?genre=${encodeURIComponent(genre)}&type=series" class="view-more-link">
            View All <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
        <div class="scroll-row-wrap">
          <button class="scroll-arrow left" id="sarr-left-${cssIdS(genre)}"
            onclick="scrollSeriesRow('${genre}',-1)"
            style="display:none">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <div class="scroll-row" id="srow-${cssIdS(genre)}">
            ${items.slice(0,6).map(buildSeriesCard).join("")}
          </div>
          <button class="scroll-arrow right" id="sarr-right-${cssIdS(genre)}"
            onclick="scrollSeriesRow('${genre}',1)"
            style="display:${showRight?'flex':'none'}">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>`;
  });
  main.innerHTML = html;
}

function scrollSeriesRow(genre, dir) {
  const series  = getSeries().filter(s => s.genres.includes(genre));
  const maxOff  = Math.max(0, series.length - 6);
  const newOff  = Math.min(maxOff, Math.max(0, (genreOffsetsS[genre]||0) + dir * 6));
  genreOffsetsS[genre] = newOff;

  const row = document.getElementById("srow-" + cssIdS(genre));
  if (row) {
    row.style.transition = "opacity 0.25s ease, transform 0.25s ease";
    row.style.opacity    = "0";
    row.style.transform  = dir > 0 ? "translateX(30px)" : "translateX(-30px)";
    setTimeout(() => {
      const slice   = series.slice(newOff, newOff + 6);
      const empties = 6 - slice.length;
      row.innerHTML = slice.map(buildSeriesCard).join("")
        + (empties > 0 ? `<div class="scroll-empty-slot" style="flex:1;min-width:0;"></div>`.repeat(empties) : "");
      row.style.transform = dir > 0 ? "translateX(-30px)" : "translateX(30px)";
      row.style.opacity   = "0";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          row.style.transform = "translateX(0)";
          row.style.opacity   = "1";
        });
      });
    }, 250);
  }

  const btnL = document.getElementById("sarr-left-"  + cssIdS(genre));
  const btnR = document.getElementById("sarr-right-" + cssIdS(genre));
  if (btnL) btnL.style.display = newOff > 0      ? "flex" : "none";
  if (btnR) btnR.style.display = newOff < maxOff ? "flex" : "none";
}

function buildSeriesCard(item) {
  const fav = typeof isFavourite==="function" ? isFavourite(item.id) : false;
  const totalEps = item.seasons.reduce((t,s)=>t+s.episodes.length,0);
  const stars = typeof buildStars==="function" ? buildStars(item.rating) : "";
  return `
    <a href="/pages/watch/watch.html?id=${item.id}" class="content-card">
      <span class="card-type-badge">${item.seasons.length}S &middot; ${totalEps}ep</span>
      <button class="card-fav-btn ${fav?'active':''}"
        onclick="event.preventDefault();event.stopPropagation();handleCardFav(this,${item.id});"
        title="Favourite"><i class="fa-${fav?'solid':'regular'} fa-heart"></i></button>
      <img class="card-poster" src="${item.cover}" alt="${item.title}" loading="lazy"
        onerror="this.src='/images/covers/placeholder.jpg'">
      <div class="card-overlay">
        <div class="card-play-circle"><i class="fa-solid fa-play" style="margin-left:2px;"></i></div>
        <div class="card-stars">${stars}<span style="color:var(--text-muted);font-size:11px;margin-left:3px;">${item.rating}</span></div>
        <div class="card-overlay-desc">${item.description}</div>
      </div>
      <div class="card-info">
        <div class="card-title">${item.title}</div>
        <div class="card-meta">
          <span>${item.year}</span>
          <span class="rating" style="color:var(--gold);">&#11088; ${item.rating}</span>
          <span class="card-genre-pill">${item.genres[0]}</span>
        </div>
      </div>
    </a>`;
}

function buildSeriesTrending() {
  const list = document.getElementById("series-trending");
  if (!list) return;
  list.innerHTML = getSeries().sort((a,b)=>b.views-a.views).slice(0,8).map((item,i) => `
    <a href="/pages/watch/watch.html?id=${item.id}" class="trending-item">
      <span class="trending-rank">${i+1}</span>
      <img src="${item.cover}" alt="${item.title}" onerror="this.style.background='var(--dark)'">
      <div class="trending-info">
        <strong>${item.title}</strong>
        <small>${item.seasons.length} Season${item.seasons.length>1?'s':''} · &#11088; ${item.rating}</small>
      </div>
    </a>`).join("");
}

function cssIdS(s) { return s.replace(/[^a-z0-9]/gi,"-").toLowerCase(); }
