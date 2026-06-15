// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {defineMessages} from 'react-intl';

import {LhsPage} from 'types/store/lhs';

import {SidebarPrimaryTab} from './sidebar_primary_nav/types';

export type SidebarStaticPageConfig = {
    tab: SidebarPrimaryTab;
    lhsPage: LhsPage;
    showSidebarMenu?: boolean;
    sidebarMenu: {
        emptyTitle: {id: string; defaultMessage: string};
        emptyDescription: {id: string; defaultMessage: string};
    };
    mainPage: {
        title: {id: string; defaultMessage: string};
        description: {id: string; defaultMessage: string};
    };
};

const messages = defineMessages({
    homeSidebarTitle: {
        id: 'sidebar_static_menu.home.empty_title',
        defaultMessage: 'Home',
    },
    homeSidebarDescription: {
        id: 'sidebar_static_menu.home.empty_description',
        defaultMessage: 'Home navigation will appear here.',
    },
    homePageTitle: {
        id: 'static_page.home.title',
        defaultMessage: 'Home',
    },
    homePageDescription: {
        id: 'static_page.home.description',
        defaultMessage: 'Home content will be available here.',
    },
    aiWorkbenchSidebarTitle: {
        id: 'sidebar_static_menu.ai_workbench.empty_title',
        defaultMessage: 'AI Workbench',
    },
    aiWorkbenchSidebarDescription: {
        id: 'sidebar_static_menu.ai_workbench.empty_description',
        defaultMessage: 'AI Workbench navigation will appear here.',
    },
    aiWorkbenchPageTitle: {
        id: 'static_page.ai_workbench.title',
        defaultMessage: 'AI Workbench',
    },
    aiWorkbenchPageDescription: {
        id: 'static_page.ai_workbench.description',
        defaultMessage: 'AI Workbench content will be available here.',
    },
    tasksSidebarTitle: {
        id: 'sidebar_static_menu.tasks.empty_title',
        defaultMessage: 'Tasks',
    },
    tasksSidebarDescription: {
        id: 'sidebar_static_menu.tasks.empty_description',
        defaultMessage: 'Task navigation will appear here.',
    },
    tasksPageTitle: {
        id: 'static_page.tasks.title',
        defaultMessage: 'Tasks',
    },
    tasksPageDescription: {
        id: 'static_page.tasks.description',
        defaultMessage: 'Task content will be available here.',
    },
    contactsSidebarTitle: {
        id: 'sidebar_static_menu.contacts.empty_title',
        defaultMessage: 'Contacts',
    },
    contactsSidebarDescription: {
        id: 'sidebar_static_menu.contacts.empty_description',
        defaultMessage: 'Contact navigation will appear here.',
    },
    contactsPageTitle: {
        id: 'static_page.contacts.title',
        defaultMessage: 'Contacts',
    },
    contactsPageDescription: {
        id: 'static_page.contacts.description',
        defaultMessage: 'Contact content will be available here.',
    },
    meetingsSidebarTitle: {
        id: 'sidebar_static_menu.meetings.empty_title',
        defaultMessage: 'Meeting Schedule',
    },
    meetingsSidebarDescription: {
        id: 'sidebar_static_menu.meetings.empty_description',
        defaultMessage: 'Meeting schedule navigation will appear here.',
    },
    meetingsPageTitle: {
        id: 'static_page.meetings.title',
        defaultMessage: 'Meeting Schedule',
    },
    meetingsPageDescription: {
        id: 'static_page.meetings.description',
        defaultMessage: 'Meeting schedule content will be available here.',
    },
    knowledgeBaseSidebarTitle: {
        id: 'sidebar_static_menu.knowledge_base.empty_title',
        defaultMessage: 'Knowledge Base',
    },
    knowledgeBaseSidebarDescription: {
        id: 'sidebar_static_menu.knowledge_base.empty_description',
        defaultMessage: 'Knowledge base navigation will appear here.',
    },
    knowledgeBasePageTitle: {
        id: 'static_page.knowledge_base.title',
        defaultMessage: 'Knowledge Base',
    },
    knowledgeBasePageDescription: {
        id: 'static_page.knowledge_base.description',
        defaultMessage: 'Knowledge base content will be available here.',
    },
});

