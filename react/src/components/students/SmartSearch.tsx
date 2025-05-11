import { useState } from 'react';
import axios from 'axios';

export default function SmartSearch({ onSearch }: any) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSmartSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post('https://localhost:7278/api/SmartSearch', { query });
      onSearch(response.data); // זה בדיוק כמו הפונקציה הקיימת שלך
    } catch (err) {
      console.error('שגיאה בחיפוש החכם:', err);
      onSearch([]); // במקרה של שגיאה, תחזירי רשימה ריקה
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
