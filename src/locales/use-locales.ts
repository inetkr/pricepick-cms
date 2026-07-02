'use client';

import { useTranslation } from 'react-i18next';

import { allLangs } from './all-langs';
import { fallbackLng } from './config-locales';

// ----------------------------------------------------------------------

export function useTranslate(ns?: string) {
  const { t, i18n } = useTranslation(ns);

  const fallback = allLangs.filter((lang) => lang.value === fallbackLng)[0];

  const currentLang = allLangs.find((lang) => lang.value === i18n.resolvedLanguage);


  return {
    t,
    i18n,
    currentLang: currentLang ?? fallback,
  };
}
