import fetch from 'node-fetch';
import cheerio from 'cheerio';

export const id = 'bollyflix';
const baseUrl = 'https://bollyflix.promo';

export async function search(query: string) {
  const url = `${baseUrl}/search/${encodeURIComponent(query)}/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch search results: ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const results = $('div.post-cards > article').map((_, el) => {
    const title = $(el).find('a').attr('title');
    const href = $(el).find('a').attr('href');
    const poster = $(el).find('img').attr('src');

    // Only include valid items
    if (title && href && poster) {
      return { id: href, title: title.trim(), poster, _plugin: id };
    }
    return null;
  }).get().filter(Boolean); // Remove nulls

  return results;
}

export async function load(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch movie page: ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const title = $('title').text()?.replace('Download ', '').trim();
  const posterUrl = $('meta[property="og:image"]').attr('content');
  const plot = $('span#summary').text()?.trim();

  // Only return if title exists
  if (!title) throw new Error('Movie title not found');

  return { title, posterUrl, plot, episodes: [] };
}
