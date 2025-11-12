import { useLanguage } from "@/contexts/LanguageContext";
import { Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MR from 'country-flag-icons/react/3x2/MR';
import FR from 'country-flag-icons/react/3x2/FR';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    {
      code: 'ar',
      name: 'العربية',
      FlagComponent: MR,
      nativeName: 'العربية'
    },
    {
      code: 'fr',
      name: 'Français',
      FlagComponent: FR,
      nativeName: 'Français'
    }
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg px-4 py-2 rounded-full"
        >
          <Globe className="w-5 h-5 text-blue-600" />
          <currentLanguage.FlagComponent className="w-6 h-4 rounded-sm" />
          <span className="text-base font-semibold text-gray-700">
            {currentLanguage.code.toUpperCase()}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-white/95 backdrop-blur-md border-2 border-blue-200 shadow-2xl rounded-2xl p-2 mt-2"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as 'ar' | 'fr')}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300
              ${language === lang.code 
                ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white shadow-lg' 
                : 'hover:bg-blue-50 text-gray-700'
              }
            `}
          >
            <lang.FlagComponent className="w-8 h-6 rounded-sm shadow-sm" />
            <div className="flex flex-col">
              <span className={`font-semibold ${language === lang.code ? 'text-white' : 'text-gray-800'}`}>
                {lang.nativeName}
              </span>
              <span className={`text-xs ${language === lang.code ? 'text-blue-100' : 'text-gray-500'}`}>
                {lang.name}
              </span>
            </div>
            {language === lang.code && (
              <span className="mr-auto text-white">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

