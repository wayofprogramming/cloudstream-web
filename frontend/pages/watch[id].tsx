import { useRouter } from 'next/router';
import useSWR from 'swr';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cloudstream-web-production.up.railway.app';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function WatchPage() {
  const router = useRouter();
  const { id } = router.query;

  // id format = plugin::encodedUrl
  const [pluginId, encodedUrl] = (id as string)?.split('::') || [];
  const url = decodeURIComponent(encodedUrl || '');

  // Build correct API endpoint (your working one)
  const api = id
    ? `${API_URL}/api/load?pluginId=${pluginId}&url=${encodeURIComponent(url)}`
    : null;

  const { data, error } = useSWR(api, fetcher);

  if (error) return <div>Error loading</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <main style={{ padding: 20 }}>
      <h1>{data.title}</h1>
      <img src={data.posterUrl} width={200} alt="" />
      <p>{data.plot}</p>

      <h2>Episodes / Download Links</h2>
      {data.episodes?.length ? (
        <ul>
          {data.episodes.map((ep: any, i: number) => (
            <li key={i}>
              <a href={ep.url} target="_blank" rel="noopener noreferrer">
                {ep.quality || `Link ${i + 1}`}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div>No episodes found</div>
      )}
    </main>
  );
}
