import React, {  useEffect } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

interface SearchProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

const Search: React.FC<SearchProps> = ({ searchTerm, onSearch }) => {
  // הגדרת פונקציה לשינוי המילה בזמן הקשה
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value); // כל שינוי בתיבת החיפוש, תעדכן את המילה
  };

  // טיפול בלחיצה על Enter אם יש צורך
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch(searchTerm); // חפש אם נלחץ Enter
    }
  };

  // אם המשתמש מוחק את כל המילה, הצג את כל הנתונים
  useEffect(() => {
    if (searchTerm === '') {
      onSearch(''); // אם החיפוש ריק, הצג את כל הנתונים
    }
  }, [searchTerm, onSearch]);

  return (
    <TextField
      placeholder="חיפוש"
      variant="outlined"
      fullWidth
      value={searchTerm}
      onChange={handleChange}
      onKeyDown={handleKeyDown} // מימוש לחיצה על Enter
      size="small"
      sx={{
        backgroundColor: '#f1f3f4',
        borderRadius: '50px',
        '& .MuiOutlinedInput-root': {
          borderRadius: '50px',
          paddingLeft: 1,
          paddingRight: 1,
        },
        '& .MuiInputBase-input': {
          padding: '10px 14px',
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" sx={{ cursor: 'pointer' }} /> {/* הוספת pointer על האייקון */}
          </InputAdornment>
        ),
      }}
    />
  );
};

export default Search;
