import { Link } from 'react-router-dom'

function NotFound({ message = "The page you're looking for doesn't exist." }) {
  return (
    <div className="empty-state">
      <p className="empty-emoji" aria-hidden="true">🥄</p>
      <h1>Not found</h1>
      <p>{message}</p>
      <Link to="/" className="btn btn-primary">
        Back to all recipes
      </Link>
    </div>
  )
}

export default NotFound
