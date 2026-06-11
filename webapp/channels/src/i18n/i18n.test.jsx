// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {getAllLanguages, getLanguageInfo, getLanguages, isLanguageAvailable, languages, normalizeLocale} from './i18n';

describe('i18n', () => {
    test('getAllLanguages returns only zh-CN', () => {
        expect(getAllLanguages()).toBe(languages);
        expect(getAllLanguages(true)).toBe(languages);
        expect(languages).toHaveProperty('zh-CN');
        expect(Object.keys(languages)).toHaveLength(1);
    });

    test('getLanguages returns only zh-CN', () => {
        const state = {
            entities: {
                general: {
                    config: {},
                },
            },
        };

        expect(getLanguages(state)).toBe(languages);
    });

    test('getLanguageInfo returns zh-CN info', () => {
        const info = getLanguageInfo('zh-CN');
        expect(info).toBeDefined();
        expect(info.value).toBe('zh-CN');
    });

    test('isLanguageAvailable', () => {
        const state = {
            entities: {
                general: {
                    config: {},
                },
            },
        };

        // zh-CN is always available
        expect(isLanguageAvailable(state, 'zh-CN')).toBe(true);

        // Any locale normalizes to zh-CN which is available
        expect(isLanguageAvailable(state, 'en')).toBe(true);
    });

    test('normalizeLocale always returns zh-CN', () => {
        expect(normalizeLocale('zh-CN')).toBe('zh-CN');
        expect(normalizeLocale('en')).toBe('zh-CN');
        expect(normalizeLocale('fr')).toBe('zh-CN');
        expect(normalizeLocale('')).toBe('zh-CN');
    });
});
