// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {lazy} from 'react';
import {Route} from 'react-router-dom';

import {makeAsyncComponent} from 'components/async_load';
import LoadingScreen from 'components/loading_screen';
import {SIDEBAR_STATIC_PAGES} from 'components/sidebar/sidebar_static_pages';

import {LhsPage} from 'types/store/lhs';

import {TEAM_NAME_PATH_PATTERN} from 'utils/path';

const StaticPage = makeAsyncComponent('StaticPage', lazy(() => import('components/static_page/static_page')),
    (
        <div className='app__content'>
            <LoadingScreen/>
        </div>
    ),
);

export function renderStaticPageRoutes() {
    const knowledgeBasePage = SIDEBAR_STATIC_PAGES.find((page) => page.lhsPage === LhsPage.KnowledgeBase);

    return (
        <>
            {SIDEBAR_STATIC_PAGES.map((page) => (
                <Route
                    key={page.lhsPage}
                    path={`/:team(${TEAM_NAME_PATH_PATTERN})/${page.lhsPage}`}
                    render={() => <StaticPage config={page}/>}
                />
            ))}
            {knowledgeBasePage ? (
                <Route
                    path={`/:team(${TEAM_NAME_PATH_PATTERN})/documents`}
                    render={() => <StaticPage config={knowledgeBasePage}/>}
                />
            ) : null}
        </>
    );
}
