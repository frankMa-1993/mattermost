// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {getCurrentLocale, getTranslations} from 'selectors/i18n';

describe('selectors/i18n', () => {
    describe('getCurrentLocale', () => {
        test('always returns zh-CN', () => {
            const state = {
                entities: {
                    general: {
                        config: {},
                    },
                    users: {
                        currentUserId: '',
                        profiles: {},
                    },
                },
            };

            expect(getCurrentLocale(state)).toEqual('zh-CN');
        });

        test('returns zh-CN regardless of user locale', () => {
            const state = {
                entities: {
                    general: {
                        config: {
                            DefaultClientLocale: 'fr',
                        },
                    },
                    users: {
                        currentUserId: 'abcd',
                        profiles: {
                            abcd: {
                                locale: 'de',
                            },
                        },
                    },
                },
            };

            expect(getCurrentLocale(state)).toEqual('zh-CN');
        });

        test('returns zh-CN regardless of config', () => {
            const state = {
                entities: {
                    general: {
                        config: {
                            DefaultClientLocale: 'en',
                            AvailableLocales: 'en,fr,de',
                        },
                    },
                    users: {
                        currentUserId: 'abcd',
                        profiles: {
                            abcd: {
                                locale: 'en',
                            },
                        },
                    },
                },
            };

            expect(getCurrentLocale(state)).toEqual('zh-CN');
        });
    });

    describe('getTranslations', () => {
        test('returns zh-CN translations', () => {
            const state = {
                views: {
                    i18n: {
                        translations: {
                            'zh-CN': {
                                'test.hello_world': '你好，世界！',
                            },
                        },
                    },
                },
            };

            expect(getTranslations(state, 'zh-CN')).toBe(state.views.i18n.translations['zh-CN']);
        });

        test('returns zh-CN translations regardless of locale parameter', () => {
            const state = {
                views: {
                    i18n: {
                        translations: {
                            'zh-CN': {
                                'test.hello_world': '你好，世界！',
                            },
                        },
                    },
                },
            };

            // Even if 'en' is passed, we always return zh-CN translations
            expect(getTranslations(state, 'en')).toBe(state.views.i18n.translations['zh-CN']);
        });
    });
});
