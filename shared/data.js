const API_CONTENT = '/HopFlix/api/content.php';

async function _contentGet(params) {
  const url = API_CONTENT + '?' + new URLSearchParams(params).toString();
  const res = await fetch(url, { credentials: 'same-origin' });
  return res.json();
}

async function getAllContent()       { return _contentGet({ action: 'all' }); }
async function getMovies()           { return _contentGet({ action: 'movies' }); }
async function getSeries()           { return _contentGet({ action: 'series' }); }
async function getById(id)           { return _contentGet({ action: 'item', id: id }); }
async function getByGenre(genre)     { return _contentGet({ action: 'genre', genre: genre }); }
async function searchContent(q)      { return _contentGet({ action: 'search', q: q }); }
async function getSimilar(id, limit) { return _contentGet({ action: 'similar', id: id, limit: limit || 6 }); }
async function getAllGenres()         { return _contentGet({ action: 'genres' }); }
async function incrementView(id)     { return _contentGet({ action: 'view', id: id }); }
