import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const changeLanguage = (lang: 'en' | 'es') => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          currentLang === 'en'
            ? 'bg-primary text-white shadow-md hover:bg-primary-600'
            : 'bg-neutral-bg text-neutral-text border border-neutral-border shadow-md hover:shadow-lg'
        }`}
        style={currentLang === 'en' ? { backgroundColor: 'var(--color-primary)', color: '#ffffff' } : undefined}
      >
        🇺🇸 English
      </button>
      <button
        onClick={() => changeLanguage('es')}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          currentLang === 'es'
            ? 'bg-primary text-white shadow-md hover:bg-primary-600'
            : 'bg-neutral-bg text-neutral-text border border-neutral-border shadow-md hover:shadow-lg'
        }`}
        style={currentLang === 'es' ? { backgroundColor: 'var(--color-primary)', color: '#ffffff' } : undefined}
      >
        🇪🇸 Español
      </button>
    </div>
  );
};

export default LanguageSwitcher;
