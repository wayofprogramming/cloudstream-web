const fetch = require('node-fetch'); // Node-fetch 2.x style
const cheerio = require('cheerio');

export const id = 'bollyflix';
const baseUrl = 'https://bollyflix.promo';

export async function search(query: string) {
  const url = `${baseUrl}/search/${encodeURIComponent(query)}/`;
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  const results = $('div.post-cards > article')
    .map((_, el) => {
      const aTag = $(el).find('a');
      const title = aTag.attr('title')?.trim() || 'Unknown';
      const href = aTag.attr('href') || '#';
      const poster = $(el).find('img').attr('src') || 'https://via.placeholder.com/150';
      return { id: href, title, poster, _plugin: id };
    })
    .get();

  return results;
}

export async function load(url: string) {
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  const title = $('title').text().replace('Download ', '');
  const posterUrl = $('meta[property="og:image"]').attr('content') || 'https://via.placeholder.com/150';
  const plot = $('span#summary').text() || 'No plot available';

  return { title, posterUrl, plot, episodes: [] };
}