export const SIDEBAR_STATIC_PAGES: SidebarStaticPageConfig[] = [
    {
        tab: SidebarPrimaryTab.Home,
        lhsPage: LhsPage.Home,
        sidebarMenu: {
            emptyTitle: messages.homeSidebarTitle,
            emptyDescription: messages.homeSidebarDescription,
        },
        mainPage: {
            title: messages.homePageTitle,
            description: messages.homePageDescription,
        },
    },
    {
        tab: SidebarPrimaryTab.AIWorkbench,
        lhsPage: LhsPage.AIWorkbench,
        sidebarMenu: {
            emptyTitle: messages.aiWorkbenchSidebarTitle,
            emptyDescription: messages.aiWorkbenchSidebarDescription,
        },
        mainPage: {
            title: messages.aiWorkbenchPageTitle,
            description: messages.aiWorkbenchPageDescription,
        },
    },
    {
        tab: SidebarPrimaryTab.Tasks,
        lhsPage: LhsPage.Tasks,
        showSidebarMenu: false,
        sidebarMenu: {
            emptyTitle: messages.tasksSidebarTitle,
            emptyDescription: messages.tasksSidebarDescription,
        },
        mainPage: {
            title: messages.tasksPageTitle,
            description: messages.tasksPageDescription,
        },
    },
    {
        tab: SidebarPrimaryTab.Contacts,
        lhsPage: LhsPage.Contacts,
        showSidebarMenu: false,
        sidebarMenu: {
            emptyTitle: messages.contactsSidebarTitle,
            emptyDescription: messages.contactsSidebarDescription,
        },
        mainPage: {
            title: messages.contactsPageTitle,
            description: messages.contactsPageDescription,
        },
    },
    {
        tab: SidebarPrimaryTab.Meetings,
        lhsPage: LhsPage.Meetings,
        sidebarMenu: {
            emptyTitle: messages.meetingsSidebarTitle,
            emptyDescription: messages.meetingsSidebarDescription,
        },
        mainPage: {
            title: messages.meetingsPageTitle,
            description: messages.meetingsPageDescription,
        },
    },
    {
        tab: SidebarPrimaryTab.KnowledgeBase,
        lhsPage: LhsPage.KnowledgeBase,
        sidebarMenu: {
            emptyTitle: messages.knowledgeBaseSidebarTitle,
            emptyDescription: messages.knowledgeBaseSidebarDescription,
        },
        mainPage: {
            title: messages.knowledgeBasePageTitle,
            description: messages.knowledgeBasePageDescription,
        },
    },
];

export const STATIC_SIDEBAR_TABS = new Set(SIDEBAR_STATIC_PAGES.map((page) => page.tab));

export function getStaticPageConfigByTab(tab: SidebarPrimaryTab): SidebarStaticPageConfig | undefined {
    return SIDEBAR_STATIC_PAGES.find((page) => page.tab === tab);
}

export function getStaticPageConfigByLhsPage(lhsPage: LhsPage): SidebarStaticPageConfig | undefined {
    return SIDEBAR_STATIC_PAGES.find((page) => page.lhsPage === lhsPage);
}

export function getStaticPageConfigByPath(pathname: string, teamUrl: string): SidebarStaticPageConfig | undefined {
    const matchedPage = SIDEBAR_STATIC_PAGES.find((page) => isStaticPagePath(pathname, teamUrl, page.lhsPage));
    if (matchedPage) {
        return matchedPage;
    }

    if (pathname === `${teamUrl}/documents` || pathname.startsWith(`${teamUrl}/documents/`)) {
        return getStaticPageConfigByLhsPage(LhsPage.KnowledgeBase);
    }

    return undefined;
}

export function isStaticPagePath(pathname: string, teamUrl: string, lhsPage: LhsPage): boolean {
    return pathname === `${teamUrl}/${lhsPage}` || pathname.startsWith(`${teamUrl}/${lhsPage}/`);
}

export function isAnyStaticPagePath(pathname: string, teamUrl: string): boolean {
    if (pathname === `${teamUrl}/documents` || pathname.startsWith(`${teamUrl}/documents/`)) {
        return true;
    }

    return SIDEBAR_STATIC_PAGES.some((page) => isStaticPagePath(pathname, teamUrl, page.lhsPage));
}
