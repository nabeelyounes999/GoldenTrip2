import { useParams, Link } from 'react-router';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../api/apiService';
import { BlogPost } from '../types';

export default function BlogDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await apiService.getBlogs();
      if (!error && data) {
        const found = data.find((p: BlogPost) => p.slug === slug);
        setPost(found || null);
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-[var(--gold)] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">{t('blogs.loading')}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl mb-4" style={{ color: 'var(--navy)' }}>Post not found</h2>
          <Link to="/blog" className="text-[var(--gold)] hover:underline">
            {t('blogs.backToBlog')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Hero Image */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={post.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200'}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                {t('blogs.backToBlog')}
              </Link>
              <h1 className="text-3xl sm:text-5xl text-white mb-4">{post.title}</h1>
              <div className="flex items-center gap-6 text-gray-200">
                <span className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t('blogs.by')} {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {new Date(post.date).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 md:p-12 shadow-lg"
          >
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
              {post.content}
            </div>
          </motion.div>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white transition-all hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
              {t('blogs.backToBlog')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
