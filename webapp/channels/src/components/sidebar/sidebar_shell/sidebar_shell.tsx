// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import classNames from 'classnames';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, useLocation} from 'react-router-dom';

import {getCurrentRelativeTeamUrl} from 'mattermost-redux/selectors/entities/teams';

import {selectLhsItem, switchToLhsStaticPage} from 'actions/views/lhs';

import SidebarPrimaryNav from 'components/sidebar/sidebar_primary_nav/sidebar_primary_nav';
import {
    SIDEBAR_PRIMARY_TAB_STORAGE_KEY,
    SidebarPrimaryTab,
} from 'components/sidebar/sidebar_primary_nav/types';
import SidebarStaticMenu from 'components/sidebar/sidebar_static_menu/sidebar_static_menu';
import {
    getStaticPageConfigByPath,
    getStaticPageConfigByTab,
    isAnyStaticPagePath,
    SIDEBAR_STATIC_PAGES,
    STATIC_SIDEBAR_TABS,
} from 'components/sidebar/sidebar_static_pages';

import {LhsItemType} from 'types/store/lhs';

import './sidebar_shell.scss';

const LAST_MESSAGES_PATH_STORAGE_KEY = 'mattermost_sidebar_last_messages_path';

type Props = {
    messagesContent: React.ReactNode;
};

function SidebarShell({messagesContent}: Props) {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const teamUrl = useSelector(getCurrentRelativeTeamUrl);
    const shellRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState(SidebarPrimaryTab.Messages);

    const activeStaticPageConfig = STATIC_SIDEBAR_TABS.has(activeTab) ? getStaticPageConfigByTab(activeTab) : undefined;
    const shouldCollapseSidebar = activeStaticPageConfig?.showSidebarMenu === false;

    useEffect(() => {
        const staticPageConfig = getStaticPageConfigByPath(location.pathname, teamUrl);
        if (staticPageConfig) {
            setActiveTab(staticPageConfig.tab);
            return;
        }
        setActiveTab(SidebarPrimaryTab.Messages);
    }, [location.pathname, teamUrl]);

    useEffect(() => {
        const sidebarContainer = shellRef.current?.parentElement;
        if (!sidebarContainer) {
            return undefined;
        }

        sidebarContainer.classList.toggle('SidebarContainer--primaryNavOnly', shouldCollapseSidebar);

        return () => {
            sidebarContainer.classList.remove('SidebarContainer--primaryNavOnly');
        };
    }, [shouldCollapseSidebar]);

    const handleTabChange = useCallback((tab: SidebarPrimaryTab) => {
        if (tab === activeTab) {
            return;
        }

        setActiveTab(tab);

        try {
            localStorage.setItem(SIDEBAR_PRIMARY_TAB_STORAGE_KEY, tab);
        } catch {
            // Ignore storage errors.
        }

        if (STATIC_SIDEBAR_TABS.has(tab)) {
            const staticPageConfig = getStaticPageConfigByTab(tab);
            if (!staticPageConfig) {
                return;
            }

            if (!isAnyStaticPagePath(location.pathname, teamUrl)) {
                try {
                    sessionStorage.setItem(LAST_MESSAGES_PATH_STORAGE_KEY, location.pathname);
                } catch {
                    // Ignore storage errors.
                }
            }
            dispatch(switchToLhsStaticPage(staticPageConfig.lhsPage));
            return;
        }

        let returnPath: string | null = null;
        try {
            returnPath = sessionStorage.getItem(LAST_MESSAGES_PATH_STORAGE_KEY);
        } catch {
            // Ignore storage errors.
        }

        const targetPath = returnPath && !isAnyStaticPagePath(returnPath, teamUrl) ?
            returnPath :
            `${teamUrl}/channels/town-square`;

        dispatch(selectLhsItem(LhsItemType.None));
        history.push(targetPath);
    }, [activeTab, dispatch, history, location.pathname, teamUrl]);

    return (
        <div
            ref={shellRef}
            className='SidebarShell'
        >
            <SidebarPrimaryNav
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />
            <div className='SidebarShell__panels'>
                <div
                    id={`sidebar_primary_panel_${SidebarPrimaryTab.Messages}`}
                    role='tabpanel'
                    aria-labelledby={`sidebar_primary_nav_tab_${SidebarPrimaryTab.Messages}`}
                    className={classNames('SidebarShell__panel', {
                        'SidebarShell__panel--active': activeTab === SidebarPrimaryTab.Messages,
                    })}
                >
                    {messagesContent}
                </div>
                {SIDEBAR_STATIC_PAGES.map((page) => (
                    <div
                        key={page.tab}
                        id={`sidebar_primary_panel_${page.tab}`}
                        role='tabpanel'
                        aria-labelledby={`sidebar_primary_nav_tab_${page.tab}`}
                        className={classNames('SidebarShell__panel', {
                            'SidebarShell__panel--active': activeTab === page.tab,
                        })}
                    >
                        <SidebarStaticMenu config={page}/>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default React.memo(SidebarShell);
