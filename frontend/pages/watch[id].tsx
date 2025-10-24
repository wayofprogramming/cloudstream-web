import { useRouter } from 'next/router';
import useSWR from 'swr';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const fetcher = (url: string) =>
  fetch(`${API_URL}${url}`).then(r => r.json());

export default function WatchPage() {
  const router = useRouter();
  const { id } = router.query;

  // Parse plugin and target URL from the route parameter
  const [plugin, encodedUrl] = (id as string)?.split('::') || [];
  const targetUrl = decodeURIComponent(encodedUrl || '');

  // Fetch from backend only when id is ready
  const { data, error } = useSWR(
    id ? `/api/watch?plugin=${plugin}&url=${encodeURIComponent(targetUrl)}` : null,
    fetcher
  );

  if (error) return <div>Error loading</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <main style={{ padding: 20 }}>
      <h1>{data.title}</h1>
      <img src={data.posterUrl} width={200} alt="" />
      <p>{data.plot}</p>

      <h2>Episodes / Links</h2>
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
