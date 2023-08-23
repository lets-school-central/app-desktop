import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enTranslations from "./locales/en/translations.json";

void i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: "en",
		lng: "en",
		resources: {
			en: {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				translations: enTranslations,
			},
		},
		ns: ["translations"],
		defaultNS: "translations",
	});

i18n.languages = ["en"];

export default i18n;
