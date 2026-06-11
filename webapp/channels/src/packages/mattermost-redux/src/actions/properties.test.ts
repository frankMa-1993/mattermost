// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import nock from 'nock';

import type {ServerError} from '@mattermost/types/errors';

import * as Actions from 'mattermost-redux/actions/properties';
import {Client4} from 'mattermost-redux/client';

import TestHelper from '../../test/test_helper';
import configureStore from '../../test/test_store';

describe('Actions.Properties', () => {
    let store = configureStore();

    beforeAll(() => {
        TestHelper.initBasic(Client4);
    });

    beforeEach(() => {
        store = configureStore({
            entities: {
                users: {
                    currentUserId: '',
                },
            },
        });
    });

    afterAll(() => {
        TestHelper.tearDown();
    });

    const sessionExpiredError: ServerError = {
        message: 'Session is invalid or expired. Please log in again.',
        server_error_id: 'api.context.session_expired.app_error',
        status_code: 401,
        url: '/api/v4/properties/groups/access_control/system/values',
    };

    it('fetchSystemPropertyValues swallows unauthenticated bootstrap 401s before the user loads', async () => {
        nock(Client4.getBaseRoute()).
            get('/properties/groups/access_control/system/values').
            reply(401, sessionExpiredError);

        await expect(store.dispatch(Actions.fetchSystemPropertyValues('access_control'))).resolves.toEqual({data: []});
    });

    it('fetchPropertyFields swallows unauthenticated bootstrap 401s before the user loads', async () => {
        nock(Client4.getBaseRoute()).
            get('/properties/groups/access_control/system/fields').
            query(true).
            reply(401, {
                ...sessionExpiredError,
                url: '/api/v4/properties/groups/access_control/system/fields?target_type=system&target_id=system',
            });

        await expect(
            store.dispatch(Actions.fetchPropertyFields('access_control', 'system', 'system', 'system')),
        ).resolves.toEqual({data: []});
    });
});
