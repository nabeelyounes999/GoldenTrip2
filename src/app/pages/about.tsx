import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, Eye, Award, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../api/apiService';
import { TeamMember } from '../types';

export default function About() {
  const { t } = useTranslation();
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamRes, settingsRes] = await Promise.all([
        apiService.getTeamMembers(),
        apiService.getSettings()
      ]);
      
      if (!teamRes.error && teamRes.data && teamRes.data.length > 0) {
        setTeamMembers(teamRes.data);
      } else {
        // Fallback default team
        setTeamMembers([
          {
            name: 'Thabet',
            role: 'Founder & CEO',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
            bio: 'Passionate about creating unforgettable travel experiences.'
          },
          {
            name: 'Sarah Johnson',
            role: 'Travel Operations Manager',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
            bio: 'Travel enthusiast with 15+ years in the tourism industry'
          },
          {
            name: 'Michael Chen',
            role: 'Chief Travel Officer',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
            bio: 'Visited 87 countries and counting, passionate about cultural experiences'
          },
          {
            name: 'Emma Williams',
            role: 'Head of Customer Experience',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            bio: 'Dedicated to making every journey exceptional and memorable'
          }
        ]);
      }
      
      if (!settingsRes.error && settingsRes.data) {
        setSettings(settingsRes.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { number: '50K+', label: t('about.stats.travelers', 'Happy Travelers') },
    { number: '100+', label: t('about.stats.destinations', 'Destinations') },
    { number: '15+', label: t('about.stats.experience', 'Years Experience') },
    { number: '98%', label: t('about.stats.satisfaction', 'Satisfaction Rate') }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Hero */}
      <section className="bg-[var(--navy)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl text-white mb-4">{settings?.aboutContent?.heroTitle || t('about.hero.title', 'About Golden Trip')}</h1>
            <p className="text-xl text-gray-200">{settings?.aboutContent?.heroSubtitle || t('about.hero.subtitle', 'Creating unforgettable travel experiences since 2009')}</p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl mb-6 text-center" style={{ color: 'var(--navy)' }}>{settings?.aboutContent?.storyTitle || t('about.story.title', 'Our Story')}</h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  {settings?.aboutContent?.storyP1 || t('about.story.p1', 'Golden Trip was born from a simple belief: that travel has the power to transform lives, broaden perspectives, and create lasting memories. Founded in 2009 by a group of passionate travelers, we set out to make world-class travel experiences accessible to everyone.')}
                </p>
                <p>
                  {settings?.aboutContent?.storyP2 || t('about.story.p2', 'What started as a small travel agency has grown into a trusted global brand, serving over 50,000 satisfied travelers. Our commitment to excellence, attention to detail, and genuine care for our customers has remained unchanged since day one.')}
                </p>
                <p>
                  {settings?.aboutContent?.storyP3 || t('about.story.p3', 'Today, we continue to innovate and evolve, offering carefully curated experiences across 100+ destinations worldwide. Every journey we plan is crafted with the same passion and dedication that inspired our founders.')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl mb-2" style={{ color: 'var(--gold)' }}>
                  {stat.number}
                </div>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                   style={{ background: 'var(--gold)' }}>
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl mb-4" style={{ color: 'var(--navy)' }}>{settings?.aboutContent?.missionTitle || t('about.mission.title', 'Our Mission')}</h3>
              <p className="text-gray-700 leading-relaxed">
                {settings?.aboutContent?.missionText || t('about.mission.text', 'To inspire and enable people to explore the world, creating transformative travel experiences that enrich lives and foster global understanding.')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gray-50 rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                   style={{ background: 'var(--gold)' }}>
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl mb-4" style={{ color: 'var(--navy)' }}>{settings?.aboutContent?.visionTitle || t('about.vision.title', 'Our Vision')}</h3>
              <p className="text-gray-700 leading-relaxed">
                {settings?.aboutContent?.visionText || t('about.vision.text', "To be the world's most trusted and innovative travel company, connecting people with extraordinary destinations and authentic experiences.")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                   style={{ background: 'var(--gold)' }}>
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl mb-4" style={{ color: 'var(--navy)' }}>{settings?.aboutContent?.valuesTitle || t('about.values.title', 'Our Values')}</h3>
              <p className="text-gray-700 leading-relaxed">
                {settings?.aboutContent?.valuesText || t('about.values.text', "Excellence, integrity, and customer satisfaction guide everything we do. We're committed to sustainable and responsible travel practices.")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl mb-4" style={{ color: 'var(--navy)' }}>{t('about.team.title', 'Meet Our Team')}</h2>
            <p className="text-xl text-gray-600">{t('about.team.subtitle', 'Passionate travel experts dedicated to your journey')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl mb-1" style={{ color: 'var(--navy)' }}>{member.name}</h3>
                  <p className="text-sm mb-3" style={{ color: 'var(--gold)' }}>{member.role}</p>
                  <p className="text-sm text-gray-600">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[var(--navy)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl text-white mb-6">{t('about.cta.title', 'Ready to Start Your Adventure?')}</h2>
            <p className="text-xl text-gray-200 mb-8">
              {t('about.cta.subtitle', 'Join thousands of satisfied travelers and discover the world with Golden Trip')}
            </p>
            <a
              href="/destinations"
              className="inline-block px-8 py-4 rounded-full text-white text-lg transition-all hover:shadow-2xl"
              style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
            >
              {t('about.cta.button', 'Explore Destinations')}
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
