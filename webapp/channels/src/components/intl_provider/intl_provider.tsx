// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect} from 'react';
import type {ReactNode} from 'react';
import {IntlProvider as BaseIntlProvider, useIntl} from 'react-intl';
import type {IntlConfig} from 'react-intl';

import {setLocalizeFunction} from 'mattermost-redux/utils/i18n_utils';

import * as I18n from 'i18n/i18n';
import {setIntl} from 'utils/i18n';
import {localizeMessage} from 'utils/utils';

import type {Translations} from 'types/store/i18n';

type Props = {
    children: ReactNode;
    locale: IntlConfig['locale'];
    translations?: IntlConfig['messages'];
    actions: {
        loadTranslations: (locale: string, url: string | Translations) => void;
    };
};

/**
 * Captures the intl instance from BaseIntlProvider and stores it
 * so that getIntl() can return the same instance.
 */
function IntlCapture() {
    const intl = useIntl();

    useEffect(() => {
        setIntl(intl);
    }, [intl]);

    return null;
}

export default class IntlProvider extends React.PureComponent<Props> {
    getNormalizedLocale = () => {
        return 'zh-CN';
    };

    componentDidMount() {
        // Pass localization function back to mattermost-redux
        setLocalizeFunction(localizeMessage);

        this.handleLocaleChange();
    }

    // Locale change detection removed - only zh-CN is supported

    handleLocaleChange = () => {
        this.loadTranslationsIfNecessary();
    };

    loadTranslationsIfNecessary = () => {
        if (this.props.translations) {
            // Already loaded
            return;
        }
        const localeInfo = I18n.getLanguageInfo('zh-CN');

        if (!localeInfo) {
            return;
        }

        this.props.actions.loadTranslations('zh-CN', localeInfo.url);
    };

    render() {
        if (!this.props.translations) {
            return null;
        }

        return (
            <BaseIntlProvider
                key='zh-CN'
                locale='zh-CN'
                messages={this.props.translations}
                textComponent='span'
                wrapRichTextChunksInFragment={false}
                onError={(err) => {
                    // Suppress MISSING_TRANSLATION warnings in production
                    // to avoid console noise from missing translation keys.
                    // The defaultMessage fallback handles the actual display.
                    if (err.code === 'MISSING_TRANSLATION') {
                        return;
                    }
                    console.error(err);
                }}
            >
                <IntlCapture/>
                {this.props.children}
            </BaseIntlProvider>
        );
    }
}
