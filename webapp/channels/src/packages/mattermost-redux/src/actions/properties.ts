// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import type {
    PropertyField,
    PropertyValue,
} from '@mattermost/types/properties';
import type {ServerError} from '@mattermost/types/errors';

import {logError} from 'mattermost-redux/actions/errors';
import {forceLogoutIfNecessary} from 'mattermost-redux/actions/helpers';
import {Client4} from 'mattermost-redux/client';
import type {ActionFuncAsync} from 'mattermost-redux/types/actions';

import PropertyTypes from '../action_types/properties';

function shouldIgnoreUnauthenticatedPropertyBootstrapError(error: ServerError, currentUserId: string) {
    return !currentUserId && (
        error.status_code === 401 ||
        error.server_error_id === 'api.context.session_expired.app_error'
    );
}

/**
 * Fetches property fields for a given group, object type, and target scope,
 * then stores them in the Redux property fields state.
 */
export function fetchPropertyFields(
    groupName: string,
    objectType: string,
    targetType: string,
    targetId?: string,
): ActionFuncAsync<PropertyField[]> {
    return async (dispatch, getState) => {
        try {
            let fields: PropertyField[] = [];
            const maxItems = 500;
            let fetched = 0;
            let cursorId: string | undefined;
            let cursorCreateAt: number | undefined;

            while (fetched < maxItems) {
                // eslint-disable-next-line no-await-in-loop
                const page = await Client4.getPropertyFields(
                    groupName,
                    objectType,
                    targetType,
                    targetId,
                    {cursorId, cursorCreateAt},
                );
                fields = fields.concat(page);

                if (page.length === 0) {
                    break;
                }

                fetched += page.length;
                const last = page[page.length - 1];
                cursorId = last.id;
                cursorCreateAt = last.create_at;
            }

            dispatch({
                type: PropertyTypes.RECEIVED_PROPERTY_FIELDS,
                data: {fields},
            });

            return {data: fields};
        } catch (error) {
            const normalizedError = error as ServerError;
            const {currentUserId} = getState().entities.users;
            forceLogoutIfNecessary(normalizedError, dispatch, getState);

            if (shouldIgnoreUnauthenticatedPropertyBootstrapError(normalizedError, currentUserId)) {
                return {data: []};
            }

            dispatch(logError(normalizedError));
            return {error: normalizedError};
        }
    };
}

/**
 * Fetches all system-scoped property values for a given group via the
 * dedicated `/system/values` endpoint, then stores them in Redux.
 */
export function fetchSystemPropertyValues<T = unknown>(
    groupName: string,
): ActionFuncAsync<Array<PropertyValue<T>>> {
    return async (dispatch, getState) => {
        try {
            const values =
                (await Client4.getSystemPropertyValues<T>(groupName)) ?? [];

            dispatch({
                type: PropertyTypes.RECEIVED_PROPERTY_VALUES,
                data: {values},
            });

            return {data: values};
        } catch (error) {
            const normalizedError = error as ServerError;
            const {currentUserId} = getState().entities.users;
            forceLogoutIfNecessary(normalizedError, dispatch, getState);

            if (shouldIgnoreUnauthenticatedPropertyBootstrapError(normalizedError, currentUserId)) {
                return {data: []};
            }

            dispatch(logError(normalizedError));
            return {error: normalizedError};
        }
    };
}
