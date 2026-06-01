document.addEventListener('DOMContentLoaded', async function() {
  await checkSession();
  buildNavbar('index');

  var input   = document.getElementById('idx-search');
  var results = document.getElementById('idx-results');

  input.addEventListener('input', async function() {
    var q = input.value.trim();
    if (q.length < 2) { results.innerHTML = ''; return; }
    var items = await searchContent(q);
    items = items.slice(0, 7);
    if (!items.length) {
      results.innerHTML = '<div style="padding:12px 16px;color:var(--text-muted);font-size:13px;">No results for "' + q + '"</div>';
    } else {
      results.innerHTML = items.map(function(item) {
        return '<a href="/HopFlix/pages/watch/watch.html?id=' + item.id + '" class="idx-sr-item">' +
          '<img src="' + item.cover + '" alt="' + item.title + '" onerror="this.style.display=\'none\'">' +
          '<div><strong>' + highlight(item.title, q) + '</strong>' +
          '<small>' + item.year + ' · ' + (item.type === 'movie' ? 'Movie' : 'Series') + ' · &#11088; ' + item.rating + '</small></div>' +
        '</a>';
      }).join('');
    }
  });

  input.addEventListener('keydown', function(e) { if (e.key === 'Enter') doIdxSearch(); });
  document.addEventListener('click', function(e) { if (!e.target.closest('.idx-search-wrap')) results.innerHTML = ''; });
});

function doIdxSearch() {
  var q = document.getElementById('idx-search').value.trim();
  if (q) window.location.href = '/HopFlix/pages/home/home.html?search=' + encodeURIComponent(q);
}
function highlight(title, q) {
  var re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
  return title.replace(re, '<mark style="background:rgba(109,40,217,0.4);color:white;border-radius:2px;padding:0 2px;">$1</mark>');
}
