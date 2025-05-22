import { useState } from 'react';
import axios from 'axios';
import { useSearch } from '../main/contexSearch';

export default function SmartSearch() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const { setFilterCriteria, setSearchTerm } = useSearch();

  const handleSmartSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post('https://localhost:7278/api/SmartSearch', { query });
      const result = response.data?.result;
      if (typeof result === "string") {
        setFilterCriteria(result);
        setSearchTerm("");
      } else {
        console.warn("תוצאה לא תקינה מהחיפוש החכם", response.data);
      }
    } catch (err) {
      console.error('שגיאה בחיפוש החכם:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <input
        type="text"
        placeholder="חיפוש חכם לדוגמה: תלמידים ללא כיתה"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ flexGrow: 1 }}
      />
      <button onClick={handleSmartSearch} disabled={loading}>
        {loading ? 'מחפש...' : '🔍 חיפוש חכם'}
      </button>
    </div>
  );
}
