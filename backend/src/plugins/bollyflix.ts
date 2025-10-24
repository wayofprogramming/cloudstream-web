import fetch from 'node-fetch';
const cheerio = require('cheerio'); // Use require for Node.js compatibility

export const id = 'bollyflix';
const baseUrl = 'https://bollyflix.promo';

export interface EpisodeLink {
  url: string;
  quality?: string;
}

export interface MovieLoadResponse {
  title: string;
  posterUrl: string;
  plot: string;
  episodes: EpisodeLink[];
}

export interface MovieSearchResult {
  id: string;
  title: string;
  poster: string;
  _plugin: string;
}

export async function search(query: string): Promise<MovieSearchResult[]> {
  const url = `${baseUrl}/search/${encodeURIComponent(query)}/`;
  const res = await fetch(url);
  if (!res.ok) return []; // fail gracefully
  const html = await res.text();
  const $ = cheerio.load(html);

  const results: MovieSearchResult[] = $('div.post-cards > article')
    .map((_: number, el: any) => {
      const aTag = $(el).find('a');
      const title = aTag.attr('title')?.trim() || 'No title';
      const href = aTag.attr('href') || '';
      const poster = $(el).find('img').attr('src') || '';
      return { id: href, title, poster, _plugin: id };
    })
    .get();

  return results;
}

export async function load(url: string): Promise<MovieLoadResponse> {
  const res = await fetch(url);
  if (!res.ok) return { title: '', posterUrl: '', plot: '', episodes: [] }; // fail gracefully
  const html = await res.text();
  const $ = cheerio.load(html);

  const title = $('h1.entry-title').text().trim() || 'No title';
  const posterUrl = $('meta[property="og:image"]').attr('content') || '';
  const plot = $('div.summary').text().trim() || 'No plot available';

  const episodes: EpisodeLink[] = $('div.download-links a')
    .map((_: number, el: any) => ({
      url: $(el).attr('href') || '',
      quality: $(el).text().trim() || undefined
    }))
    .get();

  return { title, posterUrl, plot, episodes };
}
