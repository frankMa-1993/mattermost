// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {General} from 'mattermost-redux/constants';
import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {getCurrentUserLocale} from 'mattermost-redux/selectors/entities/i18n';

import * as I18n from 'i18n/i18n';

import type {GlobalState} from 'types/store';
import type {Translations} from 'types/store/i18n';

// This is a placeholder for if we ever implement browser-locale detection
export function getCurrentLocale(state: GlobalState): string {
    // If locale is provided in query parameter and the user is not logged in, we try get locale from param
    const localeFromParam = I18n.normalizeLocale((new URLSearchParams(window.location?.search)).get('locale') || '');
    const configuredDefaultLocale = I18n.normalizeLocale(getConfig(state).DefaultClientLocale || '');
    const defaultLocale: string | undefined =
        localeFromParam && I18n.isLanguageAvailable(state, localeFromParam) ? localeFromParam : configuredDefaultLocale || undefined;

    const currentLocale = I18n.normalizeLocale(getCurrentUserLocale(state, defaultLocale || General.DEFAULT_LOCALE));
    if (I18n.isLanguageAvailable(state, currentLocale)) {
        return currentLocale;
    }

    // Fall back to the configured DefaultClientLocale, then to General.DEFAULT_LOCALE as last resort
    if (defaultLocale && I18n.isLanguageAvailable(state, defaultLocale)) {
        return defaultLocale;
    }

    return General.DEFAULT_LOCALE;
}

export function getTranslations(state: GlobalState, locale: string): Translations {
    const normalizedLocale = I18n.normalizeLocale(locale);
    const localeInfo = I18n.getLanguageInfo(normalizedLocale);

    let translations;
    if (localeInfo) {
        translations = state.views.i18n.translations[normalizedLocale];
    } else {
        // Default to English if an unsupported locale is specified
        translations = state.views.i18n.translations.en;
    }

    return translations;
}
