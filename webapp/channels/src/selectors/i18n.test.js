// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {General} from 'mattermost-redux/constants';

import {getCurrentLocale, getTranslations} from 'selectors/i18n';

describe('selectors/i18n', () => {
    describe('getCurrentLocale', () => {
        test('not logged in', () => {
            const state = {
                entities: {
                    general: {
                        config: {
                            DefaultClientLocale: 'fr',
                        },
                    },
                    users: {
                        currentUserId: '',
                        profiles: {},
                    },
                },
            };

            expect(getCurrentLocale(state)).toEqual('fr');
        });

        test('normalizes configured default locale before resolving current locale', () => {
            const state = {
                entities: {
                    general: {
                        config: {
                            DefaultClientLocale: ' zh_cn ',
                        },
                    },
                    users: {
                        currentUserId: '',
                        profiles: {},
                    },
                },
            };

            expect(getCurrentLocale(state)).toEqual('zh-CN');
        });

        test('logged in', () => {
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

            expect(getCurrentLocale(state)).toEqual('de');
        });

        test('normalizes current user locale before resolving current locale', () => {
            const state = {
                entities: {
                    general: {
                        config: {
                            DefaultClientLocale: 'en',
                        },
                    },
                    users: {
                        currentUserId: 'abcd',
                        profiles: {
                            abcd: {
                                locale: 'zh_cn',
                            },
                        },
                    },
                },
            };

            expect(getCurrentLocale(state)).toEqual('zh-CN');
        });

        test('returns default locale when invalid user locale specified', () => {
            const state = {
                entities: {
                    general: {
                        config: {
                            DefaultClientLocale: 'en',
                        },
                    },
                    users: {
                        currentUserId: 'abcd',
                        profiles: {
                            abcd: {
                                locale: 'not_valid',
                            },
                        },
                    },
                },
            };

            expect(getCurrentLocale(state)).toEqual(General.DEFAULT_LOCALE);
        });

        test('falls back to configured DefaultClientLocale when user locale is not available', () => {
            const state = {
                entities: {
                    general: {
                        config: {
                            DefaultClientLocale: 'zh-CN',
                            AvailableLocales: 'zh-CN',
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

            // User locale 'en' is not in AvailableLocales ('zh-CN'),
            // should fall back to DefaultClientLocale 'zh-CN' instead of hardcoded 'en'
            expect(getCurrentLocale(state)).toEqual('zh-CN');
        });

        describe('locale from query parameter', () => {
            const setWindowLocaleQueryParameter = (locale) => {
                const url = new URL(window.location.href);
                url.searchParams.set('locale', locale);
                window.history.replaceState({}, '', url.toString());
            };

            afterEach(() => {
                // Reset the URL
                window.history.replaceState({}, '', 'http://localhost:8065/');
            });

            test('returns locale from query parameter if provided and not logged in', () => {
                const state = {
                    entities: {
                        general: {
                            config: {
                                DefaultClientLocale: 'fr',
                            },
                        },
                        users: {
                            currentUserId: '',
                            profiles: {},
                        },
                    },
                };

                setWindowLocaleQueryParameter('ko');

                expect(getCurrentLocale(state)).toEqual('ko');
            });

            test('normalizes locale from query parameter if provided and not logged in', () => {
                const state = {
                    entities: {
                        general: {
                            config: {
                                DefaultClientLocale: 'fr',
                            },
                        },
                        users: {
                            currentUserId: '',
                            profiles: {},
                        },
                    },
                };

                setWindowLocaleQueryParameter('zh_cn');

                expect(getCurrentLocale(state)).toEqual('zh-CN');
            });

            test('returns DefaultClientLocale if locale from query parameter is not valid', () => {
                const state = {
                    entities: {
                        general: {
                            config: {
                                DefaultClientLocale: 'fr',
                            },
                        },
                        users: {
                            currentUserId: '',
                            profiles: {},
                        },
                    },
                };

                setWindowLocaleQueryParameter('invalid_locale');

                expect(getCurrentLocale(state)).toEqual('fr');
            });

            test('returns user locale when logged in and locale is provided in query parameter', () => {
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

                setWindowLocaleQueryParameter('ko');

                expect(getCurrentLocale(state)).toEqual('de');
            });
        });
    });

    describe('getTranslations', () => {
        const state = {
            views: {
                i18n: {
                    translations: {
                        en: {
                            'test.hello_world': 'Hello, World!',
                        },
                    },
                },
            },
        };

        test('returns loaded translations', () => {
            expect(getTranslations(state, 'en')).toBe(state.views.i18n.translations.en);
        });

        test('returns loaded translations for normalized locale', () => {
            state.views.i18n.translations['zh-CN'] = {
                'test.hello_world': '你好，世界！',
            };

            expect(getTranslations(state, 'zh_cn')).toBe(state.views.i18n.translations['zh-CN']);
        });

        test('returns null for unloaded translations', () => {
            expect(getTranslations(state, 'fr')).toEqual(undefined);
        });

        test('returns English translations for unsupported locale', () => {
            // This test will have to be changed if we add support for Gaelic
            expect(getTranslations(state, 'gd')).toBe(state.views.i18n.translations.en);
        });
    });
});
