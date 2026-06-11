// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {createIntl, useIntl} from 'react-intl';

import enMessages from 'i18n/en.json';
import zhCNMessages from 'i18n/zh-CN.json';
import {renderWithContext, screen} from 'tests/react_testing_utils';
import {TestHelper} from 'utils/test_helper';

import LatestPostReader from './latest_post_reader';

jest.mock('react-intl', () => ({
    ...jest.requireActual('react-intl'),
    useIntl: jest.fn(),
}));

describe('LatestPostReader', () => {
    const author = TestHelper.getUserMock({
        username: 'some_user',
    });

    const post = TestHelper.getPostMock({
        user_id: author.id,
        message: 'This is a test.',
    });

    const baseState = {
        entities: {
            emojis: {
                customEmoji: {},
            },
            general: {
                config: {},
            },
            posts: {
                posts: {
                    [post.id]: post,
                },
                reactions: {},
            },
            preferences: {
                myPreferences: {},
            },
            users: {
                profiles: {
                    [author.id]: author,
                },
            },
        },
    };

    const baseProps = {
        postIds: [post.id],
        autotranslated: false,
    };

    test('should render aria-label as a child in the given locale', () => {
        (useIntl as jest.Mock).mockImplementation(() => createIntl({locale: 'en', messages: enMessages, defaultLocale: 'en'}));

        const {rerender} = renderWithContext(
            <LatestPostReader {...baseProps}/>,
            baseState,
        );

        const prevMessage = screen.getByText(`January 1, ${author.username} wrote, This is a test`, {exact: false});
        expect(prevMessage).toBeInTheDocument();
        expect(prevMessage).toHaveClass('sr-only');

        (useIntl as jest.Mock).mockImplementation(() => createIntl({locale: 'zh-CN', messages: zhCNMessages, defaultLocale: 'zh-CN'}));

        rerender(<LatestPostReader {...baseProps}/>);
        const januaryInChinese = '一月';
        const message = screen.getByText(`${januaryInChinese}, ${author.username} wrote, This is a test`, {exact: false});

        expect(message).toBeInTheDocument();
        expect(message).toHaveClass('sr-only');
    });

    test('should be able to handle an empty post array', () => {
        const props = {
            ...baseProps,
            postIds: [],
        };

        renderWithContext(<LatestPostReader {...props}/>, baseState);

        // body should be empty
        const message = screen.queryByText('This is a test');
        expect(message).not.toBeInTheDocument();
    });
});
