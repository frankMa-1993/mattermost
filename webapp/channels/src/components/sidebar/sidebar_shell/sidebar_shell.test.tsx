// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {Route} from 'react-router-dom';

import type {DeepPartial} from '@mattermost/types/utilities';

import {fireEvent, renderWithContext, screen} from 'tests/react_testing_utils';
import {TestHelper} from 'utils/test_helper';

import type {GlobalState} from 'types/store';

import SidebarShell from './sidebar_shell';

describe('SidebarShell', () => {
    const currentTeam = TestHelper.getTeamMock({
        id: 'team_id',
        name: 'test-team',
    });

    const initialState: DeepPartial<GlobalState> = {
        entities: {
            teams: {
                currentTeamId: currentTeam.id,
                teams: {
                    [currentTeam.id]: currentTeam,
                },
            },
        },
    };

    test('should show messages panel by default and preserve messages content when switching tabs', () => {
        renderWithContext(
            <Route path='/:team'>
                <SidebarShell messagesContent={<div>{'Messages panel content'}</div>}/>
            </Route>,
            initialState,
            {pathname: `/${currentTeam.name}/channels/town-square`},
        );

        expect(screen.getByText('Messages panel content')).toBeVisible();
        expect(screen.getByText('Knowledge base navigation will appear here.')).not.toBeVisible();

        fireEvent.click(screen.getByRole('tab', {name: /knowledge base/i}));

        expect(screen.getByText('Knowledge base navigation will appear here.')).toBeVisible();
        expect(screen.getByText('Messages panel content')).not.toBeVisible();

        fireEvent.click(screen.getByRole('tab', {name: /messages/i}));

        expect(screen.getByText('Messages panel content')).toBeVisible();
    });
});
