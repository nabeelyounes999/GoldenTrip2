import { motion } from 'motion/react';
import { Shield, FileText, Cookie, RotateCcw } from 'lucide-react';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';

interface LegalPageProps {
  title: string;
  icon: 'shield' | 'file' | 'cookie' | 'refund';
  content: string;
  lastUpdated?: string;
}

export default function LegalPage({ title, icon, content, lastUpdated = new Date().toLocaleDateString() }: LegalPageProps) {
  const Icon = {
    shield: Shield,
    file: FileText,
    cookie: Cookie,
    refund: RotateCcw
  }[icon];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 mb-6" style={{ color: 'var(--gold)' }}>
              <Icon className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--navy)' }}>{title}</h1>
            <p className="text-gray-500">Last Updated: {lastUpdated}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg max-w-none bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm"
          >
            <div className="whitespace-pre-line text-gray-700 leading-relaxed">
              {content}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
