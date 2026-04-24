import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import PostCard from './PostCard'
import { User, Edit3, Check } from 'lucide-react'

export default function Profile({ user }) {
  const [myPosts, setMyPosts] = useState([])
  const [username, setUsername] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchProfile()
    fetchMyPosts()
  }, [user.id])

  const fetchProfile = async () => {
    const { data } = await supabase.from('profiles').select('username').eq('id', user.id).single()
    if (data) setUsername(data.username)
  }

  const fetchMyPosts = async () => {
    const { data } = await supabase.from('posts').select('*, profiles(username)').eq('author_id', user.id).order('created_at', { ascending: false })
    if (data) setMyPosts(data)
  }

  const updateUsername = async () => {
    const { error } = await supabase.from('profiles').update({ username }).eq('id', user.id)
    if (!error) {
      setIsEditing(false)
      fetchMyPosts() // Refresh usernames on posts
    }
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full">
            <User size={32} />
          </div>
          <div>
            {isEditing ? (
              <div className="flex gap-2">
                <input 
                  className="bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded outline-none border border-blue-500"
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                />
                <button onClick={updateUsername} className="text-green-500"><Check size={20}/></button>
              </div>
            ) : (
              <h2 className="text-2xl font-bold flex items-center gap-2">
                @{username} 
                <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-blue-500"><Edit3 size={16}/></button>
              </h2>
            )}
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>
        <div className="text-center">
          <span className="block text-2xl font-black text-blue-600">{myPosts.length}</span>
          <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Posts</span>
        </div>
      </div>

      {/* User's Posts */}
      <div>
        <h3 className="text-lg font-bold mb-4 opacity-50">Your Activity</h3>
        {myPosts.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No posts yet.</p>
        ) : (
          myPosts.map(post => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  )
}