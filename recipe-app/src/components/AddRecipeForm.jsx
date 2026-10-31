import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = ['Breakfast', 'Main Course', 'Salad', 'Soup', 'Dessert', 'Drink', 'Snack']
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

const emptyForm = {
  title: '',
  emoji: '🍲',
  cuisine: '',
  category: 'Main Course',
  difficulty: 'Easy',
  prepTime: '',
  cookTime: '',
  servings: '',
  description: '',
  ingredients: '',
  instructions: '',
  tags: '',
}

// Turns a multi-line textarea into a clean list, one item per line.
const toLines = (text) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

function validate(form) {
  const errors = {}
  if (!form.title.trim()) errors.title = 'Please give the recipe a name.'
  if (!form.cuisine.trim()) errors.cuisine = 'Please enter a cuisine.'
  if (!form.description.trim()) errors.description = 'Please add a short description.'
  if (!(Number(form.servings) > 0)) errors.servings = 'Servings must be at least 1.'
  if (toLines(form.ingredients).length === 0) errors.ingredients = 'Add at least one ingredient.'
  if (toLines(form.instructions).length === 0) errors.instructions = 'Add at least one step.'
  return errors
}

function AddRecipeForm({ onAdd }) {
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const foundErrors = validate(form)
    setErrors(foundErrors)
    if (Object.keys(foundErrors).length > 0) return

    const recipe = onAdd({
      title: form.title.trim(),
      emoji: form.emoji.trim() || '🍲',
      cuisine: form.cuisine.trim(),
      category: form.category,
      difficulty: form.difficulty,
      prepTime: Number(form.prepTime) || 0,
      cookTime: Number(form.cookTime) || 0,
      servings: Number(form.servings),
      description: form.description.trim(),
      ingredients: toLines(form.ingredients),
      instructions: toLines(form.instructions),
      tags: form.tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    })
    navigate(`/recipes/${recipe.id}`)
  }

  const fieldError = (name) =>
    errors[name] && <span className="field-error">{errors[name]}</span>

  return (
    <section className="form-card">
      <h1>Add a new recipe</h1>
      <p className="form-subtitle">Share your favourite dish with the collection.</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <label className="field field-grow">
            Recipe name
            <input name="title" value={form.title} onChange={handleChange} />
            {fieldError('title')}
          </label>
          <label className="field field-small">
            Emoji
            <input name="emoji" value={form.emoji} onChange={handleChange} maxLength={4} />
          </label>
        </div>

        <div className="form-row">
          <label className="field">
            Cuisine
            <input name="cuisine" value={form.cuisine} onChange={handleChange} placeholder="e.g. Italian" />
            {fieldError('cuisine')}
          </label>
          <label className="field">
            Category
            <select name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="field">
            Difficulty
            <select name="difficulty" value={form.difficulty} onChange={handleChange}>
              {DIFFICULTIES.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-row">
          <label className="field">
            Prep time (min)
            <input type="number" min="0" name="prepTime" value={form.prepTime} onChange={handleChange} />
          </label>
          <label className="field">
            Cook time (min)
            <input type="number" min="0" name="cookTime" value={form.cookTime} onChange={handleChange} />
          </label>
          <label className="field">
            Servings
            <input type="number" min="1" name="servings" value={form.servings} onChange={handleChange} />
            {fieldError('servings')}
          </label>
        </div>

        <label className="field">
          Short description
          <textarea name="description" rows={2} value={form.description} onChange={handleChange} />
          {fieldError('description')}
        </label>

        <label className="field">
          <span>Ingredients <small>(one per line)</small></span>
          <textarea name="ingredients" rows={6} value={form.ingredients} onChange={handleChange} />
          {fieldError('ingredients')}
        </label>

        <label className="field">
          <span>Instructions <small>(one step per line)</small></span>
          <textarea name="instructions" rows={6} value={form.instructions} onChange={handleChange} />
          {fieldError('instructions')}
        </label>

        <label className="field">
          <span>Tags <small>(comma separated)</small></span>
          <input name="tags" value={form.tags} onChange={handleChange} placeholder="vegetarian, quick" />
        </label>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save recipe
          </button>
        </div>
      </form>
    </section>
  )
}

export default AddRecipeForm
