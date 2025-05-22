import { createContext, useContext, useState, ReactNode } from "react";

interface SearchContextType {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterCriteria: string;
    setFilterCriteria: (criteria: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCriteria, setFilterCriteria] = useState('');

    return (
        <SearchContext.Provider value={{ searchTerm, setSearchTerm, filterCriteria, setFilterCriteria }}>
            {children}
        </SearchContext.Provider>
    );
};
export const useSearch = (): SearchContextType => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};