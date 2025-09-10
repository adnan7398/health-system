import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaGlobe, FaChevronDown } from "react-icons/fa";

const LanguageSelector = ({ variant = "default" }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [languageVersion, setLanguageVersion] = useState(0);
  const rootRef = useRef(null);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
    { code: "ml", name: "മലയാളം", flag: "🇮🇳" },
    { code: "es", name: "Español", flag: "🇪🇸" },
  ];

  const changeLanguage = (languageCode) => {
    try {
      i18n.changeLanguage(languageCode);
      localStorage.setItem("i18nextLng", languageCode);
      setIsOpen(false);
    } catch (e) {
      console.error("Language change failed:", e);
    }
  };

  const normalizedCode = (i18n.resolvedLanguage || i18n.language || "en").split("-")[0];
  const currentLanguage = languages.find((lang) => lang.code === normalizedCode);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (isOpen && rootRef.current && !rootRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    const onLanguageChanged = () => {
      setLanguageVersion((v) => v + 1);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    i18n.on("languageChanged", onLanguageChanged);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
      i18n.off("languageChanged", onLanguageChanged);
    };
  }, [isOpen, i18n]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={
          variant === "icon"
            ? "flex items-center justify-center w-9 h-9 rounded-md text-white hover:text-teal-100 bg-transparent focus:outline-none focus:ring-0 focus-visible:outline-none"
            : "flex items-center gap-2 text-slate-700 hover:text-emerald-700 transition-colors duration-150 text-sm font-medium bg-white px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-0 focus-visible:outline-none"
        }
        aria-haspopup="menu"
        aria-expanded={isOpen}
        title={variant === "icon" ? "Language" : undefined}
      >
        <FaGlobe className={variant === "icon" ? "text-white text-lg" : "text-emerald-600 text-xs"} />
        {variant !== "icon" && (
          <>
            <span className="hidden sm:inline">Language</span>
            <span className="hidden sm:inline">{currentLanguage?.name}</span>
            <FaChevronDown className="text-slate-600 text-xs transition-colors duration-150" />
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[100]">
          {languages.map(({ code, name, flag }) => (
            <button
              key={code}
              onClick={() => changeLanguage(code)}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2 ${
                normalizedCode === code
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-gray-700"
              }`}
            >
              <span className="text-base">{flag}</span>
              <span className="font-medium">{name}</span>
              {normalizedCode === code && (
                <div className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
