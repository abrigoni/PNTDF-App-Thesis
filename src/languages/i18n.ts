import {I18n} from 'i18n-js';
import es from './translations/es.json';
import en from './translations/en.json';

const i18n = new I18n({
  en,
  es,
});

// i18n.store(es);
// i18n.store(en);

i18n.defaultLocale = 'es';
i18n.locale = 'es';

export default i18n;

// const setI18nConfig = async (appLanguage: 'es' | 'en' | 'best') => {

//   // fallback if no available language fits
//   let languageTag;
//   if (!!appLanguage && appLanguage !== 'best') {
//     languageTag = translationGetters[appLanguage]
//       ? appLanguage
//       : fallback.languageTag;
//   } else {
//     const translations: string[] = Object.keys(translationGetters);
//     languageTag =
//       RNLocalize.findBestAvailableLanguage(translations)?.languageTag ||
//       fallback.languageTag;
//   }

//   // set i18n-js config
//   I18n.translations = translationGetters;
//   I18n.locale = languageTag;

//   return appLanguage;
// };

// // This function is a wrapper to avoid exception wich leads in a crash
// const translateOrFallback = (initialMsg: string, options?: TranslateOptions) => {
//   // We tried to translate something else than a string
//   // The native I18n function will simply crash instead of rejecting the attempt with an error message
//   if (typeof initialMsg !== 'string') {
//     __DEV__ &&
//       console.error(
//         `I18n: you must give a string to translate instead of "${typeof initialMsg}"`,
//       );

//     return ''; // We don't return any message as we don't know what to send
//   }

//   let localMsg = I18n.t(initialMsg, options);

//   // The translation does not exist, the default message is not very sexy
//   // Instead we return the message we tried to translate
//   const missingTranslationRegex = /^\[missing ".*" translation\]$/;
//   if (missingTranslationRegex.test(localMsg)) {
//     __DEV__ &&
//       console.warn(
//         `translation "${initialMsg}" does not exists in translations files`,
//       );

//     return initialMsg;
//   }

//   return localMsg;
// };

// export default {
//   setI18nConfig,
//   I18n,
//   t: translateOrFallback,
//   RNLocalize,
// };
