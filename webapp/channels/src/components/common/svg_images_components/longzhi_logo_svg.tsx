// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import styled from 'styled-components';

type Props = {
    width?: number;
    height?: number;
    className?: string;
}

const Svg = styled.svg.attrs({
    version: '1.1',
    xmlns: 'http://www.w3.org/2000/svg',
    xmlnsXlink: 'http://www.w3.org/1999/xlink',
})``;

/**
 * 龙智协同 (LongZhi XieTong) Logo
 * Consists of a dark rounded square with "AI" text and "龙智协同" Chinese text.
 */
export default (props: Props) => (
    <Svg
        className={props.className}
        width={props.width ? props.width.toString() : '152'}
        height={props.height ? props.height.toString() : '36'}
        viewBox='0 0 152 36'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
    >
        {/* Dark rounded square icon background */}
        <rect
            x='0'
            y='0'
            width='36'
            height='36'
            rx='8'
            fill='#0D1117'
        />
        {/* White "AI" text */}
        <text
            x='18'
            y='25'
            textAnchor='middle'
            fill='#FFFFFF'
            fontSize='19'
            fontWeight='bold'
            fontFamily='Arial, Helvetica, sans-serif'
        >
            {'AI'}
        </text>
        {/* "龙智协同" Chinese text */}
        <text
            x='48'
            y='25'
            fill='currentColor'
            fontSize='17'
            fontWeight='bold'
            fontFamily='"Microsoft YaHei", "PingFang SC", "Noto Sans SC", "Source Han Sans SC", sans-serif'
        >
            {'龙智协同'}
        </text>
    </Svg>
);
