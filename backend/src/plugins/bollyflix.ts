import fetch from 'node-fetch';
const cheerio = require('cheerio');

export const id = 'bollyflix';
const baseUrl = 'https://bollyflix.promo';

export async function search(query: string) {
  const url = `${baseUrl}/search/${encodeURIComponent(query)}/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch search results: ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const results = $('div.post-cards > article').map((_: number, el: any) => {
    const aTag = $(el).find('a');
    const title = aTag.attr('title')?.trim() || 'No title';
    const href = aTag.attr('href') || '';
    const poster = $(el).find('img').attr('src') || '';
    return { id: href, title, poster, _plugin: id };
  }).get();

  return results;
}

export async function load(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load movie page: ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const title = $('h1.entry-title').text().trim() || 'No title';
  const posterUrl = $('meta[property="og:image"]').attr('content') || '';
  const plot = $('div.summary').text().trim() || 'No plot available';

  // Collect episodes or links if they exist
  const episodes = $('div.download-links a').map((_: number, el: any) => {
    return {
      url: $(el).attr('href') || '',
      quality: $(el).text().trim()
    };
  }).get();

  return { title, posterUrl, plot, episodes };
}
