import { useState, useEffect } from 'react';
import LegalPage from './LegalPage';
import { apiService } from '../../api/apiService';

export default function PrivacyPolicy() {
  const [content, setContent] = useState('Loading...');

  useEffect(() => {
    apiService.getSettings().then(({ data }) => {
      if (data?.legalPages?.privacyPolicy) {
        setContent(data.legalPages.privacyPolicy);
      }
    });
  }, []);

  return (
    <LegalPage 
      title="Privacy Policy" 
      icon="shield" 
      content={content} 
    />
  );
}
