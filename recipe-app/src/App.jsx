import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import sampleRecipes from './data/recipes'
import Header from './components/Header'
import RecipeList from './components/RecipeList'
import RecipeDetail from './components/RecipeDetail'
import AddRecipeForm from './components/AddRecipeForm'
import NotFound from './components/NotFound'
import ScrollToTop from './components/ScrollToTop'
import './App.css'

const STORAGE_KEY = 'recipe-app:custom-recipes'

// Recipes added by the user are kept in localStorage so they survive a page refresh.
function loadCustomRecipes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

function App() {
  const [customRecipes, setCustomRecipes] = useState(loadCustomRecipes)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customRecipes))
  }, [customRecipes])

  const recipes = [...sampleRecipes, ...customRecipes]

  const addRecipe = (recipe) => {
    const nextId = Math.max(...recipes.map((r) => r.id)) + 1
    const newRecipe = { ...recipe, id: nextId }
    setCustomRecipes((prev) => [...prev, newRecipe])
    return newRecipe
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<RecipeList recipes={recipes} />} />
          <Route path="/recipes/:id" element={<RecipeDetail recipes={recipes} />} />
          <Route path="/add" element={<AddRecipeForm onAdd={addRecipe} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer">
        Recipe Book · Built with React
      </footer>
    </BrowserRouter>
  )
}

export default App
