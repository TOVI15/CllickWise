"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

interface SearchContextType {
  searchTerm: string
  setSearchTerm: (term: string) => void
  filterCriteria: string
  setFilterCriteria: (criteria: string) => void
  manualFilterOverride: boolean
  setManualFilterOverride: (value: boolean) => void
  triggerResetView: () => void
  previousFilterState: {
    searchTerm: string
    filterCriteria: string
  } | null
  setPreviousFilterState: (state: { searchTerm: string; filterCriteria: string } | null) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCriteria, setFilterCriteria] = useState("")
  const [manualFilterOverride, setManualFilterOverride] = useState(false)
  const [previousFilterState, setPreviousFilterState] = useState<{
    searchTerm: string
    filterCriteria: string
  } | null>(null)

  // callback שיזמן איפוס תצוגה
  const [finalFilteredCallback] = useState<(() => void) | null>(null)

  const triggerResetView = () => {
    if (finalFilteredCallback) finalFilteredCallback()
  }

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        filterCriteria,
        setFilterCriteria,
        manualFilterOverride,
        setManualFilterOverride,
        triggerResetView,
        previousFilterState,
        setPreviousFilterState,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) throw new Error("useSearch must be used within SearchProvider")
  return context
}
