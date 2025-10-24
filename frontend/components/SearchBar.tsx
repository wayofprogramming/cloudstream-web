
import { useState } from 'react';
export default function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [q, setQ] = useState('');
  return (<div>
    <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search movies..." />
    <button onClick={() => onSearch(q)}>Search</button>
  </div>);
}
