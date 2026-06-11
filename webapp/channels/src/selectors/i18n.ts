// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import type {GlobalState} from 'types/store';
import type {Translations} from 'types/store/i18n';

// Simplified for Chinese-only (zh-CN) support
export function getCurrentLocale(state: GlobalState): string {
    return 'zh-CN';
}

export function getTranslations(state: GlobalState, locale: string): Translations {
    return state.views.i18n.translations['zh-CN'];
}
