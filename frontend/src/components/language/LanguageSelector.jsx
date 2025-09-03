import React from "react";
import { useTranslation } from "react-i18next";
import { FaGlobe, FaChevronDown } from "react-icons/fa";

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
    { code: "ml", name: "മലയാളം", flag: "🇮🇳" },
    { code: "es", name: "Español", flag: "🇪🇸" },
  ];

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem("language", languageCode);
  };

  const currentLanguage = languages.find(
    (lang) => lang.code === (i18n.language || "en")
  );

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 text-white hover:text-teal-100 transition-colors duration-200 text-sm font-medium bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg">
        <FaGlobe className="text-white text-xs" />
        <span className="hidden sm:inline">Language:</span>
        <span className="hidden sm:inline">{currentLanguage?.name}</span>
        <FaChevronDown className="text-white text-xs transition-colors duration-200" />
      </button>

      <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map(({ code, name, flag }) => (
          <button
            key={code}
            onClick={() => changeLanguage(code)}
            className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2 ${
              i18n.language === code
                ? "text-teal-600 bg-teal-50"
                : "text-gray-700"
            }`}
          >
            <span className="text-base">{flag}</span>
            <span className="font-medium">{name}</span>
            {i18n.language === code && (
              <div className="ml-auto w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
