import { Link } from 'react-router-dom'

function RecipeCard({ recipe }) {
  const totalTime = recipe.prepTime + recipe.cookTime

  return (
    <Link to={`/recipes/${recipe.id}`} className="card">
      <div className="card-image" aria-hidden="true">
        {recipe.emoji}
      </div>
      <div className="card-body">
        <span className="badge">{recipe.category}</span>
        <h3 className="card-title">{recipe.title}</h3>
        <p className="card-text">{recipe.description}</p>
        <div className="card-meta">
          <span>⏱ {totalTime} min</span>
          <span>🍽 {recipe.servings} servings</span>
          <span>{recipe.cuisine}</span>
        </div>
      </div>
    </Link>
  )
}

export default RecipeCard
