import { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../lib/api';

interface Comment {
  id: string;
  author: string;
  text: string;
  time: string;
}

interface PostCardProps {
  id: string;
  image: string;
  caption: string;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  time: string;
  userId?: string;
  onUpdate?: () => void;
}

export function PostCard({ id, image, caption, likes: initialLikes, likedBy, comments: initialComments, time, userId, onUpdate }: PostCardProps) {
  const [liked, setLiked] = useState(userId ? likedBy.includes(userId) : false);
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    try {
      const { post } = await api.likePost(id);
      setLikes(post.likes);
      setLiked(userId ? post.likedBy.includes(userId) : false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || loading) return;

    setLoading(true);
    try {
      const { comment } = await api.addComment(id, newComment);
      setComments([...comments, comment]);
      setNewComment('');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={caption}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <div className="flex items-center gap-4 mb-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className="flex items-center gap-2 group"
          >
            <Heart
              className={`w-6 h-6 transition-all ${
                liked
                  ? 'fill-primary text-primary'
                  : 'text-muted-foreground group-hover:text-primary'
              }`}
            />
            <span className={liked ? 'text-primary' : 'text-foreground'}>
              {likes.toLocaleString()}
            </span>
          </motion.button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-foreground">{comments.length}</span>
          </button>

          <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors ml-auto">
            <Share2 className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-2">
          <p className="text-foreground">{caption}</p>
          <p className="text-sm text-muted-foreground mt-1">{time}</p>
        </div>

        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-border space-y-3"
          >
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center">
                  <span className="text-sm text-primary">
                    {comment.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-foreground">{comment.author}</span>
                    <span className="text-xs text-muted-foreground">{comment.time}</span>
                  </div>
                  <p className="text-muted-foreground">{comment.text}</p>
                </div>
              </div>
            ))}

            <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !newComment.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '...' : 'Post'}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
