import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import NotFound from './NotFound'

function RecipeDetail({ recipes }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const recipe = recipes.find((r) => r.id === Number(id))

  if (!recipe) {
    return <NotFound message="We couldn't find that recipe." />
  }

  const stats = [
    { label: 'Prep', value: `${recipe.prepTime} min` },
    { label: 'Cook', value: `${recipe.cookTime} min` },
    { label: 'Total', value: `${recipe.prepTime + recipe.cookTime} min` },
    { label: 'Servings', value: recipe.servings },
    { label: 'Difficulty', value: recipe.difficulty },
  ]

  return (
    <article className="detail-card">
      {/* Go back (keeping the search) when possible, otherwise fall back to the list. */}
      <button
        className="back-link"
        onClick={() => (location.key !== 'default' ? navigate(-1) : navigate('/'))}
      >
        ← Back to recipes
      </button>

      <div className="detail-header">
        <div className="detail-image" aria-hidden="true">
          {recipe.emoji}
        </div>
        <div>
          <div className="detail-badges">
            <span className="badge">{recipe.category}</span>
            <span className="badge badge-outline">{recipe.cuisine}</span>
          </div>
          <h1 className="detail-title">{recipe.title}</h1>
          <p className="detail-description">{recipe.description}</p>
        </div>
      </div>

      <dl className="stats">
        {stats.map((s) => (
          <div key={s.label} className="stat">
            <dt>{s.label}</dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="detail-columns">
        <section className="detail-section">
          <h2>Ingredients</h2>
          <ul className="ingredients">
            {recipe.ingredients.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="detail-section">
          <h2>Instructions</h2>
          <ol className="instructions">
            {recipe.instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      </div>

      {recipe.tags.length > 0 && (
        <div className="tags">
          {recipe.tags.map((tag) => (
            <Link key={tag} to={`/?q=${encodeURIComponent(tag)}`} className="tag">
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  )
}

export default RecipeDetail
