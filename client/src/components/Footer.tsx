import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, Mail } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-xl font-bold mb-4">{t('contactTitle')}</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href={`tel:${t('contactPhone')}`} className="hover:text-orange-400 transition">
                  {t('contactPhone')}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${t('contactEmail')}`} className="hover:text-orange-400 transition">
                  {t('contactEmail')}
                </a>
              </div>
              <div className="text-gray-400">
                {t('contactWebsite')}
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src="/scl-logo-medium.webp" srcSet="/scl-logo-small.webp 96w, /scl-logo-medium.webp 200w" sizes="200px" alt="SCL Communication" className="h-16" loading="lazy" width="200" height="133" />
              <span className="text-2xl text-orange-400">×</span>
              <img src="/moov-mauritel-logo.webp" alt="Moov Mauritel" className="h-16" />
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-gray-400">{t('footerAgent')}</p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center text-gray-400">
          <p>{t('footerRights')}</p>
        </div>
      </div>
    </footer>
  );
}

