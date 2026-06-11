// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/**
 * @typedef {} Language
 */

import {getConfig} from 'mattermost-redux/selectors/entities/general';

import {langFiles, langIDs, langLabels} from './imports';

// Simplified for Chinese-only (zh-CN) support
export const languages = {
    'zh-CN': {
        value: 'zh-CN',
        name: '中文（中国大陆）',
        order: 0,
        url: langFiles['zh-CN'],
    },
};

export function normalizeLocale(locale) {
    // Always return zh-CN since only Chinese is supported
    return 'zh-CN';
}

export function getAllLanguages(includeExperimental) {
    return languages;
}

/**
 * @param {import('types/store').GlobalState} state
 * @returns {Record<string, Language>}
 */
export function getLanguages(state) {
    return languages;
}

export function getLanguageInfo(locale) {
    return languages['zh-CN'];
}

/**
 * @param {import('types/store').GlobalState} state
 * @param {string} locale
 * @returns {boolean}
 */
export function isLanguageAvailable(state, locale) {
    return normalizeLocale(locale) === 'zh-CN';
}
