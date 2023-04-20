import { useContext } from "react"
import SearchCriteriaContext from "./SearchCriteriaContext"
import SearchCriteriaProvider from "./SearchCriteriaProvider"

export const useSearchCriteriaContext = () => useContext(SearchCriteriaContext)
export default SearchCriteriaProvider
