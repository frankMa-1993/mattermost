// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect} from 'react';
import {useIntl} from 'react-intl';
import {useDispatch} from 'react-redux';

import {selectLhsItem} from 'actions/views/lhs';
import {suppressRHS, unsuppressRHS} from 'actions/views/rhs';

import type {SidebarStaticPageConfig} from 'components/sidebar/sidebar_static_pages';

import {LhsItemType} from 'types/store/lhs';

import './static_page.scss';

type Props = {
    config: SidebarStaticPageConfig;
};

function StaticPage({config}: Props) {
    const {formatMessage} = useIntl();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(selectLhsItem(LhsItemType.Page, config.lhsPage));
        dispatch(suppressRHS);

        return () => {
            dispatch(unsuppressRHS);
        };
    }, [config.lhsPage, dispatch]);

    return (
        <div className='StaticPage app__content'>
            <div className='StaticPage__inner'>
                <h1 className='StaticPage__title'>
                    {formatMessage(config.mainPage.title)}
                </h1>
                <p className='StaticPage__description'>
                    {formatMessage(config.mainPage.description)}
                </p>
            </div>
        </div>
    );
}

export default React.memo(StaticPage);
