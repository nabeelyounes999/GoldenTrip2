import { useState, useEffect } from 'react';
import LegalPage from './LegalPage';
import { apiService } from '../../api/apiService';

export default function CookiePolicy() {
  const [content, setContent] = useState('Loading...');

  useEffect(() => {
    apiService.getSettings().then(({ data }) => {
      if (data?.legalPages?.cookiePolicy) {
        setContent(data.legalPages.cookiePolicy);
      }
    });
  }, []);

  return (
    <LegalPage 
      title="Cookie Policy" 
      icon="cookie" 
      content={content} 
    />
  );
}
