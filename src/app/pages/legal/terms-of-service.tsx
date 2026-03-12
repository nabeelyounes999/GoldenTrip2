import { useState, useEffect } from 'react';
import LegalPage from './LegalPage';
import { apiService } from '../../api/apiService';

export default function TermsOfService() {
  const [content, setContent] = useState('Loading...');

  useEffect(() => {
    apiService.getSettings().then(({ data }) => {
      if (data?.legalPages?.termsOfService) {
        setContent(data.legalPages.termsOfService);
      }
    });
  }, []);

  return (
    <LegalPage 
      title="Terms of Service" 
      icon="file" 
      content={content} 
    />
  );
}
