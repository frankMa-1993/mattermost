// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {fireEvent, renderWithContext, screen} from 'tests/react_testing_utils';

import {SidebarPrimaryTab} from './types';
import SidebarPrimaryNav from './sidebar_primary_nav';

describe('SidebarPrimaryNav', () => {
    test('should render all primary tabs with messages selected by default', () => {
        const onTabChange = jest.fn();

        renderWithContext(
            <SidebarPrimaryNav
                activeTab={SidebarPrimaryTab.Messages}
                onTabChange={onTabChange}
            />,
        );

        expect(screen.getByRole('tab', {name: /messages/i})).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tab', {name: /home/i})).toHaveAttribute('aria-selected', 'false');
        expect(screen.getByRole('tab', {name: /knowledge base/i})).toHaveAttribute('aria-selected', 'false');
    });

    test('should call onTabChange when knowledge base tab is clicked', () => {
        const onTabChange = jest.fn();

        renderWithContext(
            <SidebarPrimaryNav
                activeTab={SidebarPrimaryTab.Messages}
                onTabChange={onTabChange}
            />,
        );

        fireEvent.click(screen.getByRole('tab', {name: /knowledge base/i}));
        expect(onTabChange).toHaveBeenCalledWith(SidebarPrimaryTab.KnowledgeBase);
    });
});
