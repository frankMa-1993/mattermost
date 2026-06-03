// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {defineMessages, useIntl} from 'react-intl';

import './sidebar_documents_menu.scss';

const messages = defineMessages({
    emptyTitle: {
        id: 'sidebar_documents_menu.empty_title',
        defaultMessage: 'Documents',
    },
    emptyDescription: {
        id: 'sidebar_documents_menu.empty_description',
        defaultMessage: 'Document navigation will appear here.',
    },
});

function SidebarDocumentsMenu() {
    const {formatMessage} = useIntl();

    return (
        <div
            className='SidebarDocumentsMenu'
            role='region'
            aria-label={formatMessage(messages.emptyTitle)}
        >
            <div className='SidebarDocumentsMenu__empty'>
                <p className='SidebarDocumentsMenu__title'>
                    {formatMessage(messages.emptyTitle)}
                </p>
                <p className='SidebarDocumentsMenu__description'>
                    {formatMessage(messages.emptyDescription)}
                </p>
            </div>
        </div>
    );
}

export default React.memo(SidebarDocumentsMenu);
