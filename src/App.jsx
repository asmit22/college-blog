import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import CreatePost from './components/CreatePost'
import BlogFeed from './components/BlogFeed'
import Profile from './components/Profile' // Create this file next!

function App() {
  const [session, setSession] = useState(null)
  const [view, setView] = useState('feed') // 'feed' or 'profile'
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    supabase.auth.onAuthStateChange((_event, session) => setSession(session))
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  if (!session) return <Auth />

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-black tracking-tighter text-blue-600">COLLEGE BLOG</h1>
    
        <div className="flex items-center gap-4">
         <button onClick={() => setView('feed')} className={`px-3 py-1 rounded-md ${view === 'feed' ? 'bg-blue-100 text-blue-600 font-bold' : 'text-gray-500'}`}>Feed</button>
         <button onClick={() => setView('profile')} className={`px-3 py-1 rounded-md ${view === 'profile' ? 'bg-blue-100 text-blue-600 font-bold' : 'text-gray-500'}`}>My Profile</button>
      
        <button 
         onClick={() => setDarkMode(!darkMode)} 
         className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition-colors"
        >
        {darkMode ? '☀️' : '🌙'}
        </button>
      
        <button onClick={() => supabase.auth.signOut()} className="bg-red-50 text-red-600 px-3 py-1 rounded-md text-sm font-bold hover:bg-red-100">Exit</button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        {view === 'feed' ? (
          <>
            <CreatePost user={session.user} onPostCreated={() => {}} />
            <BlogFeed />
          </>
        ) : (
          <Profile user={session.user} />
        )}
      </main>
    </div>
  )
}

export default App