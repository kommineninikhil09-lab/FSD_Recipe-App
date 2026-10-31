import { Link, NavLink } from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <span aria-hidden="true">🍳</span> Recipe Book
        </Link>
        <nav className="nav">
          <NavLink to="/" end>
            All Recipes
          </NavLink>
          <NavLink to="/add" className="nav-cta">
            + Add Recipe
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
