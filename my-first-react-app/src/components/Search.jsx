import React from "react";

const Search = ({search, setSearch}) => {
    return (
        <div className="flex justify-center">
            <form>   
                <label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                <div class="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeWidth="2" d="M21 21l-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
      </svg>
    </div>
                    <input type="search" id="search" value={search} onChange={(event) => setSearch(event.target.value)} class="block w-full p-3 ps-9 bg-white rounded-lg border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body" placeholder="Search" required />
                    
                </div>
            </form>
        </div>
    )
}

export default Search;