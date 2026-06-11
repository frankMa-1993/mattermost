// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {langFiles} from 'i18n/imports';

import en from 'i18n/en.json';
import {ActionTypes} from 'utils/constants';

import type {ActionFuncAsync, ThunkActionFunc} from 'types/store';
import type {Translations} from 'types/store/i18n';

export type TranslationPluginFunction = (locale: string) => Translations

// Simplified for Chinese-only (zh-CN) support
// Plugin translation sources removed - only zh-CN is supported
export function registerPluginTranslationsSource(pluginId: string, sourceFunction: (locale: string) => Translations): ThunkActionFunc<void> {
    return () => {
        // No-op: plugin translations not supported in zh-CN-only mode
    };
}

export function unregisterPluginTranslationsSource(pluginId: string) {
    // No-op
}

export function loadTranslations(locale: string, url: string | Translations): ActionFuncAsync {
    return async (dispatch) => {
        // Always load zh-CN translations (English as base + zh-CN overrides)
        const translations = {...en};
        Object.assign(translations, langFiles['zh-CN']);
        dispatch({
            type: ActionTypes.RECEIVED_TRANSLATIONS,
            data: {
                locale: 'zh-CN',
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
