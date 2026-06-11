// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {render, screen} from '@testing-library/react';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import IntlProvider from 'components/intl_provider/intl_provider';

import {getLanguageInfo} from 'i18n/i18n';

describe('components/IntlProvider', () => {
    const messageId = 'test.hello_world';
    const baseProps = {
        locale: 'zh-CN',
        translations: {
            'test.hello_world': '你好，世界！',
        },
        actions: {
            loadTranslations: () => {}, // eslint-disable-line
        },
        children: (
            <FormattedMessage
                id={messageId}
                defaultMessage='Hello, World!'
            />
        ),
    };

    test('should render children when passed translation strings', () => {
        render(<IntlProvider {...baseProps}/>);

        expect(screen.getByText('你好，世界！')).toBeInTheDocument();
    });

    test('should render null when missing translation strings', () => {
        const props = {
            ...baseProps,
            translations: undefined,
        };

        const {container} = render(<IntlProvider {...props}/>);

        expect(container.firstChild).toBeNull();
    });

    test('on mount, should attempt to load missing translations for zh-CN', () => {
        const props = {
            ...baseProps,
            translations: undefined,
            actions: {
                loadTranslations: jest.fn(),
            },
        };

        render(<IntlProvider {...props}/>);

        expect(props.actions.loadTranslations).toHaveBeenCalledWith('zh-CN', getLanguageInfo('zh-CN').url);
    });

    test('on mount, should not attempt to load when given translations', () => {
        const props = {
            ...baseProps,
            actions: {
                loadTranslations: jest.fn(),
            },
        };

        render(<IntlProvider {...props}/>);

        expect(props.actions.loadTranslations).not.toHaveBeenCalled();
    });
});
