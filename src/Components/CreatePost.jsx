import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function CreatePost({ user, onPostCreated }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  
  // --- PASTE THIS NEW STATE HERE ---
  const [category, setCategory] = useState('General')
  const categories = ['General', 'Academics', 'Placement', 'Campus Life', 'Events']

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // --- UPDATED INSERT LOGIC ---
    const { error } = await supabase.from('posts').insert([
      { 
        title, 
        content, 
        author_id: user.id, 
        category, // Added this
        published: true 
      }
    ])

    if (error) {
      alert(error.message)
    } else {
      setTitle('')
      setContent('')
      alert('Experience Published!')
      onPostCreated() 
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border dark:border-gray-700 mb-8">
      {/* --- PASTE CATEGORY BUTTONS HERE --- */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              category === cat 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Title of your experience..."
        className="w-full text-xl font-bold mb-2 outline-none bg-transparent"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Share your story..."
        className="w-full h-32 mb-4 outline-none bg-transparent border-t dark:border-gray-700 pt-4"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold transition active:scale-95"
        >
          {loading ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </form>
  )
}