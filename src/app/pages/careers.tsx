import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, Send, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../api/apiService';
import { Job } from '../types';

export default function Careers() {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: ''
  });

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await apiService.getJobs();
      if (!error && data) {
        setJobs(data);
      }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile || !selectedJob) {
      alert(t('careers.modal.alertMissing'));
      return;
    }

    setSubmitting(true);
    try {
      // 1. Upload Resume
      const { data: resumeUrl, error: uploadError } = await apiService.uploadResume(resumeFile);
      if (uploadError) throw uploadError;

      // 2. Save Application
      const { error: saveError } = await apiService.saveApplication({
        jobId: selectedJob,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        coverLetter: formData.coverLetter,
        resumeUrl: resumeUrl as string,
        status: 'new'
      });

      if (saveError) throw saveError;

      alert(t('careers.modal.alertSuccess'));
      setFormData({ name: '', email: '', phone: '', coverLetter: '' });
      setResumeFile(null);
      setSelectedJob(null);
    } catch (error: any) {
      console.error('Error submitting application:', error);
      alert(t('careers.modal.alertFail') + (error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Hero */}
      <section className="bg-[var(--navy)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl text-white mb-4">{t('careers.hero.title')}</h1>
            <p className="text-xl text-gray-200">{t('careers.hero.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Company Culture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 md:p-12 shadow-lg mb-16"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl mb-6" style={{ color: 'var(--navy)' }}>{t('careers.culture.title')}</h2>
            <p className="text-lg text-gray-700 mb-8">
              {t('careers.culture.desc')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-gray-50">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                     style={{ background: 'var(--gold)' }}>
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-xl mb-2" style={{ color: 'var(--navy)' }}>{t('careers.culture.benefitsTitle')}</h3>
                <p className="text-gray-600">{t('careers.culture.benefitsDesc')}</p>
              </div>
              <div className="p-6 rounded-xl bg-gray-50">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                     style={{ background: 'var(--gold)' }}>
                  <span className="text-2xl">💼</span>
                </div>
                <h3 className="text-xl mb-2" style={{ color: 'var(--navy)' }}>{t('careers.culture.growthTitle')}</h3>
                <p className="text-gray-600">{t('careers.culture.growthDesc')}</p>
              </div>
              <div className="p-6 rounded-xl bg-gray-50">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                     style={{ background: 'var(--gold)' }}>
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-xl mb-2" style={{ color: 'var(--navy)' }}>{t('careers.culture.teamTitle')}</h3>
                <p className="text-gray-600">{t('careers.culture.teamDesc')}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Job Listings */}
        <div>
          <h2 className="text-4xl mb-8" style={{ color: 'var(--navy)' }}>{t('careers.positions.title')}</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[var(--gold)] rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500">{t('careers.positions.loading')}</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <p className="text-gray-500">{t('careers.positions.none')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl mb-2" style={{ color: 'var(--navy)' }}>{job.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6">{job.description}</p>

                  <div className="mb-6">
                    <h4 className="text-sm mb-3" style={{ color: 'var(--navy)' }}>{t('careers.positions.requirements')}</h4>
                    <ul className="space-y-2">
                      {(job.requirements || []).map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--gold)' }} />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t">
                    <span className="text-sm text-gray-500">{t('careers.positions.posted')} {new Date(job.posted).toLocaleDateString()}</span>
                    <button
                      onClick={() => setSelectedJob(job.id)}
                      className="px-6 py-2.5 rounded-full text-white transition-all hover:shadow-lg"
                      style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
                    >
                      {t('careers.positions.applyNow')}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Application Modal */}
        <AnimatePresence>
          {selectedJob && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-3xl" style={{ color: 'var(--navy)' }}>{t('careers.modal.title')}</h3>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
                  >
                    ×
                  </button>
                </div>

                <div className="mb-6 p-4 rounded-xl bg-gray-50">
                  <h4 className="text-xl mb-1" style={{ color: 'var(--navy)' }}>
                    {jobs.find(j => j.id === selectedJob)?.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {jobs.find(j => j.id === selectedJob)?.location} • {jobs.find(j => j.id === selectedJob)?.type}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--navy)' }}>
                      {t('careers.modal.fullName')}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-100 focus:border-[var(--gold)] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--navy)' }}>
                        {t('careers.modal.email')}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-100 focus:border-[var(--gold)] focus:outline-none transition-colors"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--navy)' }}>
                        {t('careers.modal.phone')}
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-100 focus:border-[var(--gold)] focus:outline-none transition-colors"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--navy)' }}>
                      {t('careers.modal.uploadCv')}
                    </label>
                    <div 
                      onClick={() => document.getElementById('resume-upload')?.click()}
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group ${resumeFile ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-[var(--gold)] hover:bg-gray-50'}`}
                    >
                      <Upload className={`w-12 h-12 mx-auto mb-3 transition-colors ${resumeFile ? 'text-green-500' : 'text-gray-400 group-hover:text-[var(--gold)]'}`} />
                      <p className="text-gray-600 mb-1">
                        {resumeFile ? `${t('careers.modal.selected')} ${resumeFile.name}` : t('careers.modal.clickUpload')}
                      </p>
                      <p className="text-sm text-gray-500">{t('careers.modal.fileTypes')}</p>
                      <input 
                        id="resume-upload"
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.doc,.docx" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setResumeFile(file);
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--navy)' }}>
                      {t('careers.modal.coverLetter')}
                    </label>
                    <textarea
                      rows={4}
                      value={formData.coverLetter}
                      onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-100 focus:border-[var(--gold)] focus:outline-none resize-none transition-colors"
                      placeholder={t('careers.modal.coverLetterPlaceholder')}
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedJob(null)}
                      className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-100 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                    >
                      {t('careers.modal.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-6 py-3 rounded-xl text-white transition-all hover:shadow-lg flex items-center justify-center gap-2 font-medium disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
                    >
                      <Send className="w-5 h-5" />
                      {submitting ? t('careers.modal.submitting') : t('careers.modal.submit')}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
