import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit, Trash2, Eye, EyeOff, X, Save, FileText, AlertTriangle } from 'lucide-react';
import { apiService } from '../../api/apiService';
import { BlogPost } from '../../types';

export default function ManageBlogs() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await apiService.getBlogs();
      if (error) {
        setError(error.message || 'Failed to fetch blogs');
      } else if (data) {
        setPosts(data);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingPost?.title || !editingPost?.content) {
      alert('Please fill in the title and content.');
      return;
    }

    const { error } = await apiService.saveBlog(editingPost);
    if (!error) {
      setEditingPost(null);
      setIsNew(false);
      fetchPosts();
    } else {
      alert('Failed to save blog post.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    const { error } = await apiService.deleteBlog(id);
    if (!error) {
      fetchPosts();
    } else {
      alert('Failed to delete blog post.');
    }
  };

  const handleNew = () => {
    setEditingPost({
      title: '',
      excerpt: '',
      content: '',
      image: '',
      author: 'Golden Trip',
      status: 'draft',
      date: new Date().toISOString()
    });
    setIsNew(true);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost({ ...post });
    setIsNew(false);
  };

  const toggleStatus = async (post: BlogPost) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    await apiService.saveBlog({ ...post, status: newStatus });
    fetchPosts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--navy)' }}>Manage Blog</h1>
          <p className="text-gray-600 mt-1">Create, edit, and manage blog posts</p>
        </div>
        <button
          onClick={handleNew}
          className="px-6 py-3 rounded-xl text-white flex items-center gap-2 transition-all hover:shadow-lg"
          style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
        >
          <Plus className="w-5 h-5" />
          New Post
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-8 w-full bg-red-50 border-2 border-red-100 rounded-2xl p-6 text-red-800">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Database Table Missing</h3>
              <p className="mb-4">
                The <strong>"blogs"</strong> table does not exist in your Supabase project. 
                To fix this, please follow these 2 steps:
              </p>
              
              <div className="bg-white p-4 rounded-xl border border-red-200 mb-6 font-mono text-sm shadow-inner relative group">
                <p className="text-xs text-gray-500 mb-2 font-sans">Step 1: Copy this SQL command:</p>
                <pre className="text-gray-900 overflow-x-auto whitespace-pre-wrap">
{`CREATE TABLE IF NOT EXISTS blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  image text,
  category text DEFAULT 'Travel',
  author text DEFAULT 'Admin',
  date text,
  read_time text DEFAULT '5 min read',
  tags jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open_access" ON blogs FOR ALL USING (true) WITH CHECK (true);`}
                </pre>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <a 
                  href="https://supabase.com/dashboard/project/lfzumrxprnyakxtulqrx/sql" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-red-200"
                >
                  Step 2: Go to Supabase SQL Editor & Run
                </a>
                <button 
                  onClick={fetchPosts}
                  className="px-6 py-3 bg-white text-red-600 border-2 border-red-200 rounded-xl font-bold hover:bg-red-50 transition-all"
                >
                  I've ran it, Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-[var(--gold)] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg">No blog posts yet.</p>
          <button
            onClick={handleNew}
            className="mt-4 px-6 py-3 rounded-xl text-white transition-all hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
          >
            Create Your First Post
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-6 hover:shadow-md transition-shadow"
            >
              {/* Thumbnail */}
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                {post.image ? (
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold truncate" style={{ color: 'var(--navy)' }}>{post.title}</h3>
                <p className="text-sm text-gray-600 truncate mt-1">{post.excerpt || 'No excerpt'}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>{post.author}</span>
                  <span>•</span>
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {post.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleStatus(post)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                >
                  {post.status === 'published' ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-green-500" />
                  )}
                </button>
                <button
                  onClick={() => handleEdit(post)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Edit"
                >
                  <Edit className="w-5 h-5 text-blue-500" />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      <AnimatePresence>
        {editingPost && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" style={{ color: 'var(--navy)' }}>
                  {isNew ? 'New Blog Post' : 'Edit Blog Post'}
                </h3>
                <button
                  onClick={() => { setEditingPost(null); setIsNew(false); }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--navy)' }}>Title *</label>
                  <input
                    type="text"
                    value={editingPost.title || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--gold)] focus:outline-none"
                    placeholder="Enter blog post title..."
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--navy)' }}>Excerpt</label>
                  <input
                    type="text"
                    value={editingPost.excerpt || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--gold)] focus:outline-none"
                    placeholder="Short summary of the post..."
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--navy)' }}>Content *</label>
                  <textarea
                    rows={12}
                    value={editingPost.content || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--gold)] focus:outline-none resize-none"
                    placeholder="Write your blog post content here..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--navy)' }}>Image URL</label>
                    <input
                      type="url"
                      value={editingPost.image || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, image: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--gold)] focus:outline-none"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--navy)' }}>Author</label>
                    <input
                      type="text"
                      value={editingPost.author || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--gold)] focus:outline-none"
                      placeholder="Author name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--navy)' }}>Status</label>
                  <select
                    value={editingPost.status || 'draft'}
                    onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value as 'published' | 'draft' })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--gold)] focus:outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                {editingPost.image && (
                  <div>
                    <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--navy)' }}>Preview</label>
                    <img
                      src={editingPost.image}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => { setEditingPost(null); setIsNew(false); }}
                    className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-6 py-3 rounded-xl text-white transition-all hover:shadow-lg flex items-center justify-center gap-2 font-medium"
                    style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
                  >
                    <Save className="w-5 h-5" />
                    {isNew ? 'Create Post' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
