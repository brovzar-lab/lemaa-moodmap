import { Link, useLocation } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'

interface Props {
  children: React.ReactNode
}

const navItems = [
  { to: '/log', label: 'Log' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/correlations', label: 'Correlations' },
]

export function Layout({ children }: Props) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[430px] mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-semibold text-violet-600 text-lg">MoodMap</span>
          <nav className="flex gap-4 text-sm">
            {navItems.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`font-medium transition-colors ${
                  location.pathname === to
                    ? 'text-violet-600'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => signOut(auth)}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="flex-1 max-w-[430px] mx-auto w-full px-4 py-6">{children}</main>
    </div>
  )
}
