import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../api/apiService';
import { BlogPost } from '../types';

export default function Blogs() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await apiService.getBlogs();
      if (!error && data) {
        setPosts(data.filter((p: BlogPost) => p.status === 'published'));
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-[var(--navy)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl sm:text-5xl text-white mb-4">{t('blogs.hero.title')}</h1>
            <p className="text-xl text-gray-200">{t('blogs.hero.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-[var(--gold)] rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">{t('blogs.loading')}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">{t('blogs.noPosts')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/blog/${post.slug}`} className="group">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={post.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600'}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {post.author}
                          </span>
                        </div>
                        <h3 className="text-xl mb-3" style={{ color: 'var(--navy)' }}>
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 flex-1 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--gold)' }}>
                          {t('blogs.readMore')}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
