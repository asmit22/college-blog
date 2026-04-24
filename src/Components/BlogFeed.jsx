import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import PostCard from './PostCard'

export default function BlogFeed() {
  const [posts, setPosts] = useState([])

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(username)')
      .order('created_at', { ascending: false })

    if (error) console.log('error', error)
    else setPosts(data)
  }

  useEffect(() => {
    fetchPosts()

    // Real-time listener: Refresh feed when a new post is added
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'posts' }, 
        () => fetchPosts()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">Recent Experiences</h2>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet. Be the first to share!</p>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  )
}