import { Link } from 'react-router-dom'
import './Navbar.css'

interface NavbarProps {
  primaryAction?: { label: string; onClick: () => void }
  secondaryAction?: { label: string; onClick: () => void }
}

export default function Navbar({ primaryAction, secondaryAction }: NavbarProps) {
  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">SurveyBuilder</Link>
      <div className="navbar-actions">
        {primaryAction && (
          <button className="btn btn-primary btn-sm" onClick={primaryAction.onClick}>
            {primaryAction.label}
          </button>
        )}
        {secondaryAction && (
          <button className="btn btn-secondary btn-sm" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </button>
        )}
      </div>
    </nav>
  )
}
