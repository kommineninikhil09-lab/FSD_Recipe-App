function SearchBar({ query, onQueryChange, category, onCategoryChange, categories }) {
  return (
    <div className="search-bar" role="search">
      <input
        type="search"
        className="search-input"
        placeholder="Search by name, ingredient, cuisine or tag…"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        aria-label="Search recipes"
      />
      <select
        className="search-select"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        aria-label="Filter by category"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SearchBar
