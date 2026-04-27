const genreOffsets = {};

document.addEventListener("DOMContentLoaded", () => {
  buildNavbar("movies");
  buildFooter();
  buildMoviesByGenre();
  buildMovieTrending();
});

function buildMoviesByGenre() {
  const main   = document.getElementById("movies-main");
  const movies = getMovies();
  const genreSet = new Set();
  movies.forEach(m => m.genres.forEach(g => genreSet.add(g)));
  const genres = [...genreSet].sort();
  let html = "";
  genres.forEach(genre => {
    const items = movies.filter(m => m.genres.includes(genre));
    if (!items.length) return;
    genreOffsets[genre] = 0;
    const showLeft  = false; // start at beginning — no left arrow
    const showRight = items.length > 6;
    html += `
      <div class="genre-section" id="genre-${cssId(genre)}">
        <div class="genre-section-header">
          <h2 class="section-title">${genre}</h2>
          <a href="/pages/genre/genre.html?genre=${encodeURIComponent(genre)}&type=movie" class="view-more-link">
            View All <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
        <div class="scroll-row-wrap">
          <button class="scroll-arrow left" id="arr-left-${cssId(genre)}"
            onclick="scrollRow('${genre}',-1)"
            style="display:${showLeft?'flex':'none'}">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <div class="scroll-row" id="row-${cssId(genre)}">
            ${items.slice(0,6).map(buildCard).join("")}
          </div>
          <button class="scroll-arrow right" id="arr-right-${cssId(genre)}"
            onclick="scrollRow('${genre}',1)"
            style="display:${showRight?'flex':'none'}">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>`;
  });
  main.innerHTML = html;
}

function scrollRow(genre, dir) {
  const movies  = getMovies().filter(m => m.genres.includes(genre));
  const maxOff  = Math.max(0, movies.length - 6);
  const newOff  = Math.min(maxOff, Math.max(0, (genreOffsets[genre]||0) + dir * 6));
  genreOffsets[genre] = newOff;

  const row = document.getElementById("row-" + cssId(genre));
  if (row) {
    // Slide animation
    row.style.transition = "opacity 0.25s ease, transform 0.25s ease";
    row.style.opacity    = "0";
    row.style.transform  = dir > 0 ? "translateX(30px)" : "translateX(-30px)";
    setTimeout(() => {
      // Fill with items; pad with empty slots if not enough
      const slice = movies.slice(newOff, newOff + 6);
      const empties = 6 - slice.length;
      row.innerHTML = slice.map(buildCard).join("")
        + (empties > 0 ? `<div class="scroll-empty-slot" style="flex:1;min-width:0;"></div>`.repeat(empties) : "");
      row.style.transition = "opacity 0.25s ease, transform 0.25s ease";
      row.style.transform  = dir > 0 ? "translateX(-30px)" : "translateX(30px)";
      row.style.opacity    = "0";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          row.style.transform = "translateX(0)";
          row.style.opacity   = "1";
        });
      });
    }, 250);
  }

  const btnL = document.getElementById("arr-left-"  + cssId(genre));
  const btnR = document.getElementById("arr-right-" + cssId(genre));
  if (btnL) btnL.style.display = newOff > 0       ? "flex" : "none";
  if (btnR) btnR.style.display = newOff < maxOff  ? "flex" : "none";
}

function buildMovieTrending() {
  const list = document.getElementById("movie-trending");
  if (!list) return;
  list.innerHTML = getMovies().sort((a,b)=>b.views-a.views).slice(0,8).map((item,i) => `
    <a href="/pages/watch/watch.html?id=${item.id}" class="trending-item">
      <span class="trending-rank">${i+1}</span>
      <img src="${item.cover}" alt="${item.title}" onerror="this.style.background='var(--dark)'">
      <div class="trending-info">
        <strong>${item.title}</strong>
        <small>${item.year} · &#11088; ${item.rating}</small>
      </div>
    </a>`).join("");
}

function cssId(s) { return s.replace(/[^a-z0-9]/gi,"-").toLowerCase(); }
