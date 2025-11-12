import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Search, MapPin, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { t, dir } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logos */}
          <div className="flex items-center gap-2 md:gap-3">
            <img 
              src="/scl-logo-small.webp" 
              srcSet="/scl-logo-small.webp 96w, /scl-logo-medium.webp 200w" 
              sizes="(max-width: 768px) 96px, 200px"
              alt="SCL Communication" 
              className="h-8 md:h-12" 
              loading="eager"
              width="96"
              height="64"
            />
            <span className="text-lg md:text-xl text-gray-400">×</span>
            <img 
              src="/moov-mauritel-logo-small.webp" 
              srcSet="/moov-mauritel-logo-small.webp 107w, /moov-mauritel-logo-medium.webp 200w" 
              sizes="(max-width: 768px) 107px, 200px"
              alt="Moov Mauritel" 
              className="h-8 md:h-12" 
              loading="eager"
              width="107"
              height="64"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 items-center">
            <a href="/" className="text-gray-700 hover:text-blue-600 transition">
              {t('home')}
            </a>
            <a href="#packages" className="text-gray-700 hover:text-blue-600 transition">
              {t('packagesTitle')}
            </a>
            <a href="/track" className="text-gray-700 hover:text-blue-600 transition flex items-center gap-1">
              <Search className="w-4 h-4" />
              {t('trackOrder')}
            </a>
            <a href="/coverage" className="text-gray-700 hover:text-blue-600 transition flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {t('coverage')}
            </a>
            <LanguageSwitcher />
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4 space-y-3">
            <a
              href="/"
              className="block text-gray-700 hover:text-blue-600 transition py-2 px-4 rounded hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('home')}
            </a>
            <a
              href="#packages"
              className="block text-gray-700 hover:text-blue-600 transition py-2 px-4 rounded hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('packagesTitle')}
            </a>
            <a
              href="/track"
              className="block text-gray-700 hover:text-blue-600 transition py-2 px-4 rounded hover:bg-gray-50 flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Search className="w-4 h-4" />
              {t('trackOrder')}
            </a>
            <a
              href="/coverage"
              className="block text-gray-700 hover:text-blue-600 transition py-2 px-4 rounded hover:bg-gray-50 flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <MapPin className="w-4 h-4" />
              {t('coverage')}
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}

