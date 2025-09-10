import React from "react";

const Search = ({search, setSearch}) => {
    return (
        <div className="search">
            <input 
            className="search-bar"
            type = "text" 
            placeholder="Search Movies" 
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            />
        </div>
    )
}

export default Search;