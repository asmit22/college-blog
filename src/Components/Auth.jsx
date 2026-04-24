import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } }
      })
      if (error) alert(error.message)
      else alert('Success! Check your email for a verification link.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) alert(error.message)
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form onSubmit={handleAuth} className="p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          {isSignUp ? 'Join CollegeBlog' : 'Welcome Back'}
        </h2>
        
        {isSignUp && (
          <input
            className="w-full p-3 mb-4 rounded border dark:bg-gray-700 dark:border-gray-600"
            type="text" placeholder="Username"
            value={username} onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}
        
        <input
          className="w-full p-3 mb-4 rounded border dark:bg-gray-700 dark:border-gray-600"
          type="email" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <input
          className="w-full p-3 mb-6 rounded border dark:bg-gray-700 dark:border-gray-600"
          type="password" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          {loading ? 'Thinking...' : isSignUp ? 'Create Account' : 'Sign In'}
        </button>

        <p className="mt-4 text-center">
          {isSignUp ? 'Already a member?' : 'New here?'}
          <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="ml-2 text-blue-500 underline">
            {isSignUp ? 'Login' : 'Create an account'}
          </button>
        </p>
      </form>
    </div>
  )
}