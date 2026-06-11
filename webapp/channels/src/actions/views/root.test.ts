// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import * as Actions from 'actions/views/root';

import mockStore from 'tests/test_store';

describe('root view actions', () => {
    describe('registerPluginTranslationsSource', () => {
        test('Should be a no-op in zh-CN-only mode', () => {
            const testStore = mockStore({});

            testStore.dispatch(Actions.registerPluginTranslationsSource('plugin_id', jest.fn()));
            expect(testStore.getActions()).toEqual([]);
        });
    });
});
