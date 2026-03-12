import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { useTranslation } from 'react-i18next';
import { router } from './routes';

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
