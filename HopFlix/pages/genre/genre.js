const genreOffsetsMov = {};
const genreOffsetsSer = {};

document.addEventListener("DOMContentLoaded", () => {
  buildNavbar("");
  buildFooter();

  const params = new URLSearchParams(window.location.search);
  const genre  = params.get("genre") || "All";
  document.title = `HopFlix — ${genre}`;
  document.getElementById("genre-title").textContent = genre;
  document.getElementById("genre-sub").textContent   = `All movies and TV shows in the ${genre} genre`;

  buildGenreContent(genre);
  buildGenreTrending(genre);
  buildAllGenresList(genre);
});

function buildGenreContent(genre) {
  const main   = document.getElementById("genre-main");
  const items  = getByGenre(genre);
  const movies = items.filter(i=>i.type==="movie");
  const series = items.filter(i=>i.type==="series");

  if (!items.length) {
    main.innerHTML = `<div style="text-align:center;padding:80px 0;color:var(--text-muted);">
      <i class="fa-solid fa-film" style="font-size:48px;margin-bottom:12px;display:block;opacity:0.3;"></i>
      <p>No content found for <strong style="color:white">${genre}</strong> yet.</p></div>`;
    return;
  }

  let html = "";

  if (movies.length) {
    genreOffsetsMov[genre] = 0;
    const showRight = movies.length > 6;
    html += `
      <div class="genre-section-header" style="margin-bottom:14px;">
        <h2 class="section-title"><i class="fa-solid fa-film"></i> Movies</h2>
        <a href="/pages/movies/movies.html?genre=${encodeURIComponent(genre)}&type=movie" class="view-more-link">
          View All Movies <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
      <div class="scroll-row-wrap" style="margin-bottom:36px;">
        <button class="scroll-arrow left" id="gmarr-left-mov"
          onclick="scrollGenreRow('movie','${genre}',-1)" style="display:none">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <div class="scroll-row" id="genre-mov-row">
          ${movies.slice(0,6).map(buildCard).join("")}
        </div>
        <button class="scroll-arrow right" id="gmarr-right-mov"
          onclick="scrollGenreRow('movie','${genre}',1)"
          style="display:${showRight?'flex':'none'}">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>`;
  }

  if (series.length) {
    genreOffsetsSer[genre] = 0;
    const showRight = series.length > 6;
    html += `
      <div class="genre-section-header" style="margin-bottom:14px;">
        <h2 class="section-title"><i class="fa-solid fa-tv"></i> TV Series</h2>
        <a href="/pages/tvseries/tvseries.html?genre=${encodeURIComponent(genre)}&type=series" class="view-more-link">
          View All Series <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
      <div class="scroll-row-wrap" style="margin-bottom:36px;">
        <button class="scroll-arrow left" id="gmarr-left-ser"
          onclick="scrollGenreRow('series','${genre}',-1)" style="display:none">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <div class="scroll-row" id="genre-ser-row">
          ${series.slice(0,6).map(buildCard).join("")}
        </div>
        <button class="scroll-arrow right" id="gmarr-right-ser"
          onclick="scrollGenreRow('series','${genre}',1)"
          style="display:${showRight?'flex':'none'}">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>`;
  }

  main.innerHTML = html;
}

function scrollGenreRow(type, genre, dir) {
  const allItems = getByGenre(genre).filter(i=>i.type===type);
  const offsets  = type === "movie" ? genreOffsetsMov : genreOffsetsSer;
  const rowId    = type === "movie" ? "genre-mov-row" : "genre-ser-row";
  const leftId   = type === "movie" ? "gmarr-left-mov"  : "gmarr-left-ser";
  const rightId  = type === "movie" ? "gmarr-right-mov" : "gmarr-right-ser";

  const maxOff = Math.max(0, allItems.length - 6);
  const newOff = Math.min(maxOff, Math.max(0, (offsets[genre]||0) + dir * 6));
  offsets[genre] = newOff;

  const row = document.getElementById(rowId);
  if (row) {
    row.style.transition = "opacity 0.25s ease, transform 0.25s ease";
    row.style.opacity    = "0";
    row.style.transform  = dir > 0 ? "translateX(30px)" : "translateX(-30px)";
    setTimeout(() => {
      const slice   = allItems.slice(newOff, newOff + 6);
      const empties = 6 - slice.length;
      row.innerHTML = slice.map(buildCard).join("")
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

  const btnL = document.getElementById(leftId);
  const btnR = document.getElementById(rightId);
  if (btnL) btnL.style.display = newOff > 0      ? "flex" : "none";
  if (btnR) btnR.style.display = newOff < maxOff ? "flex" : "none";
}

function buildGenreTrending(genre) {
  const list  = document.getElementById("genre-trending");
  const items = getByGenre(genre).sort((a,b)=>b.views-a.views).slice(0,6);
  list.innerHTML = items.map((item,i) => `
    <a href="/pages/watch/watch.html?id=${item.id}" class="trending-item">
      <span class="trending-rank">${i+1}</span>
      <img src="${item.cover}" alt="${item.title}" onerror="this.style.background='var(--dark)'">
      <div class="trending-info">
        <strong>${item.title}</strong>
        <small>${item.type==="movie"?"Movie":"Series"} · &#11088; ${item.rating}</small>
      </div>
    </a>`).join("");
}

function buildAllGenresList(current) {
  const wrap = document.getElementById("all-genres");
  wrap.innerHTML = getAllGenres().map(g =>
    `<a href="/pages/genre/genre.html?genre=${encodeURIComponent(g)}" class="genre-pill ${g===current?'active':''}">${g}</a>`
  ).join("");
}
