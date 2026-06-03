// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Client4} from 'mattermost-redux/client';

import {langFiles} from 'i18n/imports';
import {normalizeLocale} from 'i18n/i18n';
import {getCurrentLocale, getTranslations} from 'selectors/i18n';

import en from 'i18n/en.json';
import {ActionTypes} from 'utils/constants';

import type {ActionFuncAsync, ThunkActionFunc} from 'types/store';
import type {Translations} from 'types/store/i18n';

const pluginTranslationSources: Record<string, TranslationPluginFunction> = {};

export type TranslationPluginFunction = (locale: string) => Translations

function getBundledLocaleTranslations(locale: string, url: string | Translations): Translations | undefined {
    if (typeof url === 'object' && url !== null) {
        return url;
    }

    return langFiles[normalizeLocale(locale)];
}

export function registerPluginTranslationsSource(pluginId: string, sourceFunction: TranslationPluginFunction): ThunkActionFunc<void> {
    pluginTranslationSources[pluginId] = sourceFunction;
    return (dispatch, getState) => {
        const state = getState();
        const locale = getCurrentLocale(state);
        const immutableTranslations = getTranslations(state, locale);
        const translations = {};
        Object.assign(translations, immutableTranslations);
        if (immutableTranslations) {
            Object.assign(translations, sourceFunction(locale));
            dispatch({
                type: ActionTypes.RECEIVED_TRANSLATIONS,
                data: {
                    locale,
                    translations,
                },
            });
        }
    };
}

export function unregisterPluginTranslationsSource(pluginId: string) {
    Reflect.deleteProperty(pluginTranslationSources, pluginId);
}

export function loadTranslations(locale: string, url: string | Translations): ActionFuncAsync {
    const normalizedLocale = normalizeLocale(locale);

    return async (dispatch) => {
        const translations = {...en};
        Object.values(pluginTranslationSources).forEach((pluginFunc) => {
            Object.assign(translations, pluginFunc(normalizedLocale));
        });

        if (normalizedLocale !== 'en') {
            const bundledTranslations = getBundledLocaleTranslations(normalizedLocale, url);
            if (bundledTranslations) {
                Object.assign(translations, bundledTranslations);
            } else if (typeof url === 'string' && url) {
                try {
                    const serverTranslations = await Client4.getTranslations(url);
                    Object.assign(translations, serverTranslations);
                } catch (error) {
                    console.error(error); //eslint-disable-line no-console
                }
            }
        }
        dispatch({
            type: ActionTypes.RECEIVED_TRANSLATIONS,
            data: {
                locale: normalizedLocale,
                translations,
            },
        });
        return {data: true};
    };
}

export function setReadout(message: string) {
    return {
        type: ActionTypes.SET_READOUT,
        data: message,
    };
}
