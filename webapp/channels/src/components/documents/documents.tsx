// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect} from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {useDispatch} from 'react-redux';

import {selectLhsItem} from 'actions/views/lhs';
import {suppressRHS, unsuppressRHS} from 'actions/views/rhs';

import {LhsItemType, LhsPage} from 'types/store/lhs';

import './documents.scss';

const messages = defineMessages({
    title: {
        id: 'documents_page.title',
        defaultMessage: 'Documents',
    },
    description: {
        id: 'documents_page.description',
        defaultMessage: 'Document content will be available here.',
    },
});

function Documents() {
    const {formatMessage} = useIntl();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(selectLhsItem(LhsItemType.Page, LhsPage.Documents));
        dispatch(suppressRHS);

        return () => {
            dispatch(unsuppressRHS);
        };
    }, [dispatch]);

    return (
        <div className='Documents app__content'>
            <div className='Documents__inner'>
                <h1 className='Documents__title'>
                    {formatMessage(messages.title)}
                </h1>
                <p className='Documents__description'>
                    {formatMessage(messages.description)}
                </p>
            </div>
        </div>
    );
}

export default React.memo(Documents);
