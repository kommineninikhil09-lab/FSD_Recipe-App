import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import RecipeCard from './RecipeCard'
import SearchBar from './SearchBar'

// A recipe matches when every word of the query appears in its title,
// description, cuisine, category, tags or ingredients.
function matchesQuery(recipe, query) {
  const haystack = [
    recipe.title,
    recipe.description,
    recipe.cuisine,
    recipe.category,
    ...recipe.tags,
    ...recipe.ingredients,
  ]
    .join(' ')
    .toLowerCase()

  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word))
}

function RecipeList({ recipes }) {
  // The search state is mirrored into the URL so results survive going back from a
  // detail page. Inputs read from local state so fast typing never drops characters.
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [category, setCategory] = useState(searchParams.get('category') ?? '')

  useEffect(() => {
    const next = {}
    if (query) next.q = query
    if (category) next.category = category
    setSearchParams(next, { replace: true })
  }, [query, category, setSearchParams])

  const clearSearch = () => {
    setQuery('')
    setCategory('')
  }

  const categories = [...new Set(recipes.map((r) => r.category))].sort()

  const filtered = recipes.filter(
    (r) => (!category || r.category === category) && matchesQuery(r, query),
  )

  return (
    <section>
      <div className="hero">
        <h1>Find your next favourite meal</h1>
        <p>Browse {recipes.length} hand-picked recipes from around the world.</p>
      </div>

      <SearchBar
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
      />

      <p className="result-count">
        Showing {filtered.length} of {recipes.length} recipes
      </p>

      {filtered.length > 0 ? (
        <div className="grid">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No recipes match your search.</p>
          <button className="btn btn-secondary" onClick={clearSearch}>
            Clear search
          </button>
        </div>
      )}
    </section>
  )
}

export default RecipeList
