// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// Simplified for Chinese-only (zh-CN) support

/* eslint-disable */

import zhCN from './zh-CN.json';

type TranslationsMap = {
    [id: string]: string,
};

export const langIDs = ["zh-CN"];

export const langLabels = {"zh-CN":"中文（中国大陆）"};

export const langFiles: {[langID: string]: TranslationsMap} = {'zh-CN':zhCN};
