
export const id = 'bollyflix';

export async function search(query: string) {
  return [
    { id: 'demo-movie', title: `Demo Movie for ${query}`, poster: 'https://via.placeholder.com/150', _plugin: id }
  ];
}

export async function load(url: string) {
  return { title: 'Demo Movie', posterUrl: 'https://via.placeholder.com/150', plot: 'Demo plot', episodes: [] };
}
