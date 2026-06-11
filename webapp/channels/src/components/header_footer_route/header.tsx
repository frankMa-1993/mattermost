// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import classNames from 'classnames';
import React from 'react';
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';

import {getConfig} from 'mattermost-redux/selectors/entities/general';

import BackButton from 'components/common/back_button';
import LongzhiLogo from 'components/common/svg_images_components/longzhi_logo_svg';

import './header.scss';

export type HeaderProps = {
    alternateLink?: React.ReactElement;
    backButtonURL?: string;
    onBackButtonClick?: React.EventHandler<React.MouseEvent>;
}

const Header = ({alternateLink, backButtonURL, onBackButtonClick}: HeaderProps) => {
    const {SiteName} = useSelector(getConfig);

    const ariaLabel = SiteName || '龙智协同';

    const logo = (
        <LongzhiLogo
            width={152}
            height={36}
        />
    );

    return (
        <div className={classNames('hfroute-header')}>
            <div className='header-main'>
                <div>
                    <Link
                        className='header-logo-link'
                        to='/'
                        aria-label={ariaLabel}
                    >
                        {logo}
                    </Link>
                </div>
                {alternateLink}
            </div>
            {onBackButtonClick && (
                <BackButton
                    className='header-back-button'
                    url={backButtonURL}
                    onClick={onBackButtonClick}
                />
            )}
        </div>
    );
};

export default Header;
