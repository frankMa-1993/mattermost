// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useIntl} from 'react-intl';

import type {SidebarStaticPageConfig} from 'components/sidebar/sidebar_static_pages';

import './sidebar_static_menu.scss';

type Props = {
    config: SidebarStaticPageConfig;
};

function SidebarStaticMenu({config}: Props) {
    const {formatMessage} = useIntl();

    if (config.showSidebarMenu === false) {
        return null;
    }

    return (
        <div
            className='SidebarStaticMenu'
            role='region'
            aria-label={formatMessage(config.sidebarMenu.emptyTitle)}
        >
            <div className='SidebarStaticMenu__empty'>
                <p className='SidebarStaticMenu__title'>
                    {formatMessage(config.sidebarMenu.emptyTitle)}
                </p>
                <p className='SidebarStaticMenu__description'>
                    {formatMessage(config.sidebarMenu.emptyDescription)}
                </p>
            </div>
        </div>
    );
}

export default React.memo(SidebarStaticMenu);
