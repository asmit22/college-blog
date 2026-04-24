import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Heart, MessageSquare, Send } from 'lucide-react'

export default function PostCard({ post }) {
  const [likesCount, setLikesCount] = useState(0)
  const [hasLiked, setHasLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    fetchLikes()
    if (showComments) fetchComments()
  }, [post.id, showComments])

  const fetchLikes = async () => {
    const { count } = await supabase.from('likes').select('*', { count: 'exact', head: true }).eq('post_id', post.id)
    setLikesCount(count || 0)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase.from('likes').select('*').eq('post_id', post.id).eq('user_id', user.id).single()
      setHasLiked(!!data)
    }
  }

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(username)')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true })
    setComments(data || [])
  }

  const handleLike = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert("Please log in!")

    if (hasLiked) {
      await supabase.from('likes').delete().match({ post_id: post.id, user_id: user.id })
      setLikesCount(prev => prev - 1)
      setHasLiked(false)
    } else {
      await supabase.from('likes').insert([{ post_id: post.id, user_id: user.id }])
      setLikesCount(prev => prev + 1)
      setHasLiked(true)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('comments').insert([
      { post_id: post.id, user_id: user.id, content: newComment }
    ])
    
    if (!error) {
      setNewComment('')
      fetchComments()
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 mb-6 transition-all hover:shadow-lg">
      
      {/* Category Tag */}
      <span className="inline-block px-2 py-1 mb-3 rounded text-[10px] font-black uppercase tracking-widest bg-blue-100 dark:bg-blue-900/30 text-blue-600">
        {post.category || 'General'}
      </span>

      <h3 className="text-xl font-bold text-blue-600 mb-2">{post.title}</h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>

      {/* Meta Data */}
      <div className="flex justify-between items-center text-xs text-gray-400 mb-4 pb-4 border-b dark:border-gray-700">
        <span className="font-medium text-gray-500 dark:text-gray-400">By @{post.profiles?.username || 'Anonymous'}</span>
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-6">
        <button 
          onClick={handleLike} 
          className={`flex items-center gap-2 text-sm transition-colors ${hasLiked ? 'text-red-500 font-bold' : 'text-gray-500 hover:text-red-500'}`}
        >
          <Heart size={18} fill={hasLiked ? "currentColor" : "none"} />
          <span>{likesCount}</span>
        </button>
        
        <button 
          onClick={() => setShowComments(!showComments)} 
          className={`flex items-center gap-2 text-sm transition-colors ${showComments ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-blue-500'}`}
        >
          <MessageSquare size={18} />
          <span>{comments.length || ''} Comments</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t dark:border-gray-700 animate-in fade-in duration-300">
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {comments.length === 0 && <p className="text-xs text-gray-500 italic">No comments yet. Start the conversation!</p>}
            {comments.map(c => (
              <div key={c.id} className="text-sm bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border dark:border-gray-800">
                <span className="font-bold text-blue-500 text-xs">@{c.profiles?.username}: </span>
                <p className="text-gray-700 dark:text-gray-300 mt-1">{c.content}</p>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Write a comment..." 
              className="flex-1 bg-gray-100 dark:bg-gray-900 border dark:border-gray-700 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}