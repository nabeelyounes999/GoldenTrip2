import { useState, useEffect } from 'react';
import LegalPage from './LegalPage';
import { apiService } from '../../api/apiService';

export default function RefundPolicy() {
  const [content, setContent] = useState('Loading...');

  useEffect(() => {
    apiService.getSettings().then(({ data }) => {
      if (data?.legalPages?.refundPolicy) {
        setContent(data.legalPages.refundPolicy);
      }
    });
  }, []);

  return (
    <LegalPage 
      title="Refund Policy" 
      icon="refund" 
      content={content} 
    />
  );
}
