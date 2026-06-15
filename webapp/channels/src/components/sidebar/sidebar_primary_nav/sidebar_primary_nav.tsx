// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import classNames from 'classnames';
import React, {useCallback} from 'react';
import {defineMessages, useIntl} from 'react-intl';

import {
    AccountMultipleOutlineIcon,
    BookOutlineIcon,
    ClockOutlineIcon,
    CreationOutlineIcon,
    FormatListBulletedIcon,
    MessageTextOutlineIcon,
    ViewGridPlusOutlineIcon,
} from '@mattermost/compass-icons/components';

import {SidebarPrimaryTab} from './types';

import './sidebar_primary_nav.scss';

const messages = defineMessages({
    homeTab: {
        id: 'sidebar_primary_nav.home',
        defaultMessage: 'Home',
    },
    aiWorkbenchTab: {
        id: 'sidebar_primary_nav.ai_workbench',
        defaultMessage: 'AI Workbench',
    },
    messagesTab: {
        id: 'sidebar_primary_nav.messages',
        defaultMessage: 'Messages',
    },
    tasksTab: {
        id: 'sidebar_primary_nav.tasks',
        defaultMessage: 'Tasks',
    },
    contactsTab: {
        id: 'sidebar_primary_nav.contacts',
        defaultMessage: 'Contacts',
    },
    meetingsTab: {
        id: 'sidebar_primary_nav.meetings',
        defaultMessage: 'Meeting Schedule',
    },
    knowledgeBaseTab: {
        id: 'sidebar_primary_nav.knowledge_base',
        defaultMessage: 'Knowledge Base',
    },
});

type TabConfig = {
    id: SidebarPrimaryTab;
    label: string;
    icon: React.ReactNode;
};

type Props = {
    activeTab: SidebarPrimaryTab;
    onTabChange: (tab: SidebarPrimaryTab) => void;
};

function SidebarPrimaryNav({activeTab, onTabChange}: Props) {
    const {formatMessage} = useIntl();

    const tabs: TabConfig[] = [
        {
            id: SidebarPrimaryTab.Home,
            label: formatMessage(messages.homeTab)
        },
        {
            id: SidebarPrimaryTab.AIWorkbench,
            label: formatMessage(messages.aiWorkbenchTab)
        },
        {
            id: SidebarPrimaryTab.Messages,
            label: formatMessage(messages.messagesTab)
        },
        {
            id: SidebarPrimaryTab.Tasks,
            label: formatMessage(messages.tasksTab)
        },
        {
            id: SidebarPrimaryTab.Contacts,
            label: formatMessage(messages.contactsTab)
        },
        {
            id: SidebarPrimaryTab.Meetings,
            label: formatMessage(messages.meetingsTab)
        },
        {
            id: SidebarPrimaryTab.KnowledgeBase,
            label: formatMessage(messages.knowledgeBaseTab)
        },
    ];

    const handleKeyDown = useCallback((event: React.KeyboardEvent, tab: SidebarPrimaryTab) => {
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }
        event.preventDefault();
        onTabChange(tab);
    }, [onTabChange]);

    return (
        <nav
            className='SidebarPrimaryNav'
            role='tablist'
            aria-label={formatMessage({
                id: 'sidebar_primary_nav.aria_label',
                defaultMessage: 'Primary sidebar navigation',
            })}
        >
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        type='button'
                        role='tab'
                        id={`sidebar_primary_nav_tab_${tab.id}`}
                        aria-selected={isActive}
                        aria-controls={`sidebar_primary_panel_${tab.id}`}
                        tabIndex={isActive ? 0 : -1}
                        className={classNames('SidebarPrimaryNav__tab', {
                            'SidebarPrimaryNav__tab--active': isActive,
                        })}
                        onClick={() => onTabChange(tab.id)}
                        onKeyDown={(event) => handleKeyDown(event, tab.id)}
                    >
                        <span className='SidebarPrimaryNav__icon'>{tab.icon}</span>
                        <span className='SidebarPrimaryNav__label'>{tab.label}</span>
                    </button>
                );
            })}
        </nav>
    );
}

export default React.memo(SidebarPrimaryNav);
